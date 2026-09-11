import React from 'react'

import {
    View,
    Text,
    TextInput
} from 'react-native'

const CustomInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType,
    leftIcon,
    rightIcon,
    onRightPress
}) => {

    return (

        <View style={{
            marginBottom: 20
        }}>

            <Text style={{
                fontSize: 15,
                color: "black",
                marginBottom: 10
            }}>
                {label}
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

                {leftIcon}

                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    secureTextEntry={secureTextEntry}
                    style={{
                        flex: 1,
                        fontSize: 16,
                        marginLeft: 15,
                        color: "black"
                    }}
                />

                {rightIcon}

            </View>

        </View>
    )
}

export default CustomInput