import { View, Text, ScrollView, Image} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "../../constants/Colors";
import tbotLogo from '../../constants/TBOT.png';
import tw from 'twrnc';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';

const Register = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    })
    const [registrationMessage, setRegistrationMessage] = useState('')

    const submit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://192.168.1.8:5263/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: form.email,
                    username: form.username,
                    password: form.password                    
                }),
            });

            if (response.ok) {
                console.log('User successfully registered.');                
                setRegistrationMessage('Registration successful! Please proceed to log in.');
                setTimeout(() => {
                    setRegistrationMessage('')
                    router.navigate('login');
                }, 2000);

            } else {
                console.error('Registration failed.');
                setRegistrationMessage('Registration failed. Please try again!');
            }
        } catch (error) {
            console.error('Failed to register user.');
            setRegistrationMessage('Registration failed. Please try again!');
        }
    }

    return (
        <SafeAreaView style={[tw`h-full`, { backgroundColor: Colors.tbot.bg}]}>
            <ScrollView>
                <View style={tw`w-full justify-center h-full px-4 my-6`}>
                    <Image 
                        source={tbotLogo}
                        style={tw`w-[130px] h-[100px]`}
                        resizeMode='contain'
                    />
                    <Text style={[tw`text-2xl mt-8 font-bold`, { color: 'white'}]}>Register to The Basis Of Trust</Text>
                    <FormField
                        title='Username'
                        placholder='Username'
                        value={form.username}
                        handleChangeText={(e) => setForm({ ...form, username: e})}
                        otherStyles={tw`mt-10`}                        
                    />
                    <FormField
                        title='Email'
                        placholder='Email'
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e})}
                        otherStyles={tw`mt-7`}
                        keyboardType='email-address'
                    />
                    <FormField
                        title='Password'
                        placholder='Password'
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e})}
                        otherStyles={tw`mt-7`}                        
                    />
                    <View style={tw`justify-center pt-5 flex-row gap-2`}>
                        <Text style={[tw`text-lg`, { color: 'white'}]}>{registrationMessage}</Text>
                    </View>
                    <CustomButton
                        title='Register'
                        handlePress={submit}
                        containerStyles={tw`mt-7`}                        
                    />
                    <View style={tw`justify-center pt-5 flex-row gap-2`}>
                        <Text style={[tw`text-lg`, { color: 'white'}]}>
                            Have an account already?
                        </Text>
                        <Link href='login' style={[tw`text-lg`, { color: 'orange'}]}>Go to Login!</Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Register;