import React, { useEffect, useState } from "react";

import {
    View,
    ActivityIndicator
} from "react-native";

import { useRouter } from "expo-router";

import {
    onAuthStateChanged
} from "firebase/auth";

import { auth } from "../FirebaseConfig";

import Landing from "./Landing";

const Index = () => {

    const router = useRouter();

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(
            auth,
            currentUser => {

                setUser(currentUser);
                setLoading(false);

            }
        );

        return unsubscribe;

    }, []);

    useEffect(() => {

        if (!loading && user) {

            router.replace("/Tabs/Home");

        }

    }, [user, loading]);

    if (loading) {

        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>

                <ActivityIndicator
                    size="large"
                    color="#2455F5"
                />

            </View>
        );

    }

    if (!user) {

        return <Landing />;

    }

    return null;
};

export default Index;
