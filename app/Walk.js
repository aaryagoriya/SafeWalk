import React, { useEffect, useRef, useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native";

import { useRouter } from "expo-router";

import MapView, {
    Marker,
    Polyline
} from "react-native-maps";

import * as Location from "expo-location";

import { Ionicons } from "@expo/vector-icons";

import { addDoc, collection } from "firebase/firestore";

import { auth, db } from "../FirebaseConfig";

const getDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371000;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return earthRadius * 2 * Math.atan2(
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
        Math.round((distance / 1000) / 5 * 60)
    );

    return `${minutes} min`;
};

const LiveMap = () => {

    const router = useRouter();

    const [location, setLocation] = useState(null);
    const [destination, setDestination] = useState("");
    const [destinationLocation, setDestinationLocation] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [distance, setDistance] = useState(0);
    const [walking, setWalking] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [warning, setWarning] = useState(false);
    const [countdown, setCountdown] = useState(15);
    const [locations, setLocations] = useState([]);

    const mapRef = useRef(null);
    const subscription = useRef(null);
    const warningTimer = useRef(null);
    const searchTimer = useRef(null);

    const startLocation = useRef(null);
    const currentLocation = useRef(null);
    const startDistance = useRef(0);
    const warningTriggered = useRef(false);
    const locationsRef = useRef([]);

    useEffect(() => {

        getCurrentLocation();

        return () => {

            if (subscription.current) {
                subscription.current.remove();
            }

            if (warningTimer.current) {
                clearInterval(warningTimer.current);
            }

            if (searchTimer.current) {
                clearTimeout(searchTimer.current);
            }

        };

    }, []);

    const getCurrentLocation = async () => {

        try {

            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {

                Alert.alert(
                    "Location Required",
                    "Please allow SafeWalk to access your location."
                );

                setLoading(false);
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

            setLoading(false);

        } catch (error) {

            setLoading(false);

            Alert.alert(
                "Location Error",
                error.message
            );

        }

    };

    const useCurrentLocation = async () => {

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

            if (mapRef.current) {

                mapRef.current.animateToRegion(
                    {
                        latitude: point.latitude,
                        longitude: point.longitude,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02
                    },
                    500
                );

            }

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

        searchTimer.current =
            setTimeout(async () => {

                try {

                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=5&addressdetails=1`,
                        {
                            headers: {
                                Accept:
                                    "application/json",
                                "User-Agent":
                                    "SafeWalk Student App"
                            }
                        }
                    );

                    const data = await response.json();

                    setSuggestions(data);

                } catch (error) {

                    setSuggestions([]);

                }

            }, 500);

    };

    const selectPlace = place => {

        const point = {
            latitude: Number(place.lat),
            longitude: Number(place.lon)
        };

        setDestination(
            place.display_name.split(",").slice(0, 2).join(",")
        );

        setDestinationLocation(point);
        setSuggestions([]);

        if (startLocation.current) {

            const newDistance =
                getDistance(
                    startLocation.current.latitude,
                    startLocation.current.longitude,
                    point.latitude,
                    point.longitude
                );

            setDistance(newDistance);

            if (mapRef.current) {

                mapRef.current.fitToCoordinates(
                    [
                        startLocation.current,
                        point
                    ],
                    {
                        edgePadding: {
                            top: 70,
                            right: 40,
                            bottom: 70,
                            left: 40
                        },
                        animated: true
                    }
                );

            }

        }

    };

    const startWalk = async () => {

        if (!destinationLocation) {

            if (!destination.trim()) {

                Alert.alert(
                    "Destination Required",
                    "Please enter and select a destination."
                );

                return;
            }

            Alert.alert(
                "Select Destination",
                "Please select a place from the suggestions."
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

        const firstDistance =
            getDistance(
                startLocation.current.latitude,
                startLocation.current.longitude,
                destinationLocation.latitude,
                destinationLocation.longitude
            );

        if (firstDistance < 30) {

            Alert.alert(
                "Already There",
                "You are already at the destination."
            );

            return;
        }

        setDistance(firstDistance);
        setWalking(true);

        startDistance.current = firstDistance;
        warningTriggered.current = false;

        const firstPoint = {
            latitude: startLocation.current.latitude,
            longitude: startLocation.current.longitude,
            timestamp: new Date().toISOString()
        };

        locationsRef.current = [firstPoint];

        setLocations([firstPoint]);

        subscription.current =
            await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 5,
                    timeInterval: 3000
                },
                newLocation => {

                    const point = {
                        latitude:
                            newLocation.coords.latitude,
                        longitude:
                            newLocation.coords.longitude
                    };

                    const savedPoint = {
                        ...point,
                        timestamp:
                            new Date().toISOString()
                    };

                    setLocation(point);

                    currentLocation.current = point;

                    locationsRef.current = [
                        ...locationsRef.current,
                        savedPoint
                    ];

                    setLocations([
                        ...locationsRef.current
                    ]);

                    const newDistance =
                        getDistance(
                            point.latitude,
                            point.longitude,
                            destinationLocation.latitude,
                            destinationLocation.longitude
                        );

                    setDistance(newDistance);

                    if (
                        newDistance < 30 &&
                        !warningTriggered.current
                    ) {

                        finishWalk(true);

                        return;
                    }

                    if (
                        newDistance >
                        startDistance.current + 300 &&
                        !warningTriggered.current
                    ) {

                        showWarning();

                    }

                }
            );

    };

    const showWarning = () => {

        warningTriggered.current = true;

        setWarning(true);
        setCountdown(15);

        warningTimer.current =
            setInterval(() => {

                setCountdown(value => {

                    if (value <= 1) {

                        clearInterval(
                            warningTimer.current
                        );

                        warningTimer.current = null;

                        alertContacts();

                        return 0;
                    }

                    return value - 1;

                });

            }, 1000);

    };

    const cancelWarning = () => {

        if (warningTimer.current) {

            clearInterval(
                warningTimer.current
            );

            warningTimer.current = null;

        }

        setWarning(false);
        setCountdown(15);

        warningTriggered.current = false;

    };

    const alertContacts = async () => {

        const user = auth.currentUser;

        if (user) {

            try {

                await addDoc(
                    collection(
                        db,
                        "users",
                        user.uid,
                        "walkAlerts"
                    ),
                    {
                        destination,
                        latitude:
                            currentLocation.current?.latitude ||
                            null,
                        longitude:
                            currentLocation.current?.longitude ||
                            null,
                        message:
                            "SafeWalk detected a route deviation.",
                        createdAt:
                            new Date().toISOString()
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

        setSaving(true);

        if (subscription.current) {

            subscription.current.remove();

            subscription.current = null;

        }

        if (warningTimer.current) {

            clearInterval(
                warningTimer.current
            );

            warningTimer.current = null;

        }

        const user = auth.currentUser;

        if (user) {

            try {

                await addDoc(
                    collection(
                        db,
                        "users",
                        user.uid,
                        "walks"
                    ),
                    {
                        destination,
                        startLocation:
                            startLocation.current,
                        destinationLocation,
                        locations:
                            locationsRef.current,
                        startedAt:
                            locationsRef.current[0]?.timestamp ||
                            new Date().toISOString(),
                        endedAt:
                            new Date().toISOString(),
                        arrived: arrived || false
                    }
                );

            } catch (error) {

                setSaving(false);

                Alert.alert(
                    "Save Error",
                    error.message
                );

                return;
            }

        }

        setWalking(false);
        setWarning(false);
        setSaving(false);

        Alert.alert(
            arrived
                ? "You Arrived"
                : "Walk Ended",
            "Your walk has been saved."
        );

        router.back();

    };

    if (loading) {

        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white"
                }}
            >

                <ActivityIndicator
                    size="large"
                    color="#2463FF"
                />

                <Text
                    style={{
                        marginTop: 15,
                        fontSize: 16
                    }}
                >
                    Getting your location...
                </Text>

            </View>
        );

    }

    if (!location) {

        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 30
                }}
            >

                <Ionicons
                    name="location-outline"
                    size={60}
                    color="#2463FF"
                />

                <Text
                    style={{
                        fontSize: 22,
                        fontWeight: "bold",
                        marginTop: 20
                    }}
                >
                    Location is required
                </Text>

                <TouchableOpacity
                    onPress={getCurrentLocation}
                    style={{
                        marginTop: 25,
                        backgroundColor: "#2463FF",
                        paddingHorizontal: 30,
                        paddingVertical: 15,
                        borderRadius: 15
                    }}
                >

                    <Text
                        style={{
                            color: "white",
                            fontWeight: "bold"
                        }}
                    >
                        Try Again
                    </Text>

                </TouchableOpacity>

            </View>
        );

    }

    if (warning) {

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "white",
                    paddingHorizontal: 45,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >

                <Ionicons
                    name="warning-outline"
                    size={100}
                    color="#FFB800"
                />

                <Text
                    style={{
                        fontSize: 36,
                        fontWeight: "bold",
                        marginTop: 35
                    }}
                >
                    Are you OK?
                </Text>

                <Text
                    style={{
                        color: "#888",
                        fontSize: 20,
                        textAlign: "center",
                        lineHeight: 28,
                        marginTop: 25
                    }}
                >
                    It looks like you've deviated{"\n"}
                    from your planned route
                </Text>

                <Text
                    style={{
                        color: "#888",
                        fontSize: 20,
                        textAlign: "center",
                        marginTop: 25
                    }}
                >
                    Please confirm that you're safe.
                </Text>

                <TouchableOpacity
                    onPress={cancelWarning}
                    style={{
                        width: "100%",
                        height: 52,
                        backgroundColor: "#20B843",
                        borderRadius: 16,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 60
                    }}
                >

                    <Text
                        style={{
                            color: "white",
                            fontSize: 20,
                            fontWeight: "bold"
                        }}
                    >
                        YES, I'M OK
                    </Text>

                </TouchableOpacity>

                <Text
                    style={{
                        color: "#888",
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        lineHeight: 28,
                        marginTop: 60
                    }}
                >
                    if you don't respond{"\n"}
                    we'll alert your contacts in
                </Text>

                <Text
                    style={{
                        color: "#F52F38",
                        fontSize: 64,
                        fontWeight: "bold",
                        marginTop: 25
                    }}
                >
                    00:{String(countdown).padStart(2, "0")}
                </Text>

            </View>
        );

    }

    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                backgroundColor: "#F8FAFF"
            }}
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }
        >

            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 30
                }}
            >

                <View
                    style={{
                        paddingTop: 55,
                        paddingHorizontal: 20
                    }}
                >

                    <TouchableOpacity
                        onPress={() => router.back()}
                    >

                        <Ionicons
                            name="chevron-back"
                            size={38}
                            color="#101A35"
                        />

                    </TouchableOpacity>

                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: 38,
                            fontWeight: "bold",
                            color: "#101A35",
                            marginTop: -35
                        }}
                    >
                        Start Walk
                    </Text>

                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: 19,
                            color: "#6D7897",
                            marginTop: 10
                        }}
                    >
                        Pick your destination and let us keep you safe.
                    </Text>

                </View>

                <View
                    style={{
                        marginTop: 30,
                        marginHorizontal: 20,
                        height: 70,
                        backgroundColor: "#EEF1F8",
                        borderRadius: 27,
                        flexDirection: "row",
                        padding: 5
                    }}
                >

                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: "#2463FF",
                            borderRadius: 22,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row"
                        }}
                    >

                        <Ionicons
                            name="location"
                            size={26}
                            color="white"
                        />

                        <Text
                            style={{
                                color: "white",
                                fontSize: 17,
                                marginLeft: 10
                            }}
                        >
                            Enter Location
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={useCurrentLocation}
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row"
                        }}
                    >

                        <Ionicons
                            name="locate"
                            size={27}
                            color="#101A35"
                        />

                        <Text
                            style={{
                                color: "#101A35",
                                fontSize: 16,
                                marginLeft: 8
                            }}
                        >
                            Use Current Location
                        </Text>

                    </TouchableOpacity>

                </View>

                <View
                    style={{
                        marginHorizontal: 20,
                        marginTop: 18,
                        backgroundColor: "white",
                        borderRadius: 25,
                        borderWidth: 1,
                        borderColor: "#E1E6F0",
                        minHeight: 85,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 18
                    }}
                >

                    <View
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 17,
                            backgroundColor: "#EAF0FF",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >

                        <View
                            style={{
                                width: 13,
                                height: 13,
                                borderRadius: 7,
                                backgroundColor: "#2463FF"
                            }}
                        />

                    </View>

                    <View
                        style={{
                            flex: 1,
                            marginLeft: 15
                        }}
                    >

                        <Text
                            style={{
                                color: "#7180A2",
                                fontSize: 16
                            }}
                        >
                            Current Location
                        </Text>

                        <Text
                            numberOfLines={1}
                            style={{
                                color: "#101A35",
                                fontSize: 18,
                                marginTop: 5
                            }}
                        >
                            Your current location
                        </Text>

                    </View>

                    <TouchableOpacity
                        onPress={useCurrentLocation}
                    >

                        <Ionicons
                            name="navigate-outline"
                            size={29}
                            color="#101A35"
                        />

                    </TouchableOpacity>

                </View>

                <View
                    style={{
                        marginHorizontal: 20,
                        marginTop: 18,
                        backgroundColor: "white",
                        borderRadius: 25,
                        borderWidth: 1,
                        borderColor: "#E1E6F0",
                        minHeight: 85,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 18
                    }}
                >

                    <Ionicons
                        name="location"
                        size={32}
                        color="#F4475D"
                    />

                    <TextInput
                        value={destination}
                        onChangeText={searchPlaces}
                        placeholder="Enter destination"
                        placeholderTextColor="#9BA5BC"
                        style={{
                            flex: 1,
                            fontSize: 18,
                            color: "#101A35",
                            marginLeft: 15
                        }}
                    />

                    {destination.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                setDestination("");
                                setSuggestions([]);
                                setDestinationLocation(null);
                                setDistance(0);
                            }}
                        >

                            <Ionicons
                                name="close"
                                size={28}
                                color="#7180A2"
                            />

                        </TouchableOpacity>
                    )}

                </View>

                {suggestions.length > 0 && (
                    <View
                        style={{
                            marginHorizontal: 20,
                            backgroundColor: "white",
                            borderRadius: 18,
                            borderWidth: 1,
                            borderColor: "#E1E6F0",
                            marginTop: 5,
                            overflow: "hidden",
                            elevation: 5
                        }}
                    >

                        {suggestions.map((place, index) => (

                            <TouchableOpacity
                                key={`${place.place_id}-${index}`}
                                onPress={() =>
                                    selectPlace(place)
                                }
                                style={{
                                    minHeight: 62,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingHorizontal: 15,
                                    borderBottomWidth:
                                        index === suggestions.length - 1
                                            ? 0
                                            : 1,
                                    borderBottomColor: "#EEF1F6"
                                }}
                            >

                                <Ionicons
                                    name="location-outline"
                                    size={25}
                                    color="#2463FF"
                                />

                                <View
                                    style={{
                                        flex: 1,
                                        marginLeft: 12
                                    }}
                                >

                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "600",
                                            color: "#101A35"
                                        }}
                                    >
                                        {place.display_name
                                            .split(",")
                                            .slice(0, 2)
                                            .join(",")}
                                    </Text>

                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontSize: 13,
                                            color: "#8993AA",
                                            marginTop: 3
                                        }}
                                    >
                                        {place.display_name}
                                    </Text>

                                </View>

                            </TouchableOpacity>

                        ))}

                    </View>
                )}

                <View
                    style={{
                        marginHorizontal: 20,
                        marginTop: 18,
                        height: 95,
                        backgroundColor: "white",
                        borderRadius: 25,
                        borderWidth: 1,
                        borderColor: "#E1E6F0",
                        flexDirection: "row"
                    }}
                >

                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            paddingLeft: 20
                        }}
                    >

                        <Ionicons
                            name="time-outline"
                            size={29}
                            color="#101A35"
                        />

                        <Text
                            style={{
                                color: "#7180A2",
                                fontSize: 14,
                                position: "absolute",
                                left: 65,
                                top: 17
                            }}
                        >
                            Estimated Time
                        </Text>

                        <Text
                            style={{
                                color: "#101A35",
                                fontSize: 18,
                                fontWeight: "500",
                                position: "absolute",
                                left: 65,
                                top: 43
                            }}
                        >
                            {getEta(distance)}
                        </Text>

                    </View>

                    <View
                        style={{
                            width: 1,
                            height: 65,
                            backgroundColor: "#E1E6F0",
                            alignSelf: "center"
                        }}
                    />

                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            paddingLeft: 20
                        }}
                    >

                        <Ionicons
                            name="shield-checkmark-outline"
                            size={29}
                            color="#101A35"
                        />

                        <Text
                            style={{
                                color: "#7180A2",
                                fontSize: 14,
                                position: "absolute",
                                left: 65,
                                top: 17
                            }}
                        >
                            Route Status
                        </Text>

                        <Text
                            style={{
                                color: "#101A35",
                                fontSize: 18,
                                fontWeight: "600",
                                position: "absolute",
                                left: 65,
                                top: 43
                            }}
                        >
                            {destinationLocation
                                ? "Mostly Safe"
                                : "--"}
                        </Text>

                    </View>

                </View>

                <View
                    style={{
                        marginHorizontal: 20,
                        marginTop: 18,
                        height: 310,
                        borderRadius: 25,
                        overflow: "hidden"
                    }}
                >

                    <MapView
                        ref={mapRef}
                        style={{
                            flex: 1
                        }}
                        initialRegion={{
                            latitude:
                                location.latitude,
                            longitude:
                                location.longitude,
                            latitudeDelta: 0.025,
                            longitudeDelta: 0.025
                        }}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                    >

                        <Marker
                            coordinate={location}
                            title="You are here"
                        />

                        {destinationLocation && (
                            <Marker
                                coordinate={
                                    destinationLocation
                                }
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

                    <View
                        style={{
                            position: "absolute",
                            bottom: 65,
                            left: 15,
                            backgroundColor: "#2463FF",
                            paddingHorizontal: 13,
                            paddingVertical: 7,
                            borderRadius: 15
                        }}
                    >

                        <Text
                            style={{
                                color: "white",
                                fontSize: 13,
                                fontWeight: "bold"
                            }}
                        >
                            You are here
                        </Text>

                    </View>

                    <TouchableOpacity
                        onPress={useCurrentLocation}
                        style={{
                            position: "absolute",
                            right: 15,
                            bottom: 15,
                            width: 55,
                            height: 55,
                            borderRadius: 30,
                            backgroundColor: "white",
                            justifyContent: "center",
                            alignItems: "center",
                            elevation: 5
                        }}
                    >

                        <Ionicons
                            name="locate"
                            size={28}
                            color="#101A35"
                        />

                    </TouchableOpacity>

                </View>

                <TouchableOpacity
                    onPress={startWalk}
                    disabled={saving}
                    style={{
                        marginHorizontal: 20,
                        marginTop: 20,
                        height: 70,
                        backgroundColor: "#2463FF",
                        borderRadius: 25,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >

                    <Text
                        style={{
                            color: "white",
                            fontSize: 21,
                            fontWeight: "bold"
                        }}
                    >
                        Start Walk
                    </Text>

                </TouchableOpacity>

                {walking && (
                    <TouchableOpacity
                        onPress={() =>
                            finishWalk(false)
                        }
                        disabled={saving}
                        style={{
                            marginHorizontal: 20,
                            marginTop: 12,
                            height: 60,
                            backgroundColor: "#F44747",
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >

                        <Text
                            style={{
                                color: "white",
                                fontSize: 18,
                                fontWeight: "bold"
                            }}
                        >
                            {saving
                                ? "Saving Walk..."
                                : "End Walk"}
                        </Text>

                    </TouchableOpacity>
                )}

            </ScrollView>

        </KeyboardAvoidingView>
    );
};

export default LiveMap;