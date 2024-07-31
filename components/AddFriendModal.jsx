import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useGlobalState } from '../context/globalContext';
import { Colors } from '../constants/Colors';
import tw from 'twrnc';

function AddFriendModal(props) {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [message, setMessage] = useState("");
    const { loggedUser } = useGlobalState();
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {   
        fetchUsers();
    }, []);    

    const fetchUsers = async () => {
        try {
            const response = await fetch(`http://192.168.1.8:5263/users`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching balance data:', error);
        }
    };

    const handleSearch = (text) => {
        setSearch(text);
        if (text.length > 2) {
            const results = users.filter(user => 
                user.username.toLowerCase().includes(text.toLowerCase()) || 
                user.email.toLowerCase().includes(text.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const sendRequest = async (senderId, receiverId) => {
        try {
            const response = await fetch(`http://192.168.1.8:5263/friendship/sendRequest/${senderId}/${receiverId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }    
            const data = await response.json();
            console.log(data); 
            setMessage(data.message); 
            props.fetchUser()           
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const handleClose = () => {
        props.onHide();
        setMessage("");
        setSearch("");
        setSearchResults([]);
    };

    return (
        <View style={styles.centeredView}>
            <Modal
                {...props}
                animationType="slide"
                transparent={true}
                visible={props.show}
                onRequestClose={() => { props.onHide(); }}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Find friends by Username or Email!</Text>
                    {message === "" ? (
                        <View>
                            <Text style={styles.label}>Search Friend</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Username or Email"
                                placeholderTextColor="silver"
                                value={search}
                                onChangeText={handleSearch}
                            />
                        </View>
                    ) : (
                        <Text style={tw`text-white`}>{message}</Text>
                    )}
                    {message === "" && searchResults.length > 0 && (
                        <ScrollView>
                            {searchResults.map((result, index) => (
                                <View key={index} style={styles.resultItem}>
                                    <View style={styles.resultText}>
                                        <Text style={tw`text-white`}>{result.username}</Text>
                                        <Text style={tw`text-white`}>{result.email}</Text>

                                    </View>
                                    <TouchableOpacity
                                        onPress={() => sendRequest(loggedUser.id, result.id)}
                                        style={styles.button}
                                    >
                                        <Text style={styles.buttonText}>Send Request</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>            
        </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: Colors.tbot.secondary,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: 'white'
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: 'white'
    },
    input: {
        width: 300,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: 'black',
        color: 'white'
    },
    resultItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
        borderBottomWidth: 1,
        borderColor: 'black'
    },
    resultText: {
        flex: 1,
        marginRight: 10,        
    },
    button: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        padding: 10,
        marginLeft: 10,
        flexShrink: 1
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    closeButton: {
        backgroundColor: 'orange',
        borderRadius: 5,
        padding: 10,
    },    
});

export default AddFriendModal;