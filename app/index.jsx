import { StatusBar } from "expo-status-bar";
import { Text, View, Image } from "react-native";
import { router } from "expo-router";
import { NativeBaseProvider, Box, ScrollView, Center, Flex } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";
import tbotlogo from '../constants/TBOT.png';
import trust from '../constants/trust2.jpeg';
import CustomButton from "@/components/CustomButton";
import tw from 'twrnc';

const AppContent = () => {  
  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: Colors.tbot.bg }]}>
      <ScrollView contentContainerStyle={{ height: '100%'}}>
        <View style={tw`justify-center items-center pt-4 min-h-[85%]`}>
          <Image
            source={tbotlogo}
            style={tw`w-[130px] h-[100px]`}
            resizeMode='contain'
          />          
          <Image
            source={trust}
            style={tw`max-w-[380px] w-full h-[300px]`}
            resizeMode="contain"
          />
          <View style={tw`relative mt-5`}>
            <Text style={[tw`text-2xl font-bold text-center`, { color: 'silver'}]}>
              Discover How Easy To Manage Loans With {' '}
              <Text style={[tw``, { color: 'white'}]}>The Basis Of Trust</Text>
            </Text>
            <CustomButton               
              title="Login"
              handlePress={() => router.push('/login')}
              color='orange'              
            />
          </View>
        </View>
      </ScrollView>
      <StatusBar 
        backgroundColor="#161622"
        style="light"        
      />
    </SafeAreaView>
  );
}

export default function Index() {
  return (
    <NativeBaseProvider>      
        <AppContent />      
    </NativeBaseProvider>
  );
}