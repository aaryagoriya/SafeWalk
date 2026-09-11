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

import {collection,addDoc} from "firebase/firestore";

import { auth, db } from "../FirebaseConfig";

import { Ionicons } from "@expo/vector-icons";

const AddContact = () => {

    const router = useRouter();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const addContact = async () => {

        if (!name || !phone) {

            Alert.alert(
                "Error",
                "Please enter the name and phone number"
            );

            return;
        }

        try {

            const user = auth.currentUser;

            if (!user) {

                Alert.alert(
                    "Error",
                    "Please login first"
                );

                return;
            }

            await addDoc(
                collection(
                    db,
                    "users",
                    user.uid,
                    "contacts"
                ),
                {
                    name: name,
                    phone: phone
                }
            );

            Alert.alert(
                "Success",
                "Contact added successfully"
            );

            router.back();

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
        >

            <View style={{
                paddingHorizontal: 25,
                paddingTop: 50
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

                <Text style={{
                    fontSize: 34,
                    fontWeight: "bold",
                    marginTop: 30
                }}>
                    Add Contact
                </Text>

                <Text style={{
                    fontSize: 16,
                    color: "#888888",
                    marginTop: 8,
                    marginBottom: 40
                }}>
                    Add a family member for emergencies.
                </Text>

                <Text style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 10
                }}>
                    Contact Name
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
                        value={name}
                        onChangeText={setName}
                        placeholder="Mom"
                        style={{
                            flex: 1,
                            fontSize: 16,
                            marginLeft: 15
                        }}
                    />

                </View>

                <Text style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    marginTop: 28,
                    marginBottom: 10
                }}>
                    Phone Number
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
                        name="call-outline"
                        size={28}
                        color="black"
                    />

                    <TextInput
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="+64 27 543 6565"
                        keyboardType="phone-pad"
                        style={{
                            flex: 1,
                            fontSize: 16,
                            marginLeft: 15
                        }}
                    />

                </View>

                <TouchableOpacity
                    onPress={addContact}
                    style={{
                        height: 65,
                        backgroundColor: "#2455F5",
                        borderRadius: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 45
                    }}
                >

                    <Text style={{
                        color: "white",
                        fontSize: 20,
                        fontWeight: "bold"
                    }}>
                        Add Contact
                    </Text>

                </TouchableOpacity>

            </View>

        </ScrollView>
    );
};

export default AddContact;