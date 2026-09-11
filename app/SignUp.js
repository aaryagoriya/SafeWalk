import React, { useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    ScrollView
} from "react-native";

import { useRouter } from "expo-router";

import {createUserWithEmailAndPassword,updateProfile} from "firebase/auth";

import {doc,setDoc} from "firebase/firestore";

import { auth, db } from "../FirebaseConfig";

import CustomInput from "../components/CustomInput";

import CustomButton from "../components/CustomButton";

import { Ionicons } from "@expo/vector-icons";

const SignUp = () => {

    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const handleName = (text) => {

        const value = text.replace(/[^a-zA-Z\s]/g, "");

        setName(value);

    };

    const handlePhone = (text) => {

        let value = text.replace(/[^0-9+]/g, "");

        if (value.includes("+")) {

            value =
                "+" +
                value.replace(/\+/g, "");

        }

        setPhone(value);

    };

    const handleEmail = (text) => {

        setEmail(text.replace(/\s/g, ""));

    };

    const signUp = async () => {

        if (!name || !email || !phone || !password) {

            Alert.alert(
                "Error",
                "Please fill in all fields"
            );

            return;
        }

        if (name.trim().length < 2) {

            Alert.alert(
                "Error",
                "Please enter a valid name"
            );

            return;
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            Alert.alert(
                "Error",
                "Please enter a valid email address"
            );

            return;
        }

        const phonePattern =
            /^\+?[0-9]{7,15}$/;

        if (!phonePattern.test(phone)) {

            Alert.alert(
                "Error",
                "Please enter a valid mobile number"
            );

            return;
        }

        if (password.length < 6) {

            Alert.alert(
                "Error",
                "Password must be at least 6 characters"
            );

            return;
        }

        try {

            const user =
                await createUserWithEmailAndPassword(
                    auth,
                    email.trim(),
                    password
                );

            await updateProfile(user.user, {
                displayName: name.trim()
            });

            await setDoc(
                doc(
                    db,
                    "users",
                    user.user.uid
                ),
                {
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone
                }
            );

            Alert.alert(
                "Success",
                "Account created successfully"
            );

            router.replace("/Home");

        } catch (error) {

            if (error.code === "auth/email-already-in-use") {

                Alert.alert(
                    "Error",
                    "This email is already registered"
                );

            } else if (error.code === "auth/invalid-email") {

                Alert.alert(
                    "Error",
                    "Please enter a valid email address"
                );

            } else if (error.code === "auth/weak-password") {

                Alert.alert(
                    "Error",
                    "Password must be at least 6 characters"
                );

            } else {

                Alert.alert(
                    "Sign Up Error",
                    error.message
                );

            }
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
                    Create Account
                </Text>

                <Text style={{
                    fontSize: 16,
                    color: "#AAAAAA",
                    marginBottom: 40
                }}>
                    Sign up to get started
                </Text>

                <CustomInput
                    label="Full Name"
                    value={name}
                    onChangeText={handleName}
                    placeholder="John Doe"
                    keyboardType="default"
                    leftIcon={
                        <Ionicons
                            name="person-outline"
                            size={28}
                            color="black"
                        />
                    }
                />

                <CustomInput
                    label="Email"
                    value={email}
                    onChangeText={handleEmail}
                    placeholder="johndoe@outlook.com"
                    keyboardType="email-address"
                    leftIcon={
                        <Ionicons
                            name="mail-outline"
                            size={28}
                            color="black"
                        />
                    }
                />

                <CustomInput
                    label="Mobile Number"
                    value={phone}
                    onChangeText={handlePhone}
                    placeholder="+64 27 423 8527"
                    keyboardType="phone-pad"
                    leftIcon={
                        <Ionicons
                            name="call-outline"
                            size={28}
                            color="black"
                        />
                    }
                />

                <CustomInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="********"
                    secureTextEntry={true}
                    keyboardType="default"
                    leftIcon={
                        <Ionicons
                            name="lock-closed-outline"
                            size={28}
                            color="black"
                        />
                    }
                />

                <View style={{
                    marginTop: 10
                }}>

                    <CustomButton
                        title="Sign Up"
                        onPress={() => {

                            if (auth.currentUser) {

                                router.replace("/Login");

                            } else {

                                signUp();

                            }

                        }}
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
                        Already have an account?
                    </Text>

                    <TouchableOpacity
                        onPress={() => router.push("/Login")}
                    >

                        <Text style={{
                            color: "#2455F5",
                            fontSize: 15,
                            fontWeight: "bold"
                        }}>
                            {" "}Login
                        </Text>

                    </TouchableOpacity>

                </View>

                <Text style={{
                    textAlign: "center",
                    color: "#AAAAAA",
                    fontSize: 12,
                    marginTop: 18
                }}>
                    By signing up, you agree to our
                </Text>

                <Text style={{
                    textAlign: "center",
                    color: "#2455F5",
                    fontSize: 12,
                    fontWeight: "bold",
                    marginTop: 8
                }}>
                    Terms of Service  >>  Privacy Policy
                </Text>

            </View>

        </ScrollView>
    );
};

export default SignUp;