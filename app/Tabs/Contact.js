import { useEffect, useState } from "react";

import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Alert
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

const Contact = () => {

    const router = useRouter();

    const [contacts, setContacts] = useState([]);

    useEffect(() => {

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

        getContacts();

    }, []);

    const deleteContact = (contact) => {

        Alert.alert(
            "Delete Contact",
            `Are you sure you want to delete ${contact.name}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {

                        try {

                            const newContacts =
                                contacts.filter(
                                    item =>
                                        item.id !== contact.id
                                );

                            await AsyncStorage.setItem(
                                "contacts",
                                JSON.stringify(newContacts)
                            );

                            setContacts(newContacts);

                        } catch (error) {

                            console.log(error);

                            Alert.alert(
                                "Error",
                                "Failed to delete contact."
                            );

                        }

                    }
                }
            ]
        );

    };

    return (

        <ScrollView
            style={{
                flex: 1,
                backgroundColor: "white"
            }}
            contentContainerStyle={{
                paddingHorizontal: 29,
                paddingTop: 50,
                paddingBottom: 30
            }}
        >

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}
            >

                <TouchableOpacity
                    onPress={() => router.back()}
                >

                    <Ionicons
                        name="chevron-back"
                        size={42}
                        color="black"
                    />

                </TouchableOpacity>

                <Text
                    style={{
                        fontSize: 34,
                        fontWeight: "bold",
                        marginLeft: 25
                    }}
                >
                    Trusted Contacts
                </Text>

            </View>

            <Text
                style={{
                    textAlign: "center",
                    color: "#888888",
                    fontSize: 16,
                    fontWeight: "bold",
                    marginTop: 15
                }}
            >
                These contacts will be alerted in{"\n"}
                emergency situations.
            </Text>

            <View
                style={{
                    marginTop: 40
                }}
            >

                {contacts.length === 0 ? (

                    <Text
                        style={{
                            textAlign: "center",
                            color: "#888888",
                            fontSize: 18,
                            fontWeight: "bold",
                            marginTop: 30
                        }}
                    >
                        No contacts added
                    </Text>

                ) : (

                    contacts.map((contact) => (

                        <View
                            key={contact.id}
                            style={{
                                height: 104,
                                borderWidth: 1.5,
                                borderColor: "#CCCCCC",
                                borderRadius: 18,
                                flexDirection: "row",
                                alignItems: "center",
                                paddingHorizontal: 19,
                                marginBottom: 13,
                                elevation: 3,
                                backgroundColor: "white"
                            }}
                        >

                            <View
                                style={{
                                    width: 65,
                                    height: 65,
                                    borderRadius: 33,
                                    backgroundColor: "#2455F5",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >

                                <Text
                                    style={{
                                        color: "white",
                                        fontSize: 38,
                                        fontWeight: "bold"
                                    }}
                                >
                                    {contact.name
                                        ? contact.name
                                            .charAt(0)
                                            .toUpperCase()
                                        : "?"}
                                </Text>

                            </View>

                            <View
                                style={{
                                    marginLeft: 20,
                                    flex: 1
                                }}
                            >

                                <Text
                                    style={{
                                        fontSize: 21,
                                        fontWeight: "bold"
                                    }}
                                >
                                    {contact.name}
                                </Text>

                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: "#888888",
                                        fontWeight: "bold",
                                        marginTop: 5
                                    }}
                                >
                                    {contact.phone}
                                </Text>

                            </View>

                            <TouchableOpacity
                                onPress={() =>
                                    deleteContact(contact)
                                }
                                style={{
                                    width: 45,
                                    height: 45,
                                    borderRadius: 14,
                                    backgroundColor: "#FFF0F0",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >

                                <Ionicons
                                    name="trash-outline"
                                    size={23}
                                    color="#E53935"
                                />

                            </TouchableOpacity>

                        </View>

                    ))

                )}

                <TouchableOpacity
                    onPress={() =>
                        router.push("/AddContact")
                    }
                    style={{
                        height: 58,
                        borderRadius: 18,
                        elevation: 3,
                        backgroundColor: "white",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 30
                    }}
                >

                    <Text
                        style={{
                            color: "#2455F5",
                            fontSize: 20,
                            fontWeight: "bold"
                        }}
                    >
                        + Add Contact
                    </Text>

                </TouchableOpacity>

            </View>

        </ScrollView>
    );
};

export default Contact;