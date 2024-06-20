import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

const CustomButton= ({ title, handlePress, containerStyles, textStyles, isLoading}) => {
    return (
        <TouchableOpacity      
            style={[tw`rounded-xl min-h-[62px] justify-center items-center m-2`, { backgroundColor: 'orange'},
            containerStyles, isLoading ? 'opacity-50' : '']}        
            onPress={handlePress}
            activeOpacity={0.7}
            disabled={isLoading}
        >
            <Text style={[tw`font-bold text-lg`, textStyles]}>{title}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton;