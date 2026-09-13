import React, { useCallback, useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ActivityIndicator
} from "react-native";

import { useRouter, useFocusEffect } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import {
    collection,
    getDocs
} from "firebase/firestore";

import { auth, db } from "../FirebaseConfig";

const WalkHistory = () => {

    const router = useRouter();

    const [walks, setWalks] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadWalks = async () => {

        try {

            setLoading(true);

            const user = auth.currentUser;

            if (!user) {
                setWalks([]);
                setLoading(false);
                return;
            }

            const walksRef = collection(
                db,
                "users",
                user.uid,
                "walks"
            );

            const snapshot =
                await getDocs(walksRef);

            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            data.sort((a, b) => {

                const dateA =
                    new Date(a.startedAt || 0).getTime();

                const dateB =
                    new Date(b.startedAt || 0).getTime();

                return dateB - dateA;

            });

            setWalks(data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    useFocusEffect(
        useCallback(() => {
            loadWalks();
        }, [])
    );

    const formatDate = date => {

        if (!date) {
            return "--";
        }

        return new Date(date).toLocaleDateString(
            "en-NZ",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };

    const formatTime = date => {

        if (!date) {
            return "--";
        }

        return new Date(date).toLocaleTimeString(
            "en-NZ",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };

    const getDuration = (start, end) => {

        if (!start || !end) {
            return "--";
        }

        const startTime =
            new Date(start).getTime();

        const endTime =
            new Date(end).getTime();

        const seconds =
            Math.max(
                0,
                Math.floor(
                    (endTime - startTime) / 1000
                )
            );

        const minutes =
            Math.floor(seconds / 60);

        if (minutes < 60) {
            return `${minutes} min`;
        }

        const hours =
            Math.floor(minutes / 60);

        const remainingMinutes =
            minutes % 60;

        return `${hours}h ${remainingMinutes}m`;

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

    const getStatus = walk => {

        if (walk.arrived) {
            return "Completed";
        }

        if (walk.status === "alerted") {
            return "Alert Sent";
        }

        if (walk.status === "ended") {
            return "Ended";
        }

        return "Completed";

    };

    const getStatusColor = walk => {

        if (walk.status === "alerted") {
            return "#F44747";
        }

        if (walk.arrived) {
            return "#20B843";
        }

        return "#2463FF";

    };

    const renderWalk = ({ item }) => {

        return (
            <View
                style={{
                    backgroundColor: "white",
                    borderRadius: 22,
                    padding: 18,
                    marginBottom: 15,
                    borderWidth: 1,
                    borderColor: "#E3E8F1"
                }}
            >

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >

                    <View
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: "#EEF3FF",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >

                        <Ionicons
                            name="walk"
                            size={25}
                            color="#2463FF"
                        />

                    </View>

                    <View
                        style={{
                            flex: 1,
                            marginLeft: 13
                        }}
                    >

                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 18,
                                fontWeight: "bold",
                                color: "#101A35"
                            }}
                        >
                            {item.destination || "Unknown destination"}
                        </Text>

                        <Text
                            style={{
                                fontSize: 14,
                                color: "#7180A2",
                                marginTop: 4
                            }}
                        >
                            {formatDate(item.startedAt)}
                            {" • "}
                            {formatTime(item.startedAt)}
                        </Text>

                    </View>

                    <View
                        style={{
                            backgroundColor:
                                getStatusColor(item),
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 12
                        }}
                    >

                        <Text
                            style={{
                                color: "white",
                                fontSize: 12,
                                fontWeight: "bold"
                            }}
                        >
                            {getStatus(item)}
                        </Text>

                    </View>

                </View>

                <View
                    style={{
                        height: 1,
                        backgroundColor: "#E8ECF3",
                        marginVertical: 17
                    }}
                />

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >

                    <View
                        style={{
                            flex: 1,
                            alignItems: "center"
                        }}
                    >

                        <Ionicons
                            name="navigate-outline"
                            size={22}
                            color="#101A35"
                        />

                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color: "#101A35",
                                marginTop: 5
                            }}
                        >
                            {formatDistance(item.distance)}
                        </Text>

                        <Text
                            style={{
                                fontSize: 12,
                                color: "#7180A2",
                                marginTop: 2
                            }}
                        >
                            Distance
                        </Text>

                    </View>

                    <View
                        style={{
                            width: 1,
                            backgroundColor: "#E8ECF3"
                        }}
                    />

                    <View
                        style={{
                            flex: 1,
                            alignItems: "center"
                        }}
                    >

                        <Ionicons
                            name="time-outline"
                            size={22}
                            color="#101A35"
                        />

                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color: "#101A35",
                                marginTop: 5
                            }}
                        >
                            {getDuration(
                                item.startedAt,
                                item.endedAt
                            )}
                        </Text>

                        <Text
                            style={{
                                fontSize: 12,
                                color: "#7180A2",
                                marginTop: 2
                            }}
                        >
                            Duration
                        </Text>

                    </View>

                    <View
                        style={{
                            width: 1,
                            backgroundColor: "#E8ECF3"
                        }}
                    />

                    <View
                        style={{
                            flex: 1,
                            alignItems: "center"
                        }}
                    >

                        <Ionicons
                            name={
                                item.arrived
                                    ? "checkmark-circle-outline"
                                    : "flag-outline"
                            }
                            size={22}
                            color="#101A35"
                        />

                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color: "#101A35",
                                marginTop: 5
                            }}
                        >
                            {item.arrived
                                ? "Yes"
                                : "No"}
                        </Text>

                        <Text
                            style={{
                                fontSize: 12,
                                color: "#7180A2",
                                marginTop: 2
                            }}
                        >
                            Arrived
                        </Text>

                    </View>

                </View>

            </View>
        );

    };

    if (loading) {

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#F8FAFF",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >

                <ActivityIndicator
                    size="large"
                    color="#2463FF"
                />

                <Text
                    style={{
                        marginTop: 15,
                        color: "#7180A2",
                        fontSize: 16
                    }}
                >
                    Loading your walks...
                </Text>

            </View>
        );

    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#F8FAFF"
            }}
        >

            <View
                style={{
                    paddingTop: 55,
                    paddingHorizontal: 20,
                    paddingBottom: 20
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
                        fontSize: 34,
                        fontWeight: "bold",
                        color: "#101A35",
                        marginTop: 15
                    }}
                >
                    Walk History
                </Text>

                <Text
                    style={{
                        fontSize: 16,
                        color: "#7180A2",
                        marginTop: 6
                    }}
                >
                    Your previous SafeWalk journeys
                </Text>

            </View>

            {walks.length === 0 ? (

                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 35
                    }}
                >

                    <View
                        style={{
                            width: 85,
                            height: 85,
                            borderRadius: 43,
                            backgroundColor: "#EEF3FF",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >

                        <Ionicons
                            name="walk-outline"
                            size={42}
                            color="#2463FF"
                        />

                    </View>

                    <Text
                        style={{
                            fontSize: 23,
                            fontWeight: "bold",
                            color: "#101A35",
                            marginTop: 22
                        }}
                    >
                        No walks yet
                    </Text>

                    <Text
                        style={{
                            fontSize: 16,
                            color: "#7180A2",
                            textAlign: "center",
                            marginTop: 8,
                            lineHeight: 23
                        }}
                    >
                        Your completed SafeWalk journeys will appear here.
                    </Text>

                    <TouchableOpacity
                        onPress={() =>
                            router.push("/LiveMap")
                        }
                        style={{
                            marginTop: 25,
                            backgroundColor: "#2463FF",
                            paddingHorizontal: 30,
                            paddingVertical: 15,
                            borderRadius: 17
                        }}
                    >

                        <Text
                            style={{
                                color: "white",
                                fontSize: 16,
                                fontWeight: "bold"
                            }}
                        >
                            Start a Walk
                        </Text>

                    </TouchableOpacity>

                </View>

            ) : (

                <FlatList
                    data={walks}
                    renderItem={renderWalk}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingBottom: 30
                    }}
                    refreshing={loading}
                    onRefresh={loadWalks}
                />

            )}

        </View>
    );
};

export default WalkHistory;