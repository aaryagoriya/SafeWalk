import { Tabs } from "expo-router";

import AntDesign from "@expo/vector-icons/AntDesign";

import Feather from "@expo/vector-icons/Feather";

import { Ionicons } from "@expo/vector-icons";

const TabsLayout = () => {

    return (

        <Tabs

            screenOptions={{
                headerShown: false,

                tabBarStyle: {
                    height: 75,
                    backgroundColor: "black",
                    borderTopWidth: 1,
                    borderTopColor: "#000"
                },

                tabBarLabelStyle: {
                    fontSize: 12
                },

                tabBarActiveTintColor: "#2455F5",
                tabBarInactiveTintColor: "#777777"
            }}

        >

            <Tabs.Screen
                name="Home"
                options={{
                    title: "Home",

                    tabBarIcon: ({ color, size }) => (

                        <AntDesign
                            name="home"
                            size={size}
                            color={color}
                        />

                    )
                }}
            />

            <Tabs.Screen
                name="Sos"
                options={{
                    title: "SOS",

                    tabBarActiveTintColor: "#F82F35",

                    tabBarIcon: ({ color, size }) => (

                        <Feather
                            name="phone"
                            size={size}
                            color={color}
                        />

                    )
                }}
            />

            <Tabs.Screen
                name="Contact"
                options={{
                    title: "Contact",

                    tabBarIcon: ({ color, size }) => (

                        <Ionicons
                            name="people-outline"
                            size={size}
                            color={color}
                        />

                    )
                }}
            />

            <Tabs.Screen
                name="Account"
                options={{
                    title: "Account",

                    tabBarIcon: ({ color, size }) => (

                        <Feather
                            name="user"
                            size={size}
                            color={color}
                        />

                    )
                }}
            />

        </Tabs>

    );

};

export default TabsLayout;