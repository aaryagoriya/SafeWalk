import React from 'react'

import {
    View,
    Text,
    TouchableOpacity
} from 'react-native'

const ContactNumber = ({
    name,
    phone,
    letter,
    backgroundColor,
    onPress
}) => {

    return (

        <View style={{
            height: 103,
            borderWidth: 1.5,
            borderColor: "#CCCCCC",
            borderRadius: 20,
            marginBottom: 12,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20
        }}>

            <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: backgroundColor,
                justifyContent: "center",
                alignItems: "center"
            }}>

                <Text style={{
                    color: "white",
                    fontSize: 48
                }}>
                    {letter}
                </Text>

            </View>

            <View style={{
                flex: 1,
                marginLeft: 35
            }}>

                <Text style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    color: "black"
                }}>
                    {name}
                </Text>

                <Text style={{
                    fontSize: 16,
                    color: "#888888",
                    marginTop: 5
                }}>
                    {phone}
                </Text>

            </View>

            <TouchableOpacity
                onPress={onPress}
            >
                <Text style={{
                    fontSize: 30
                }}>
                    ♡
                </Text>
            </TouchableOpacity>

        </View>
    )
}

export default ContactNumber