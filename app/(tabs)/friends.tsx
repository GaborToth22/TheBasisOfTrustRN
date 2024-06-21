import { View, Text } from 'react-native';
import React from 'react';
import tw from 'twrnc';

const Friends = () => {
    return (
        <View style={tw`flex-1 justify-center`}>
            <Text style={tw`text-2xl font-bold text-center`}>Friends</Text>
        </View>
    )
}

export default Friends;