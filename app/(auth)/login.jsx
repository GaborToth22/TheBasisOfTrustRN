import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "../../constants/Colors";
import tbotLogo from '../../constants/TBOT.png';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';
import { useGlobalState } from '../../context/globalContext';
import { API_BASE_URL } from '@env';

const Login = () => {
    const { loggedUser, setLoggedUser } = useGlobalState();
    const [form, setForm] = useState({
        username: '',
        password: ''
    });
    const [loginError, setLoginError] = useState("");        

    const submit = async (e) => {
        e.preventDefault();        
        try {
            const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
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
                const userDataResponse = await fetch(`${API_BASE_URL}/users/username/${form.username}`);
                const userData = await userDataResponse.json();
                setLoginError(`Welcome ${form.username}`);
                console.log('User successfully logged in.');
                setLoggedUser(userData);
                console.log(loggedUser);
                setTimeout(() => {
                    setLoginError('');
                    router.push('../(tabs)/dashboard');
                }, 2000);
            } else {
                setLoginError('Invalid username or password. Please try again.');
                console.error('Invalid username or password during login.');
            }
        } catch (error) {
            setLoginError('Invalid username or password. Please try again.');
            console.error('Invalid username or password during login.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <Image 
                        source={tbotLogo}
                        style={styles.logo}
                        resizeMode='contain'
                    />
                    <Text style={styles.title}>Log in to The Basis Of Trust</Text>
                    <FormField
                        title='Username'
                        placholder='Username'
                        value={form.username}
                        handleChangeText={(e) => setForm({ ...form, username: e})}
                        otherStyles={styles.formField}
                        keyboardType='username'
                    />
                    <FormField
                        title='Password'
                        placholder='Password'
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e})}
                        otherStyles={styles.formField}                        
                    />
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{loginError}</Text>
                    </View>
                    <CustomButton
                        title='Login'
                        handlePress={submit}
                        containerStyles={styles.loginButton} 
                        color='orange'                       
                    />
                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>
                            Don't have account?
                        </Text>
                        <Link href='register' style={styles.registerLink}>Register here!</Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.tbot.bg,
    },
    scrollView: {
        flexGrow: 1,
    },
    container: {
        width: '100%',
        justifyContent: 'center',
        height: '100%',
        paddingHorizontal: 16,
        marginVertical: 24,
    },
    logo: {
        width: 130,
        height: 100,
    },
    title: {
        fontSize: 24,
        marginTop: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    formField: {
        marginTop: 28,
    },
    errorContainer: {
        justifyContent: 'center',
        paddingTop: 20,
        flexDirection: 'row',
        gap: 8,
    },
    errorText: {
        fontSize: 18,
        color: 'white',
    },
    loginButton: {
        marginTop: 28,
    },
    registerContainer: {
        justifyContent: 'center',
        paddingTop: 20,
        flexDirection: 'row',
        gap: 8,
    },
    registerText: {
        fontSize: 18,
        color: 'white',
    },
    registerLink: {
        fontSize: 18,
        color: 'orange',
    },
});

export default Login;
