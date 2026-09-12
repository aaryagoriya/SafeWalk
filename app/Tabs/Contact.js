import { useEffect, useState } from "react";

import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { collection, getDocs } from "firebase/firestore";

import { auth, db } from "../../FirebaseConfig";

const Contact = () => {
  const router = useRouter();

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          return;
        }

        const contactsRef = collection(db, "users", user.uid, "contacts");

        const contactsData = await getDocs(contactsRef);

        const contactList = [];

        contactsData.forEach((item) => {
          contactList.push({
            id: item.id,
            ...item.data(),
          });
        });

        setContacts(contactList);
      } catch (error) {
        console.log(error);
      }
    };

    getContacts();
  }, []);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
      contentContainerStyle={{
        paddingHorizontal: 29,
        paddingTop: 50,
        paddingBottom: 30,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={42} color="black" />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 34,
            fontWeight: "bold",
            marginLeft: 25,
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
          marginTop: 15,
        }}
      >
        These contacts will be alerted in{"\n"}
        emergency situations.
      </Text>

      <View
        style={{
          marginTop: 40,
        }}
      >
        {contacts.length === 0 ? (
          <Text
            style={{
              textAlign: "center",
              color: "#888888",
              fontSize: 18,
              fontWeight: "bold",
              marginTop: 30,
            }}
          >
            No contacts added
          </Text>
        ) : (
          contacts.map((contact) => (
            <TouchableOpacity
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
                backgroundColor: "white",
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#2455F5",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 48,
                    fontWeight: "bold",
                  }}
                >
                  {contact.name ? contact.name.charAt(0).toUpperCase() : "?"}
                </Text>
              </View>

              <View
                style={{
                  marginLeft: 34,
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                  }}
                >
                  {contact.name}
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    color: "#888888",
                    fontWeight: "bold",
                    marginTop: 5,
                  }}
                >
                  {contact.phone}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity
          onPress={() => router.push("/AddContact")}
          style={{
            height: 58,
            borderRadius: 18,
            elevation: 3,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 30,
          }}
        >
          <Text
            style={{
              color: "#2455F5",
              fontSize: 20,
              fontWeight: "bold",
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
