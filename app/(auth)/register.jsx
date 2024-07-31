import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "../../constants/Colors";
import tbotLogo from '../../constants/TBOT.png';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';

const Register = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [registrationMessage, setRegistrationMessage] = useState('');

    const submit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://192.168.1.8:5263/auth/register`, {
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
                    setRegistrationMessage('');
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
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <Image 
                        source={tbotLogo}
                        style={styles.logo}
                        resizeMode='contain'
                    />
                    <Text style={styles.title}>Register to The Basis Of Trust</Text>
                    <FormField
                        title='Username'
                        placholder='Username'
                        value={form.username}
                        handleChangeText={(e) => setForm({ ...form, username: e})}
                        otherStyles={styles.formField}                        
                    />
                    <FormField
                        title='Email'
                        placholder='Email'
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e})}
                        otherStyles={styles.formField}
                        keyboardType='email-address'
                    />
                    <FormField
                        title='Password'
                        placholder='Password'
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e})}
                        otherStyles={styles.formField}                        
                    />
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>{registrationMessage}</Text>
                    </View>
                    <CustomButton
                        title='Register'
                        handlePress={submit}
                        containerStyles={styles.button} 
                        color='orange'                       
                    />
                    <View style={styles.linkContainer}>
                        <Text style={styles.linkText}>
                            Have an account already?
                        </Text>
                        <Link href='login' style={styles.link}>Go to Login!</Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

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
    messageContainer: {
        justifyContent: 'center',
        paddingTop: 20,
        flexDirection: 'row',
        gap: 8,
    },
    messageText: {
        fontSize: 18,
        color: 'white',
    },
    button: {
        marginTop: 28,
    },
    linkContainer: {
        justifyContent: 'center',
        paddingTop: 20,
        flexDirection: 'row',
        gap: 8,
    },
    linkText: {
        fontSize: 18,
        color: 'white',
    },
    link: {
        fontSize: 18,
        color: 'orange',
    },
});

export default Register;
