import React, { useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView
} from "react-native";

import { useRouter } from "expo-router";

import {signInWithEmailAndPassword,sendPasswordResetEmail,signOut} from "firebase/auth";

import { auth } from "../FirebaseConfig";

import CustomButton from "../components/CustomButton";

import { Ionicons } from "@expo/vector-icons";

const Login = () => {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {

        if (!email || !password) {

            Alert.alert(
                "Error",
                "Please enter your email and password"
            );

            return;
        }

        try {

            await signInWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            router.replace("/Tabs/Home");

        } catch (error) {

            if (
                error.code === "auth/invalid-credential" ||
                error.code === "auth/wrong-password" ||
                error.code === "auth/user-not-found"
            ) {

                Alert.alert(
                    "Login Failed",
                    "Incorrect email or password"
                );

            } else {

                Alert.alert(
                    "Login Failed",
                    error.message
                );

            }
        }
    };

    const forgotPassword = async () => {

        if (!email) {

            Alert.alert(
                "Error",
                "Please enter your email first"
            );

            return;
        }

        try {

            await sendPasswordResetEmail(
                auth,
                email.trim()
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
                paddingTop: 45
            }}>

                <TouchableOpacity
                    onPress={() => router.back()}
                >

                    <Ionicons
                        name="arrow-back"
                        size={36}
                        color="black"
                    />

                </TouchableOpacity>

                <Text style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    marginTop: 30
                }}>
                    Welcome Back
                </Text>

                <Text style={{
                    fontSize: 16,
                    color: "#AAAAAA",
                    marginBottom: 40
                }}>
                    Login to continue
                </Text>

                <Text style={{
                    fontSize: 16,
                    color: "black",
                    marginBottom: 10
                }}>
                    Email
                </Text>

                <View style={{
                    height: 62,
                    borderWidth: 1.5,
                    borderColor: "#AAAAAA",
                    borderRadius: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 18
                }}>

                    <Ionicons
                        name="person-outline"
                        size={28}
                        color="black"
                    />

                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="johndoe@outlook.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={{
                            flex: 1,
                            fontSize: 16,
                            marginLeft: 15,
                            color: "black"
                        }}
                    />

                </View>

                <Text style={{
                    fontSize: 16,
                    color: "black",
                    marginTop: 28,
                    marginBottom: 10
                }}>
                    Password
                </Text>

                <View style={{
                    height: 62,
                    borderWidth: 1.5,
                    borderColor: "#AAAAAA",
                    borderRadius: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 18
                }}>

                    <Ionicons
                        name="lock-closed-outline"
                        size={28}
                        color="black"
                    />

                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="****************"
                        secureTextEntry={true}
                        style={{
                            flex: 1,
                            fontSize: 16,
                            marginLeft: 15,
                            color: "black"
                        }}
                    />

                </View>

                <TouchableOpacity
                    onPress={forgotPassword}
                    style={{
                        alignSelf: "flex-end",
                        marginTop: 18
                    }}
                >

                    <Text style={{
                        color: "#2455F5",
                        fontSize: 14,
                        fontWeight: "bold"
                    }}>
                        Forgot Password?
                    </Text>

                </TouchableOpacity>

                <View style={{
                    marginTop: 46
                }}>

                    <CustomButton
                        title="Login"
                        onPress={login}
                    />

                </View>

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 20
                }}>

                    <Text style={{
                        color: "#AAAAAA",
                        fontSize: 15
                    }}>
                        Don't have an account?
                    </Text>

                    <TouchableOpacity
                        onPress={() => router.push("/SignUp")}
                    >

                        <Text style={{
                            color: "#2455F5",
                            fontSize: 15,
                            fontWeight: "bold"
                        }}>
                            {" "}Sign Up
                        </Text>

                    </TouchableOpacity>

                </View>

            </View>

        </ScrollView>
    );
};

export default Login;