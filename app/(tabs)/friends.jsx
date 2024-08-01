import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useGlobalState } from '../../context/globalContext';
import Header from '../../components/Header';
import { Colors } from "../../constants/Colors";
import AddFriendModal from '../../components/AddFriendModal';
import tbot from '../../constants/TBOT.png';
import { API_BASE_URL } from '@env';

const Friends = () => {
    const { loggedUser, setLoggedUser } = useGlobalState();
    const [requestButton, setRequestButton] = useState(false);    
    const [addFriendModalShow, setAddFriendModalShow] = useState(false);

    const handleRequestButtonChange = () => {
        setRequestButton(!requestButton);
    };

    const handleAddFriendModalChange = () => {
        setAddFriendModalShow(true);
    };

    const buttonLabel = requestButton ? ' Show Friends' : 'Show Friend Requests';
    const title = requestButton ? 'Friend Requests' : 'Friends';    

    const acceptFriend = async (senderId, receiverId) => {        
        try {
            const response = await fetch(`${API_BASE_URL}/friendship/acceptRequest/${senderId}/${receiverId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }    
            const data = await response.json();                  
            fetchUser();
        } catch (error) {
            console.error('Error fetching delete data:', error);
        }
    };

    const deleteFriend = async (senderId, receiverId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/friendship/declineRequest/${senderId}/${receiverId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }    
            const data = await response.json();
            fetchUser();
        } catch (error) {
            console.error('Error fetching delete data:', error);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/username/${loggedUser.username}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setLoggedUser(data);
        } catch (error) {
            console.error('Error fetching balance data:', error);
        }
    };

    const renderFriends = () => {
        const friendshipsSent = loggedUser?.friendshipsSent || [];
        const friendshipsReceived = loggedUser?.friendshipsReceived || [];
        const friendships = friendshipsSent.concat(friendshipsReceived);
        
        if (requestButton === false) {
            return (
                <>
                    {friendships.filter(request => request.accepted).map(friendship => (
                        <View key={friendship.id} style={styles.friendRow}>
                            <View style={styles.friendInfo}>
                                <Text style={styles.friendName}>{friendship.receiverName === null ? friendship.senderName : friendship.receiverName}</Text>
                            </View>
                            <View>
                                <TouchableOpacity 
                                    style={[styles.button, { backgroundColor: Colors.tbot.negative }]}
                                    onPress={() => deleteFriend(loggedUser.id, friendship.receiverName === null ? friendship.senderId : friendship.receiverId)}
                                >
                                    <Text>Delete friend</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </>
            );
        } else {
            return (
                <>
                    {loggedUser?.friendshipsReceived.filter(friendship => !friendship.accepted).map(friendship => (
                        <View key={friendship.id} style={styles.friendRow}>
                            <View style={styles.friendInfo}>
                                <Text style={styles.friendName}>{friendship.senderName}</Text>
                            </View>
                            <View style={styles.actionButtons}>
                                <TouchableOpacity 
                                    style={[styles.button, { backgroundColor: Colors.tbot.positive }]}
                                    onPress={() => acceptFriend(loggedUser.id, friendship.senderId)}
                                >
                                    <Text>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.button, { backgroundColor: Colors.tbot.negative }]}
                                    onPress={() => deleteFriend(loggedUser.id, friendship.senderId)}
                                >
                                    <Text>Decline</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                    {loggedUser?.friendshipsSent.filter(friendship => !friendship.accepted).map(friendship => (
                        <View key={friendship.id} style={styles.friendRow}>
                            <View>
                                <Text style={styles.friendName}>{friendship.receiverName}</Text>
                            </View>
                            <View style={styles.actionButtons}>                                
                                <TouchableOpacity 
                                    style={[styles.button, { backgroundColor: Colors.tbot.negative }]}
                                    onPress={() => deleteFriend(loggedUser.id, friendship.receiverId)}
                                >
                                    <Text>Decline</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </>
            );
        }
    };

    return (
        <View style={styles.container}>
            <Header username={loggedUser.username} />
            <View style={styles.headerRow}>
                <TouchableOpacity
                    style={[styles.toggleButton, { backgroundColor: requestButton ? Colors.tbot.positive : Colors.tbot.green }]}        
                    onPress={handleRequestButtonChange}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>{buttonLabel}</Text>
                </TouchableOpacity>
                <Image
                    source={tbot}
                    style={styles.logo}
                    resizeMode='contain'
                />
                <TouchableOpacity
                    style={[styles.toggleButton, { backgroundColor: 'orange' }]}        
                    onPress={handleAddFriendModalChange}
                    activeOpacity={0.7}
                >               
                    <Text style={styles.buttonText}>Add Friend</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>{title}</Text>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                {renderFriends()}
                <AddFriendModal show={addFriendModalShow} fetchUser={fetchUser} onHide={() => setAddFriendModalShow(false)} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.tbot.bg,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toggleButton: {
        borderRadius: 15,
        minHeight: 62,
        minWidth: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    logo: {
        width: 40,
        height: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 8,
        textAlign: 'center',
        color: 'white',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        backgroundColor: Colors.tbot.secondary,
    },
    friendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 8,
    },
    friendInfo: {
        flex: 1,
    },
    friendName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white',
        marginLeft: 12,
        marginTop: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        borderRadius: 10,
        minHeight: 31,
        minWidth: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginTop: 4,
    },
});

export default Friends;