import React from "react";

import {
    View,
    Text,
    Image,
    TouchableOpacity
} from "react-native";

import { useRouter } from "expo-router";

import CustomButton from "../components/CustomButton";

const Landing = () => {

    const router = useRouter();

    return (

        <View style={{
            flex: 1,
            backgroundColor: "white",
            paddingHorizontal: 30,
            justifyContent: "center"
        }}>

            <Image
                source={require("../assets/images/logo.png")}
                style={{
                    width: 340,
                    height: 340,
                    alignSelf: "center",
                    resizeMode: "contain",
                    marginBottom: 55
                }}
            />

            <CustomButton
                title="Get Started"
                onPress={() => router.push("/Login")}
            />

            <TouchableOpacity
                onPress={() => router.push("/SignUp")}
                style={{
                    height: 75,
                    borderWidth: 2,
                    borderColor: "#2455F5",
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 68
                }}
            >

                <Text style={{
                    color: "#0D3FAF",
                    fontSize: 24,
                    fontWeight: "bold"
                }}>
                    Don’t have a account
                </Text>

            </TouchableOpacity>

        </View>
    );
};

export default Landing;