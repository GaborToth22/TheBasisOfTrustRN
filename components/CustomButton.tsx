import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

const CustomButton= ({ title, handlePress, containerStyles, textStyles, color}) => {
    return (
        <TouchableOpacity      
            style={[tw`rounded-xl min-h-[62px] justify-center items-center m-2`, { backgroundColor: color},
            containerStyles,]}        
            onPress={handlePress}
            activeOpacity={0.7}           
        >
            <Text style={[tw`font-bold text-lg`, textStyles]}>{title}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton;