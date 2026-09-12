import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import CustomButton from "../../components/CustomButton";

const SOS = () => {
  const router = useRouter();

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
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingHorizontal: 30,
          paddingTop: 50,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 34,
              fontWeight: "bold",
              marginLeft: 55,
            }}
          >
            SOS Alert
          </Text>
        </View>

        <Text
          style={{
            textAlign: "center",
            fontSize: 13,
            fontWeight: "bold",
            marginTop: 8,
          }}
        >
          Help is on the way.
        </Text>

        <View
          style={{
            alignItems: "center",
            marginTop: 70,
          }}
        >
          <View
            style={{
              width: 230,
              height: 230,
              borderRadius: 115,
              backgroundColor: "#F2CECB",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: "#F83B32",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="call-outline" size={105} color="white" />
            </View>
          </View>
        </View>

        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
            color: "#888888",
            marginTop: 28,
          }}
        >
          Your location will be shared{"\n"}
          with your contact
        </Text>

        <View
          style={{
            marginTop: 62,
          }}
        >
          <CustomButton
            title="Send SOS Alert"
            backgroundColor="#F83B32"
            onPress={() => router.push("/LiveMap")}
          />
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text
            style={{
              color: "#2455F5",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SOS;
