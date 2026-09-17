import { useEffect, useState } from "react";

import {
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { auth, db } from "../../FirebaseConfig";

import { doc, getDoc } from "firebase/firestore";

const Home = () => {

    const router = useRouter();

    const [name, setName] = useState("");

    useEffect(() => {

        const getUser = async () => {

            const user = auth.currentUser;

            if (user) {

                const userRef = doc(
                    db,
                    "users",
                    user.uid
                );

                const userData = await getDoc(userRef);

                if (userData.exists()) {

                    const fullName = userData.data().name;

                    setName(fullName);
                }
            }
        };

        getUser();

    }, []);

    return (

        <ScrollView

            style={{
                flex: 1,
                backgroundColor: "#F7F8FC"
            }}

            contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 55,
                paddingBottom: 35
            }}

            showsVerticalScrollIndicator={false}

        >

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "flex-end"
                }}
            >

                <TouchableOpacity
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 16,
                        backgroundColor: "white",
                        justifyContent: "center",
                        alignItems: "center",
                        elevation: 3,
                        shadowColor: "#000",
                        shadowOpacity: 0.08,
                        shadowRadius: 5,
                        shadowOffset: {
                            width: 0,
                            height: 2
                        }
                    }}
                >

                    <Ionicons
                        name="notifications-outline"
                        size={25}
                        color="#111827"
                    />

                </TouchableOpacity>

            </View>

            <Text
                style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    color: "#111827",
                    marginTop: 28
                }}
            >
                Hi, {name}
            </Text>

            <Text
                style={{
                    fontSize: 15,
                    color: "#6B7280",
                    marginTop: 7,
                    marginBottom: 25
                }}
            >
                You're all set. Make every walk safe.
            </Text>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
            >

                <TouchableOpacity

                    onPress={() => router.push("/Walk")}

                    style={{
                        width: "48%",
                        height: 175,
                        backgroundColor: "white",
                        borderRadius: 22,
                        elevation: 4,
                        shadowColor: "#000",
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                        shadowOffset: {
                            width: 0,
                            height: 3
                        },
                        alignItems: "center",
                        justifyContent: "center"
                    }}

                >

                    <View
                        style={{
                            width: 70,
                            height: 70,
                            borderRadius: 20,
                            backgroundColor: "#EEF2FF",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >

                        <Ionicons
                            name="navigate"
                            size={34}
                            color="#2455F5"
                        />

                    </View>

                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "#111827",
                            marginTop: 18
                        }}
                    >
                        Start Walk
                    </Text>

                    <Text
                        style={{
                            fontSize: 12,
                            color: "#9CA3AF",
                            marginTop: 4
                        }}
                    >
                        Track your journey
                    </Text>

                </TouchableOpacity>


                <TouchableOpacity

                    onPress={() => router.push("/WalkHistory")}

                    style={{
                        width: "48%",
                        height: 175,
                        backgroundColor: "white",
                        borderRadius: 22,
                        elevation: 4,
                        shadowColor: "#000",
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                        shadowOffset: {
                            width: 0,
                            height: 3
                        },
                        alignItems: "center",
                        justifyContent: "center"
                    }}

                >

                    <View
                        style={{
                            width: 70,
                            height: 70,
                            borderRadius: 20,
                            backgroundColor: "#F0EDFF",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >

                        <Ionicons
                            name="time"
                            size={34}
                            color="#5520F5"
                        />

                    </View>

                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "#111827",
                            marginTop: 18
                        }}
                    >
                        Past Walks
                    </Text>

                    <Text
                        style={{
                            fontSize: 12,
                            color: "#9CA3AF",
                            marginTop: 4
                        }}
                    >
                        View your history
                    </Text>

                </TouchableOpacity>

            </View>


            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 18
                }}
            >

                <TouchableOpacity

                    onPress={() => router.push("./Contact")}

                    style={{
                        width: "48%",
                        height: 175,
                        backgroundColor: "white",
                        borderRadius: 22,
                        elevation: 4,
                        shadowColor: "#000",
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                        shadowOffset: {
                            width: 0,
                            height: 3
                        },
                        alignItems: "center",
                        justifyContent: "center"
                    }}

                >

                    <View
                        style={{
                            width: 70,
                            height: 70,
                            borderRadius: 20,
                            backgroundColor: "#E9F9ED",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >

                        <Ionicons
                            name="people"
                            size={34}
                            color="#00B51A"
                        />

                    </View>

                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "#111827",
                            marginTop: 18,
                            textAlign: "center"
                        }}
                    >
                        Emergency Contact
                    </Text>

                    <Text
                        style={{
                            fontSize: 12,
                            color: "#9CA3AF",
                            marginTop: 4
                        }}
                    >
                        Manage contacts
                    </Text>

                </TouchableOpacity>


                <TouchableOpacity

                    onPress={() => router.push("./Account")}

                    style={{
                        width: "48%",
                        height: 175,
                        backgroundColor: "white",
                        borderRadius: 22,
                        elevation: 4,
                        shadowColor: "#000",
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                        shadowOffset: {
                            width: 0,
                            height: 3
                        },
                        alignItems: "center",
                        justifyContent: "center"
                    }}

                >

                    <View
                        style={{
                            width: 70,
                            height: 70,
                            borderRadius: 20,
                            backgroundColor: "#FFF7DF",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >

                        <Ionicons
                            name="person"
                            size={34}
                            color="#E5A900"
                        />

                    </View>

                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "#111827",
                            marginTop: 18
                        }}
                    >
                        Account
                    </Text>

                    <Text
                        style={{
                            fontSize: 12,
                            color: "#9CA3AF",
                            marginTop: 4
                        }}
                    >
                        Manage your profile
                    </Text>

                </TouchableOpacity>

            </View>


            <TouchableOpacity

                 onPress={() => router.push("/Tabs/Sos")}

                style={{
                    height: 125,
                    backgroundColor: "#F82F35",
                    borderRadius: 24,
                    marginTop: 25,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 28,
                    elevation: 5,
                    shadowColor: "#F82F35",
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    shadowOffset: {
                        width: 0,
                        height: 4
                    }
                }}

            >

                <View
                    style={{
                        width: 68,
                        height: 68,
                        borderRadius: 22,
                        backgroundColor: "rgba(255,255,255,0.18)",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >

                    <Ionicons
                        name="call"
                        size={34}
                        color="white"
                    />

                </View>

                <View
                    style={{
                        marginLeft: 20
                    }}
                >

                    <Text
                        style={{
                            color: "white",
                            fontSize: 38,
                            fontWeight: "bold"
                        }}
                    >
                        SOS
                    </Text>

                    <Text
                        style={{
                            color: "white",
                            fontSize: 14,
                            opacity: 0.9,
                            marginTop: -2
                        }}
                    >
                        Tap to send an emergency alert
                    </Text>

                </View>

            </TouchableOpacity>

        </ScrollView>

    );
};

export default Home;