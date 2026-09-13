import React, { useEffect, useRef, useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView
} from "react-native";

import { useRouter } from "expo-router";

import MapView, {
    Marker,
    Polyline
} from "react-native-maps";

import * as Location from "expo-location";

import { Ionicons } from "@expo/vector-icons";

import {
    addDoc,
    collection,
    doc,
    updateDoc
} from "firebase/firestore";

import { auth, db } from "../FirebaseConfig";

const getDistance = (lat1, lon1, lat2, lon2) => {

    const R = 6371000;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );
};

const formatDistance = distance => {

    if (!distance) {
        return "--";
    }

    if (distance < 1000) {
        return `${Math.round(distance)} m`;
    }

    return `${(distance / 1000).toFixed(1)} km`;
};

const getEta = distance => {

    if (!distance) {
        return "--";
    }

    const minutes = Math.max(
        1,
        Math.round(distance / 1000 / 5 * 60)
    );

    return `${minutes} min`;
};

const getPlaceName = async point => {

    try {

        const result = await Location.reverseGeocodeAsync(point);

        if (!result.length) {
            return "Current location";
        }

        const place = result[0];

        const parts = [
            place.name,
            place.street,
            place.city
        ].filter(Boolean);

        return [...new Set(parts)]
            .slice(0, 3)
            .join(", ");

    } catch {

        return "Current location";

    }
};

const LiveMap = () => {

    const router = useRouter();

    const [location, setLocation] = useState(null);
    const [locationName, setLocationName] = useState("Getting location...");
    const [destination, setDestination] = useState("");
    const [destinationLocation, setDestinationLocation] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [distance, setDistance] = useState(0);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [walking, setWalking] = useState(false);
    const [warning, setWarning] = useState(false);
    const [countdown, setCountdown] = useState(15);

    const mapRef = useRef(null);
    const subscription = useRef(null);
    const timer = useRef(null);
    const searchTimer = useRef(null);

    const startLocation = useRef(null);
    const currentLocation = useRef(null);
    const walkId = useRef(null);
    const startDistance = useRef(0);
    const warningShown = useRef(false);
    const savedLocations = useRef([]);

    useEffect(() => {

        getCurrentLocation();

        return () => {

            if (subscription.current) {
                subscription.current.remove();
            }

            if (timer.current) {
                clearInterval(timer.current);
            }

            if (searchTimer.current) {
                clearTimeout(searchTimer.current);
            }

        };

    }, []);

    const getCurrentLocation = async () => {

        try {

            const permission =
                await Location.requestForegroundPermissionsAsync();

            if (permission.status !== "granted") {

                setLoading(false);

                Alert.alert(
                    "Location Required",
                    "Please allow SafeWalk to use your location."
                );

                return;
            }

            const result =
                await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High
                });

            const point = {
                latitude: result.coords.latitude,
                longitude: result.coords.longitude
            };

            setLocation(point);

            startLocation.current = point;
            currentLocation.current = point;

            const name = await getPlaceName(point);

            setLocationName(name);
            setLoading(false);

        } catch (error) {

            setLoading(false);

            Alert.alert(
                "Location Error",
                error.message
            );

        }

    };

    const updateCurrentLocation = async () => {

        try {

            const result =
                await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High
                });

            const point = {
                latitude: result.coords.latitude,
                longitude: result.coords.longitude
            };

            setLocation(point);

            startLocation.current = point;
            currentLocation.current = point;

            const name = await getPlaceName(point);

            setLocationName(name);

            mapRef.current?.animateToRegion(
                {
                    ...point,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02
                },
                500
            );

        } catch (error) {

            Alert.alert(
                "Location Error",
                error.message
            );

        }

    };

    const searchPlaces = text => {

        setDestination(text);
        setDestinationLocation(null);
        setDistance(0);

        if (searchTimer.current) {
            clearTimeout(searchTimer.current);
        }

        if (text.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        searchTimer.current = setTimeout(async () => {

            try {

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=5&addressdetails=1`,
                    {
                        headers: {
                            Accept: "application/json",
                            "User-Agent": "SafeWalk Student App"
                        }
                    }
                );

                const data = await response.json();

                setSuggestions(data);

            } catch {

                setSuggestions([]);

            }

        }, 500);

    };

    const selectPlace = place => {

        const point = {
            latitude: Number(place.lat),
            longitude: Number(place.lon)
        };

        const name = place.display_name
            .split(",")
            .slice(0, 2)
            .join(",");

        setDestination(name);
        setDestinationLocation(point);
        setSuggestions([]);

        if (startLocation.current) {

            const newDistance = getDistance(
                startLocation.current.latitude,
                startLocation.current.longitude,
                point.latitude,
                point.longitude
            );

            setDistance(newDistance);

            mapRef.current?.fitToCoordinates(
                [
                    startLocation.current,
                    point
                ],
                {
                    edgePadding: {
                        top: 80,
                        right: 50,
                        bottom: 80,
                        left: 50
                    },
                    animated: true
                }
            );

        }

    };

    const createWalk = async () => {

        const user = auth.currentUser;

        if (!user) {

            Alert.alert(
                "Not Logged In",
                "Please sign in first."
            );

            return null;
        }

        const walk = {

            destination: destination,

            startLocation: startLocation.current,

            destinationLocation: destinationLocation,

            startedAt: new Date().toISOString(),

            endedAt: null,

            distance: 0,

            arrived: false,

            status: "active"

        };

        const result = await addDoc(
            collection(
                db,
                "users",
                user.uid,
                "walks"
            ),
            walk
        );

        walkId.current = result.id;

        return result.id;

    };

    const saveLocation = async point => {

        const user = auth.currentUser;

        if (!user || !walkId.current) {
            return;
        }

        await addDoc(
            collection(
                db,
                "users",
                user.uid,
                "walks",
                walkId.current,
                "locations"
            ),
            {
                latitude: point.latitude,
                longitude: point.longitude,
                timestamp: new Date().toISOString()
            }
        );

    };

    const startWalk = async () => {

        if (!destinationLocation) {

            Alert.alert(
                "Select Destination",
                "Choose a destination from the suggestions."
            );

            return;
        }

        if (!startLocation.current) {

            Alert.alert(
                "Location Required",
                "Your current location is not ready."
            );

            return;
        }

        try {

            setSaving(true);

            const firstDistance = getDistance(
                startLocation.current.latitude,
                startLocation.current.longitude,
                destinationLocation.latitude,
                destinationLocation.longitude
            );

            if (firstDistance < 30) {

                setSaving(false);

                Alert.alert(
                    "Already There",
                    "You are already at your destination."
                );

                return;
            }

            const id = await createWalk();

            if (!id) {
                setSaving(false);
                return;
            }

            const firstPoint = {
                latitude: startLocation.current.latitude,
                longitude: startLocation.current.longitude,
                timestamp: new Date().toISOString()
            };

            savedLocations.current = [firstPoint];

            setLocations([firstPoint]);
            setDistance(firstDistance);
            setWalking(true);
            startDistance.current = firstDistance;
            warningShown.current = false;

            await saveLocation(firstPoint);

            setSaving(false);

            subscription.current =
                await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 5,
                        timeInterval: 3000
                    },
                    async result => {

                        const point = {
                            latitude: result.coords.latitude,
                            longitude: result.coords.longitude
                        };

                        const savedPoint = {
                            ...point,
                            timestamp: new Date().toISOString()
                        };

                        setLocation(point);

                        currentLocation.current = point;

                        savedLocations.current = [
                            ...savedLocations.current,
                            savedPoint
                        ];

                        setLocations([
                            ...savedLocations.current
                        ]);

                        await saveLocation(savedPoint);

                        const newDistance = getDistance(
                            point.latitude,
                            point.longitude,
                            destinationLocation.latitude,
                            destinationLocation.longitude
                        );

                        setDistance(newDistance);

                        if (
                            newDistance < 30 &&
                            !warningShown.current
                        ) {

                            finishWalk(true);

                            return;
                        }

                        if (
                            newDistance >
                                startDistance.current + 300 &&
                            !warningShown.current
                        ) {

                            showWarning();

                        }

                    }
                );

        } catch (error) {

            setSaving(false);

            Alert.alert(
                "Walk Error",
                error.message
            );

        }

    };

    const showWarning = () => {

        warningShown.current = true;
        setWarning(true);
        setCountdown(15);

        timer.current = setInterval(() => {

            setCountdown(value => {

                if (value <= 1) {

                    clearInterval(timer.current);
                    timer.current = null;

                    alertContacts();

                    return 0;
                }

                return value - 1;

            });

        }, 1000);

    };

    const cancelWarning = () => {

        if (timer.current) {
            clearInterval(timer.current);
            timer.current = null;
        }

        setWarning(false);
        setCountdown(15);
        warningShown.current = false;

    };

    const alertContacts = async () => {

        const user = auth.currentUser;

        if (user && walkId.current) {

            try {

                await addDoc(
                    collection(
                        db,
                        "users",
                        user.uid,
                        "walks",
                        walkId.current,
                        "alerts"
                    ),
                    {
                        type: "route_deviation",
                        latitude:
                            currentLocation.current?.latitude,
                        longitude:
                            currentLocation.current?.longitude,
                        createdAt:
                            new Date().toISOString()
                    }
                );

                await updateDoc(
                    doc(
                        db,
                        "users",
                        user.uid,
                        "walks",
                        walkId.current
                    ),
                    {
                        status: "alerted"
                    }
                );

            } catch (error) {

                console.log(error);

            }

        }

        setWarning(false);

        Alert.alert(
            "Emergency Alert",
            "Your emergency alert has been recorded."
        );

    };

    const finishWalk = async arrived => {

        if (!walking || saving) {
            return;
        }

        try {

            setSaving(true);

            if (subscription.current) {
                subscription.current.remove();
                subscription.current = null;
            }

            if (timer.current) {
                clearInterval(timer.current);
                timer.current = null;
            }

            const user = auth.currentUser;

            if (user && walkId.current) {

                await updateDoc(
                    doc(
                        db,
                        "users",
                        user.uid,
                        "walks",
                        walkId.current
                    ),
                    {
                        endedAt:
                            new Date().toISOString(),

                        distance: distance,

                        arrived: arrived,

                        status:
                            arrived
                                ? "completed"
                                : "ended"
                    }
                );

            }

            setWalking(false);
            setWarning(false);
            setSaving(false);

            Alert.alert(
                arrived
                    ? "You Arrived"
                    : "Walk Ended",
                arrived
                    ? "You reached your destination."
                    : "Your walk has been saved."
            );

            router.back();

        } catch (error) {

            setSaving(false);

            Alert.alert(
                "Save Error",
                error.message
            );

        }

    };

    if (loading) {

        return (
            <View style={styles.center}>

                <ActivityIndicator
                    size="large"
                    color="#2463FF"
                />

                <Text style={styles.loadingText}>
                    Getting your location...
                </Text>

            </View>
        );

    }

    if (!location) {

        return (
            <View style={styles.center}>

                <View style={styles.iconCircle}>

                    <Ionicons
                        name="location-outline"
                        size={42}
                        color="#2463FF"
                    />

                </View>

                <Text style={styles.emptyTitle}>
                    Location Required
                </Text>

                <Text style={styles.emptyText}>
                    SafeWalk needs your location to track your walk.
                </Text>

                <TouchableOpacity
                    onPress={getCurrentLocation}
                    style={styles.primaryButton}
                >

                    <Text style={styles.buttonText}>
                        Try Again
                    </Text>

                </TouchableOpacity>

            </View>
        );

    }

    if (warning) {

        return (
            <View style={styles.warningScreen}>

                <View style={styles.warningIcon}>

                    <Ionicons
                        name="warning"
                        size={55}
                        color="#F5B400"
                    />

                </View>

                <Text style={styles.warningTitle}>
                    Are you OK?
                </Text>

                <Text style={styles.warningText}>
                    It looks like you've deviated{"\n"}
                    from your planned route.
                </Text>

                <Text style={styles.warningText}>
                    Please confirm that you're safe.
                </Text>

                <TouchableOpacity
                    onPress={cancelWarning}
                    style={styles.okButton}
                >

                    <Text style={styles.buttonText}>
                        YES, I'M OK
                    </Text>

                </TouchableOpacity>

                <Text style={styles.alertText}>
                    If you don't respond,{"\n"}
                    we'll alert your contacts in
                </Text>

                <Text style={styles.countdown}>
                    00:{String(countdown).padStart(2, "0")}
                </Text>

            </View>
        );

    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: 35
            }}
            style={styles.container}
        >

            <View style={styles.header}>

                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >

                    <Ionicons
                        name="chevron-back"
                        size={26}
                        color="#101A35"
                    />

                </TouchableOpacity>

                <Text style={styles.title}>
                    Start Walk
                </Text>

                <Text style={styles.subtitle}>
                    Pick your destination and stay safe.
                </Text>

            </View>

            <View style={styles.locationCard}>

                <View style={styles.locationIcon}>

                    <Ionicons
                        name="navigate"
                        size={21}
                        color="#2463FF"
                    />

                </View>

                <View style={{ flex: 1 }}>

                    <Text style={styles.label}>
                        Current Location
                    </Text>

                    <Text
                        numberOfLines={1}
                        style={styles.locationText}
                    >
                        {locationName}
                    </Text>

                </View>

                <TouchableOpacity
                    onPress={updateCurrentLocation}
                >

                    <Ionicons
                        name="locate-outline"
                        size={27}
                        color="#101A35"
                    />

                </TouchableOpacity>

            </View>

            <View style={styles.destinationCard}>

                <View style={styles.destinationIcon}>

                    <Ionicons
                        name="location"
                        size={21}
                        color="#F0445D"
                    />

                </View>

                <TextInput
                    value={destination}
                    onChangeText={searchPlaces}
                    placeholder="Where are you going?"
                    placeholderTextColor="#9AA4B8"
                    style={styles.destinationInput}
                />

                {destination.length > 0 && (
                    <TouchableOpacity
                        onPress={() => {
                            setDestination("");
                            setDestinationLocation(null);
                            setSuggestions([]);
                            setDistance(0);
                        }}
                    >

                        <Ionicons
                            name="close-circle"
                            size={22}
                            color="#9AA4B8"
                        />

                    </TouchableOpacity>
                )}

            </View>

            {suggestions.length > 0 && (

                <View style={styles.suggestions}>

                    {suggestions.map((place, index) => (

                        <TouchableOpacity
                            key={place.place_id}
                            onPress={() => selectPlace(place)}
                            style={{
                                ...styles.suggestion,
                                borderBottomWidth:
                                    index === suggestions.length - 1
                                        ? 0
                                        : 1
                            }}
                        >

                            <View style={styles.suggestionIcon}>

                                <Ionicons
                                    name="location-outline"
                                    size={20}
                                    color="#2463FF"
                                />

                            </View>

                            <View style={{ flex: 1 }}>

                                <Text
                                    numberOfLines={1}
                                    style={styles.suggestionTitle}
                                >
                                    {place.display_name
                                        .split(",")
                                        .slice(0, 2)
                                        .join(",")}
                                </Text>

                                <Text
                                    numberOfLines={1}
                                    style={styles.suggestionText}
                                >
                                    {place.display_name}
                                </Text>

                            </View>

                        </TouchableOpacity>

                    ))}

                </View>

            )}

            <View style={styles.mapContainer}>

                <MapView
                    ref={mapRef}
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.025,
                        longitudeDelta: 0.025
                    }}
                    showsUserLocation
                    showsMyLocationButton={false}
                >

                    <Marker
                        coordinate={location}
                        title="You are here"
                    />

                    {destinationLocation && (
                        <Marker
                            coordinate={destinationLocation}
                            title="Destination"
                        />
                    )}

                    {destinationLocation && (
                        <Polyline
                            coordinates={[
                                location,
                                destinationLocation
                            ]}
                            strokeWidth={4}
                        />
                    )}

                    {locations.length > 1 && (
                        <Polyline
                            coordinates={locations}
                            strokeWidth={5}
                        />
                    )}

                </MapView>

                <View style={styles.mapLabel}>

                    <Ionicons
                        name="navigate"
                        size={14}
                        color="white"
                    />

                    <Text style={styles.mapLabelText}>
                        You are here
                    </Text>

                </View>

                <TouchableOpacity
                    onPress={updateCurrentLocation}
                    style={styles.mapButton}
                >

                    <Ionicons
                        name="locate"
                        size={25}
                        color="#101A35"
                    />

                </TouchableOpacity>

            </View>

            <View style={styles.stats}>

                <View style={styles.stat}>

                    <Text style={styles.statValue}>
                        {formatDistance(distance)}
                    </Text>

                    <Text style={styles.statLabel}>
                        Distance
                    </Text>

                </View>

                <View style={styles.divider} />

                <View style={styles.stat}>

                    <Text style={styles.statValue}>
                        {getEta(distance)}
                    </Text>

                    <Text style={styles.statLabel}>
                        Estimated Time
                    </Text>

                </View>

                <View style={styles.divider} />

                <View style={styles.stat}>

                    <Ionicons
                        name="shield-checkmark"
                        size={24}
                        color="#20B843"
                    />

                    <Text style={styles.statLabel}>
                        {destinationLocation
                            ? "Safe Route"
                            : "Route Status"}
                    </Text>

                </View>

            </View>

            <TouchableOpacity
                onPress={startWalk}
                disabled={saving || walking}
                style={styles.startButton}
            >

                {saving ? (

                    <ActivityIndicator color="white" />

                ) : (

                    <>

                        <Ionicons
                            name="walk"
                            size={23}
                            color="white"
                        />

                        <Text style={styles.startButtonText}>
                            Start Walk
                        </Text>

                    </>

                )}

            </TouchableOpacity>

            {walking && (

                <TouchableOpacity
                    onPress={() => finishWalk(false)}
                    disabled={saving}
                    style={styles.endButton}
                >

                    <Ionicons
                        name="stop-circle-outline"
                        size={22}
                        color="white"
                    />

                    <Text style={styles.buttonText}>
                        {saving
                            ? "Saving Walk..."
                            : "End Walk"}
                    </Text>

                </TouchableOpacity>

            )}

        </ScrollView>
    );
};

const styles = {

    container: {
        flex: 1,
        backgroundColor: "#F6F8FC"
    },

    center: {
        flex: 1,
        backgroundColor: "#F6F8FC",
        justifyContent: "center",
        alignItems: "center",
        padding: 30
    },

    loadingText: {
        marginTop: 14,
        color: "#7180A2",
        fontSize: 15
    },

    header: {
        backgroundColor: "white",
        paddingTop: 55,
        paddingBottom: 25,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
    },

    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#F1F4F9",
        justifyContent: "center",
        alignItems: "center"
    },

    title: {
        fontSize: 32,
        fontWeight: "800",
        color: "#101A35",
        marginTop: 18
    },

    subtitle: {
        fontSize: 15,
        color: "#7180A2",
        marginTop: 6
    },

    locationCard: {
        margin: 20,
        marginBottom: 10,
        backgroundColor: "white",
        minHeight: 76,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E3E8F1",
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center"
    },

    locationIcon: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: "#EEF3FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },

    label: {
        fontSize: 13,
        color: "#7B87A4"
    },

    locationText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#101A35",
        marginTop: 4
    },

    destinationCard: {
        marginHorizontal: 20,
        backgroundColor: "white",
        minHeight: 76,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E3E8F1",
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center"
    },

    destinationIcon: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: "#FFF0F2",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },

    destinationInput: {
        flex: 1,
        fontSize: 16,
        color: "#101A35"
    },

    suggestions: {
        marginHorizontal: 20,
        marginTop: 6,
        backgroundColor: "white",
        borderRadius: 18,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E3E8F1",
        elevation: 4
    },

    suggestion: {
        minHeight: 65,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: "#EEF1F6"
    },

    suggestionIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#EEF3FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },

    suggestionTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#101A35"
    },

    suggestionText: {
        fontSize: 12,
        color: "#8B95AA",
        marginTop: 3
    },

    mapContainer: {
        height: 300,
        margin: 20,
        marginTop: 18,
        borderRadius: 22,
        overflow: "hidden"
    },

    mapLabel: {
        position: "absolute",
        left: 15,
        bottom: 15,
        backgroundColor: "#2463FF",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center"
    },

    mapLabelText: {
        color: "white",
        fontSize: 12,
        fontWeight: "700",
        marginLeft: 5
    },

    mapButton: {
        position: "absolute",
        right: 15,
        bottom: 15,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5
    },

    stats: {
        marginHorizontal: 20,
        backgroundColor: "white",
        minHeight: 100,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E3E8F1",
        flexDirection: "row",
        alignItems: "center"
    },

    stat: {
        flex: 1,
        alignItems: "center"
    },

    statValue: {
        fontSize: 19,
        fontWeight: "800",
        color: "#101A35"
    },

    statLabel: {
        fontSize: 12,
        color: "#7180A2",
        marginTop: 5
    },

    divider: {
        width: 1,
        height: 50,
        backgroundColor: "#E3E8F1"
    },

    startButton: {
        margin: 20,
        marginBottom: 0,
        height: 62,
        borderRadius: 20,
        backgroundColor: "#2463FF",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },

    startButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "800",
        marginLeft: 8
    },

    endButton: {
        marginHorizontal: 20,
        marginTop: 12,
        height: 56,
        borderRadius: 18,
        backgroundColor: "#F04444",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },

    buttonText: {
        color: "white",
        fontSize: 17,
        fontWeight: "700",
        marginLeft: 7
    },

    iconCircle: {
        width: 85,
        height: 85,
        borderRadius: 28,
        backgroundColor: "#EEF3FF",
        justifyContent: "center",
        alignItems: "center"
    },

    emptyTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#101A35",
        marginTop: 20
    },

    emptyText: {
        color: "#7180A2",
        fontSize: 15,
        textAlign: "center",
        lineHeight: 22,
        marginTop: 8
    },

    primaryButton: {
        marginTop: 25,
        backgroundColor: "#2463FF",
        paddingHorizontal: 32,
        paddingVertical: 15,
        borderRadius: 17
    },

    warningScreen: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 35
    },

    warningIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#FFF7D9",
        justifyContent: "center",
        alignItems: "center"
    },

    warningTitle: {
        fontSize: 34,
        fontWeight: "800",
        color: "#101010",
        marginTop: 25
    },

    warningText: {
        fontSize: 18,
        color: "#777",
        textAlign: "center",
        lineHeight: 27,
        marginTop: 18
    },

    okButton: {
        width: "100%",
        height: 58,
        backgroundColor: "#20B843",
        borderRadius: 17,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40
    },

    alertText: {
        color: "#777",
        fontSize: 17,
        fontWeight: "600",
        textAlign: "center",
        lineHeight: 25,
        marginTop: 45
    },

    countdown: {
        color: "#F04444",
        fontSize: 58,
        fontWeight: "800",
        marginTop: 18
    }

};

export default LiveMap;