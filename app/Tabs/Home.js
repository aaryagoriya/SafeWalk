import { useEffect, useState } from "react";

import { ScrollView, Text, TouchableOpacity, View } from "react-native";

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
        const userRef = doc(db, "users", user.uid);

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
        backgroundColor: "white",
      }}
      contentContainerStyle={{
        paddingHorizontal: 18,
        paddingTop: 55,
        paddingBottom: 30,
      }}
    >
      <TouchableOpacity>
        <Ionicons name="notifications-outline" size={38} color="black" />
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 34,
          fontWeight: "bold",
          marginTop: 30,
        }}
      >
        Hi, {name}
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: "black",
          marginTop: 8,
        }}
      >
        You’re all set, Make every walk safe.
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <TouchableOpacity
    onPress={() => router.push("/Walk")}
    style={{
        width: "47%",
        height: 182,
        backgroundColor: "white",
        borderRadius: 18,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2
        },
        alignItems: "center",
        paddingTop: 36
    }}
>
    <View
        style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#2455F5",
            justifyContent: "center",
            alignItems: "center"
        }}
    >
        <Ionicons
            name="navigate-outline"
            size={48}
            color="white"
        />
    </View>

    <Text
        style={{
            fontSize: 16,
            fontWeight: "bold",
            marginTop: 25
        }}
    >
        Start Walk
    </Text>
</TouchableOpacity>

        <TouchableOpacity
          style={{
            width: "47%",
            height: 182,
            backgroundColor: "white",
            borderRadius: 18,
            elevation: 4,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 5,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            alignItems: "center",
            paddingTop: 36,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#5520F5",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="time-outline" size={48} color="white" />
          </View>

          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 25,
            }}
          >
            Expected Arrival
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 35,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("./Contact")}
          style={{
            width: "47%",
            height: 182,
            backgroundColor: "white",
            borderRadius: 18,
            elevation: 4,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 5,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            alignItems: "center",
            paddingTop: 36,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#00B51A",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="people-outline" size={48} color="white" />
          </View>

          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 25,
            }}
          >
            Emergency Contact
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("./Account")}
          style={{
            width: "47%",
            height: 182,
            backgroundColor: "white",
            borderRadius: 18,
            elevation: 4,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 5,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            alignItems: "center",
            paddingTop: 36,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#FFC21A",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="person-outline" size={48} color="white" />
          </View>

          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 25,
            }}
          >
            Account
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => router.push("SOS")}
        style={{
          height: 120,
          backgroundColor: "#F82F35",
          borderRadius: 20,
          marginTop: 45,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 45,
        }}
      >
        <Ionicons name="call-outline" size={75} color="white" />

        <View
          style={{
            marginLeft: 40,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 48,
              fontWeight: "bold",
            }}
          >
            SOS
          </Text>

          <Text
            style={{
              color: "white",
              fontSize: 15,
              fontWeight: "bold",
              marginTop: -5,
            }}
          >
            Tap to Send Alert
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Home;
