import { Stack } from "expo-router";

const RootLayout = () => {

    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Index" />
            <Stack.Screen name="Landing" />
            <Stack.Screen name="Login" />
            <Stack.Screen name="SignUp" />
            <Stack.Screen name="Tabs" />
            <Stack.Screen name="AddContact" />
            <Stack.Screen name="LiveMap" />
        </Stack>
    );
};

export default RootLayout;
