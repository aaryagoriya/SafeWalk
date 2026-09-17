import React, { useEffect, useRef, useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    Alert
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter } from "expo-router";

import MapView, {
    Marker
} from "react-native-maps";

import * as Location from "expo-location";

import { Ionicons } from "@expo/vector-icons";

const LiveMap = () => {

    const router = useRouter();

    const [location, setLocation] = useState(null);

    const [loading, setLoading] = useState(true);

    const [sosActive, setSosActive] = useState(true);

    const [contacts, setContacts] = useState([]);

    const subscription = useRef(null);

    useEffect(() => {

        getContacts();

        startSOS();

        return () => {

            if (subscription.current) {

                subscription.current.remove();

                subscription.current = null;

            }

        };

    }, []);

    const getContacts = async () => {

        try {

            const contactsData =
                await AsyncStorage.getItem("contacts");

            if (contactsData) {

                setContacts(JSON.parse(contactsData));

            }

        } catch (error) {

            console.log(error);

        }

    };

    const startSOS = async () => {

        try {

            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {

                Alert.alert(
                    "Location Required",
                    "Please allow SafeWalk to access your location."
                );

                setLoading(false);

                setSosActive(false);

                return;

            }

            const currentLocation =
                await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High
                });

            const firstLocation = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude
            };

            setLocation(firstLocation);

            setLoading(false);

            subscription.current =
                await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 5
                    },
                    (newLocation) => {

                        setLocation({
                            latitude: newLocation.coords.latitude,
                            longitude: newLocation.coords.longitude
                        });

                    }
                );

        } catch (error) {

            setLoading(false);

            setSosActive(false);

            Alert.alert(
                "Location Error",
                error.message
            );

        }

    };

    const stopSOS = () => {

        if (subscription.current) {

            subscription.current.remove();

            subscription.current = null;

        }

        setSosActive(false);

        setLocation(null);

        router.back();

    };

    return (

        <View
            style={{
                flex: 1,
                backgroundColor: "white"
            }}
        >

            <View
                style={{
                    paddingTop: 50,
                    paddingHorizontal: 20,
                    flexDirection: "row",
                    alignItems: "center"
                }}
            >

                <TouchableOpacity
                    onPress={stopSOS}
                >

                    <Ionicons
                        name="chevron-back"
                        size={40}
                        color="black"
                    />

                </TouchableOpacity>

                <Text
                    style={{
                        fontSize: 30,
                        fontWeight: "bold",
                        marginLeft: 25
                    }}
                >
                    SOS
                </Text>

            </View>

            <Text
                style={{
                    textAlign: "center",
                    color: sosActive ? "#F83B32" : "#777777",
                    fontSize: 16,
                    fontWeight: "bold",
                    marginTop: 10
                }}
            >
                {sosActive
                    ? "SOS is active - Location is being shared"
                    : "SOS has stopped"}
            </Text>

            {contacts.length > 0 && (

                <Text
                    style={{
                        textAlign: "center",
                        color: "#777777",
                        fontSize: 14,
                        fontWeight: "bold",
                        marginTop: 8
                    }}
                >
                    {contacts.length} emergency contact
                    {contacts.length !== 1 ? "s" : ""} saved
                </Text>

            )}

            <View
                style={{
                    flex: 1,
                    marginTop: 20
                }}
            >

                {loading ? (

                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >

                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "bold"
                            }}
                        >
                            Starting SOS...
                        </Text>

                    </View>

                ) : location ? (

                    <MapView
                        style={{
                            flex: 1
                        }}
                        region={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005
                        }}
                        showsUserLocation={true}
                    >

                        <Marker
                            coordinate={location}
                            title="Your Location"
                        />

                    </MapView>

                ) : (

                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >

                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "bold"
                            }}
                        >
                            SOS has been stopped
                        </Text>

                    </View>

                )}

            </View>

            <View
                style={{
                    padding: 20
                }}
            >

                {location && sosActive && (

                    <Text
                        style={{
                            textAlign: "center",
                            color: "#777777",
                            marginBottom: 15
                        }}
                    >
                        {location.latitude.toFixed(6)},{" "}
                        {location.longitude.toFixed(6)}
                    </Text>

                )}

                {sosActive && (

                    <TouchableOpacity
                        onPress={stopSOS}
                        style={{
                            height: 65,
                            backgroundColor: "#F83B32",
                            borderRadius: 18,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >

                        <Text
                            style={{
                                color: "white",
                                fontSize: 20,
                                fontWeight: "bold"
                            }}
                        >
                            Stop SOS
                        </Text>

                    </TouchableOpacity>

                )}

            </View>

        </View>
    );
};

export default LiveMap;