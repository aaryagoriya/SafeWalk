import React from 'react'

import {
    TouchableOpacity,
    Text
} from 'react-native'

const OutlinedButton = ({
    title,
    onPress,
    icon
}) => {

    return (

        <TouchableOpacity
            onPress={onPress}
            style={{
                height: 72,
                borderWidth: 1.5,
                borderColor: "#AAAAAA",
                borderRadius: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginHorizontal: 10,
                marginBottom: 20
            }}
        >

            {icon}

            <Text style={{
                color: "black",
                fontSize: 20,
                marginLeft: 20
            }}>
                {title}
            </Text>

        </TouchableOpacity>
    )
}

export default OutlinedButton