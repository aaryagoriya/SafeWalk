import React from 'react'

import {
    TouchableOpacity,
    Text
} from 'react-native'

const CustomButton = ({
    title,
    onPress
}) => {

    return (

        <TouchableOpacity
            onPress={onPress}
            style={{
                height: 60,
                backgroundColor: "#2455F5",
                borderRadius: 18,
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 10
            }}
        >

            <Text style={{
                color: "white",
                fontSize: 23,
                fontWeight: "bold"
            }}>
                {title}
            </Text>

        </TouchableOpacity>
    )
}

export default CustomButton