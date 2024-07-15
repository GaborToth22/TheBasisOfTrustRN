import { View, Text, ScrollView, Image} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "../../constants/Colors";
import tbotLogo from '../../constants/TBOT.png';
import tw from 'twrnc';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';
import { useGlobalState } from '../../context/globalContext';


const Login = () => {
    const { loggedUser, setLoggedUser } = useGlobalState();
    const [form, setForm] = useState({
        username: '',
        password: ''
    })
        const [loginError, setLoginError] = useState("");        

    const submit = async (e) => {
        e.preventDefault();
        
        try {
            const loginResponse = await fetch('http://192.168.1.8:5263/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: form.username,
                    password: form.password,
                }),
            });            

            if (loginResponse.ok ) {                
                const userDataResponse = await fetch(`http://192.168.1.8:5263/users/username/${form.username}`);
                const userData = await userDataResponse.json();
                setLoginError(`Welcome ${form.username}`)
                console.log('User successfully logged in.');
                setLoggedUser(userData);
                console.log(loggedUser);
                setTimeout(() => {
                    setLoginError('')
                    router.push('../(tabs)/dashboard');
                }, 2000);
            } else {
                setLoginError('Invalid username or password. Please try agagin.');
                console.error('Invalid username or password during login.');
            }
        } catch (error) {
            setLoginError('Invalid username or password. Please try agagin.');
            console.error('Invalid username or password during login.');
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
                    <Text style={[tw`text-2xl mt-8 font-bold`, { color: 'white'}]}>Log in to The Basis Of Trust</Text>
                    <FormField
                        title='Username'
                        placholder='Username'
                        value={form.username}
                        handleChangeText={(e) => setForm({ ...form, username: e})}
                        otherStyles={tw`mt-7`}
                        keyboardType='username'
                    />
                    <FormField
                        title='Password'
                        placholder='Password'
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e})}
                        otherStyles={tw`mt-7`}                        
                    />
                    <View style={tw`justify-center pt-5 flex-row gap-2`}>
                        <Text style={[tw`text-lg`, { color: 'white'}]}>{loginError}</Text>
                    </View>
                    <CustomButton
                        title='Login'
                        handlePress={submit}
                        containerStyles={tw`mt-7`} 
                        color='orange'                       
                    />
                    <View style={tw`justify-center pt-5 flex-row gap-2`}>
                        <Text style={[tw`text-lg`, { color: 'white'}]}>
                            Don't have account?
                        </Text>
                        <Link href='register' style={[tw`text-lg`, { color: 'orange'}]}>Register here!</Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Login;