import { View, Text } from 'react-native';
import React from 'react';
import tw from 'twrnc';

const AllExpenses = () => {
    return (
        <View style={tw`flex-1 justify-center`}>
            <Text style={tw`text-2xl font-bold text-center`}>AllExpenses</Text>
        </View>
    )
}

export default AllExpenses;