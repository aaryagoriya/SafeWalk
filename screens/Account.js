import React, { useEffect, useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert
} from "react-native";

import { useRouter } from "expo-router";

import {signOut,sendPasswordResetEmail} from "firebase/auth";

import {doc,getDoc} from "firebase/firestore";

import { Ionicons } from "@expo/vector-icons";

import { auth, db } from "../FirebaseConfig";

const Account = () => {

    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {

        const getUserData = async () => {

            try {

                const user = auth.currentUser;

                if (user) {

                    const userRef =
                        doc(db, "users", user.uid);

                    const userData =
                        await getDoc(userRef);

                    if (userData.exists()) {

                        const data = userData.data();

                        setName(data.name || "");
                        setEmail(data.email || user.email || "");
                        setPhone(data.phone || "");

                    }

                }

            } catch (error) {

                console.log(error);

            }
        };

        getUserData();

    }, []);

    const changePassword = async () => {

        if (!email) {
            return;
        }

        try {

            await sendPasswordResetEmail(
                auth,
                email
            );

            Alert.alert(
                "Success",
                "Password reset email sent"
            );

        } catch (error) {

            Alert.alert(
                "Error",
                error.message
            );

        }
    };

    const logout = async () => {

        try {

            await signOut(auth);

            router.replace("/Index");

        } catch (error) {

            Alert.alert(
                "Logout Error",
                error.message
            );

        }
    };

    return (

        <ScrollView
            style={{
                flex: 1,
                backgroundColor: "white"
            }}
            contentContainerStyle={{
                paddingBottom: 30
            }}
        >

            <View style={{
                paddingHorizontal: 20,
                paddingTop: 50
            }}>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}>

                    <TouchableOpacity
                        onPress={() => router.back()}
                    >

                        <Ionicons
                            name="chevron-back"
                            size={42}
                            color="black"
                        />

                    </TouchableOpacity>

                    <View style={{
                        flex: 1,
                        alignItems: "center",
                        marginRight: 42
                    }}>

                        <Text style={{
                            fontSize: 34,
                            fontWeight: "bold"
                        }}>
                            Account
                        </Text>

                        <Text style={{
                            fontSize: 16,
                            color: "#888888",
                            fontWeight: "bold",
                            marginTop: 5
                        }}>
                            Manage your details.
                        </Text>

                    </View>

                </View>

                <Text style={{
                    fontSize: 21,
                    fontWeight: "bold",
                    marginTop: 38,
                    marginLeft: 3
                }}>
                    Profile Information
                </Text>

                <View style={{
                    height: 345,
                    borderWidth: 1,
                    borderColor: "#DDDDDD",
                    borderRadius: 18,
                    marginTop: 10,
                    paddingHorizontal: 20,
                    paddingTop: 28,
                    elevation: 4,
                    backgroundColor: "white"
                }}>

                    <View style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}>

                        <Ionicons
                            name="person-outline"
                            size={36}
                            color="black"
                        />

                        <View style={{
                            marginLeft: 30
                        }}>

                            <Text style={{
                                fontSize: 16,
                                fontWeight: "bold"
                            }}>
                                Name
                            </Text>

                            <Text style={{
                                fontSize: 16,
                                marginTop: 5
                            }}>
                                {name}
                            </Text>

                        </View>

                    </View>

                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 30
                    }}>

                        <Ionicons
                            name="mail-outline"
                            size={36}
                            color="black"
                        />

                        <View style={{
                            marginLeft: 30
                        }}>

                            <Text style={{
                                fontSize: 16,
                                fontWeight: "bold"
                            }}>
                                Email
                            </Text>

                            <Text style={{
                                fontSize: 16,
                                marginTop: 5
                            }}>
                                {email}
                            </Text>

                        </View>

                    </View>

                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 30
                    }}>

                        <Ionicons
                            name="call-outline"
                            size={36}
                            color="black"
                        />

                        <View style={{
                            marginLeft: 30
                        }}>

                            <Text style={{
                                fontSize: 16,
                                fontWeight: "bold"
                            }}>
                                Phone Number
                            </Text>

                            <Text style={{
                                fontSize: 16,
                                marginTop: 5
                            }}>
                                {phone}
                            </Text>

                        </View>

                    </View>

                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 30
                    }}>

                        <Ionicons
                            name="lock-closed-outline"
                            size={36}
                            color="black"
                        />

                        <View style={{
                            marginLeft: 30
                        }}>

                            <Text style={{
                                fontSize: 16,
                                fontWeight: "bold"
                            }}>
                                Password
                            </Text>

                            <TouchableOpacity
                                onPress={changePassword}
                            >

                                <Text style={{
                                    fontSize: 16,
                                    color: "#2455F5",
                                    marginTop: 5
                                }}>
                                    Change Password
                                </Text>

                            </TouchableOpacity>

                        </View>

                    </View>

                </View>

                <TouchableOpacity
                    onPress={logout}
                    style={{
                        height: 63,
                        backgroundColor: "#F83B32",
                        borderRadius: 18,
                        marginTop: 52,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row"
                    }}
                >

                    <Ionicons
                        name="log-out-outline"
                        size={36}
                        color="white"
                    />

                    <Text style={{
                        color: "white",
                        fontSize: 20,
                        fontWeight: "bold",
                        marginLeft: 12
                    }}>
                        Logout
                    </Text>

                </TouchableOpacity>

            </View>

        </ScrollView>
    );
};

export default Account;