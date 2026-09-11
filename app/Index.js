import React, { useEffect, useState } from "react";

import {
    View,
    TouchableOpacity,
    Text
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {onAuthStateChanged} from "firebase/auth";
     
import { auth } from "../FirebaseConfig";

import Landing from "../screens/Landing";
import Home from "../screens/Home";
import Contact from "../screens/Contact";
import Account from "../screens/Account";
import SOS from "../screens/SOS";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

const Index = () => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState("Home");

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(
            auth,
            (currentUser) => {

                setUser(currentUser);
                setLoading(false);

            }
        );

        return unsubscribe;

    }, []);

    const showPage = () => {

        if (page === "Home") {
            return <Home />;
        }

        if (page === "SOS") {
            return <SOS />;
        }

        if (page === "Contact") {
            return <Contact />;
        }

        if (page === "Account") {
            return <Account />;
        }
    };

    if (loading) {

        return (
            <View style={{
                flex: 1,
                backgroundColor: "black"
            }} />
        );

    }

    if (!user) {

        return <Landing />;

    }

    return (

        <View style={{
            flex: 1,
            backgroundColor: "black"
        }}>

            <View style={{
                flex: 1
            }}>
                {showPage()}
            </View>

            <View style={{
                height: 75,
                backgroundColor: "black",
                borderTopWidth: 1,
                borderTopColor: "#000",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center"
            }}>

                <TouchableOpacity
                    onPress={() => setPage("Home")}
                    style={{
                        alignItems: "center"
                    }}
                >

                    <AntDesign
                        name="home"
                        
                        size={28}
                        color={
                            page === "Home"
                                ? "#2455F5"
                                : "#777777"
                        }
                    />

                    <Text style={{
                        fontSize: 12,
                        marginTop: 3,
                        color: page === "Home"
                            ? "#2455F5"
                            : "#777777"
                    }}>
                        Home
                    </Text>

                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setPage("SOS")}
                    style={{
                        alignItems: "center"
                    }}
                >

                    <Feather
                        name="phone"
                        size={28}
                        color={
                            page === "SOS"
                                ? "#F82F35"
                                : "#777777"
                        }
                    />

                    <Text style={{
                        fontSize: 12,
                        marginTop: 3,
                        color: page === "SOS"
                            ? "#F82F35"
                            : "#777777"
                    }}>
                        SOS
                    </Text>

                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setPage("Contact")}
                    style={{
                        alignItems: "center"
                    }}
                >

                    <Ionicons
                        name="people-outline"
                        size={28}
                        color={
                            page === "Contact"
                                ? "#2455F5"
                                : "#777777"
                        }
                    />

                    <Text style={{
                        fontSize: 12,
                        marginTop: 3,
                        color: page === "Contact"
                            ? "#2455F5"
                            : "#777777"
                    }}>
                        Contact
                    </Text>

                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setPage("Account")}
                    style={{
                        alignItems: "center"
                    }}
                >

                    <Ionicons
                        name="person-outline"
                        size={28}
                        color={
                            page === "Account"
                                ? "#2455F5"
                                : "#777777"
                        }
                    />

                    <Text style={{
                        fontSize: 12,
                        marginTop: 3,
                        color: page === "Account"
                            ? "#2455F5"
                            : "#777777"
                    }}>
                        Account
                    </Text>

                </TouchableOpacity>

            </View>

        </View>
    );
};

export default Index;