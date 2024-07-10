import { View, Text, ScrollView } from 'react-native';
import React, { useState, useEffect} from 'react';
import tw from 'twrnc';
import { useGlobalState } from '../../context/globalContext';
import Header from '../../components/Header';
import { Colors } from "../../constants/Colors";

const AllExpenses = () => {
    const { loggedUser, setLoggedUser } = useGlobalState();
    return (
        <View style={[tw`flex-1`, { backgroundColor: Colors.tbot.bg}]}>
            <Header username={loggedUser.username}/>
            <ScrollView contentContainerStyle={tw`flex-grow justify-center`}>
                <Text style={tw`text-2xl font-bold text-center`}>All expenses</Text>
            </ScrollView>
        </View>
    )
}

export default AllExpenses;