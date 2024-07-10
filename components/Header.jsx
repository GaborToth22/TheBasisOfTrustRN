import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import tw from 'twrnc';
import { useGlobalState } from '../context/globalContext';
import { router } from 'expo-router';
import logout from '../constants/logout.png'
import icons from '../constants/icons';

function Header({ username }) {
    const { loggedUser, setLoggedUser } = useGlobalState();
    const handleLogout = () => {
        setLoggedUser('');
        router.push('/login');
    }

  return (
    <SafeAreaView style={{ marginTop: 30, padding: 10, height: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <TouchableOpacity>
            <Image
                source={icons.menu}
                style={[tw`w-[40px] h-[40px]`, { tintColor: 'white' }]}
                resizeMode='contain'
            />
        </TouchableOpacity>
        <Text style={tw`text-xl text-white font-bold`}>{username}</Text>
        <TouchableOpacity onPress={handleLogout}>
            <Image
                source={logout}
                style={[tw`w-[40px] h-[40px]`, { tintColor: 'white' }]}
                resizeMode='contain'
            />
        </TouchableOpacity>

    </SafeAreaView>
  )
}

export default Header
