import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect} from 'react';
import tw from 'twrnc';
import { useGlobalState } from '../../context/globalContext';
import Header from '../../components/Header';
import { Colors } from "../../constants/Colors";
import AddFriendModal from '../../components/AddFriendModal';
import tbot from '../../constants/TBOT.png'

const Friends = () => {
    const { loggedUser, setLoggedUser } = useGlobalState();
    const [ requestButton, setRequestButton ] = useState(false);    
    const [addFriendModalShow, setAddFriendModalShow] = useState(false);

    const handleRequestButtonChange = () => {
        setRequestButton(!requestButton);
    };

    const handleAddFriendModalChange = () => {
        setAddFriendModalShow(true);
    };

    const buttonLabel = requestButton ? ' Show Friends' : 'Show Friend Requests';
    const title = requestButton ? 'Friend Requests' : 'Friends';    

    const deleteFriend = async (senderId, receiverId) => {
        console.log(senderId)
        console.log(receiverId)
        try {
            const response = await fetch(`http://192.168.1.8:5263/friendship/declineRequest/${senderId}/${receiverId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }    
            const data = await response.json();
            console.log(data);        
            fetchUser()
        } catch (error) {
            console.error('Error fetching delete data:', error);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await fetch(`http://192.168.1.8:5263/users/username/${loggedUser.username}`);
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
        const friendshipsSent = loggedUser.friendshipsSent || [];
        const friendshipsReceived = loggedUser.friendshipsReceived || [];
        const friendships = friendshipsSent.concat(friendshipsReceived) ;
        if(requestButton == false){
        return (
            <>
                {friendships.filter(request => request.accepted).map(friendship => (
                    <View key={friendship.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <View style={tw`flex-1`}>
                            <Text style={[tw`font-bold text-base text-white ml-3 mt-1`]}>{friendship.receiverName === null ? friendship.senderName : friendship.receiverName}</Text>
                        </View>
                        <View>
                            <TouchableOpacity 
                                style={[tw`rounded-lg min-h-[31px] min-w-[30%] justify-center items-center mr-2 mt-1`, { backgroundColor: Colors.tbot.negative }]}
                                onPress={() => deleteFriend(loggedUser.id, friendship.receiverName === null ? friendship.senderId : friendship.receiverId)}
                            >
                                <Text>Delete friend</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </>
        );
        }else{
            return (
                <>
                    {loggedUser?.friendshipsReceived.filter(friendship => !friendship.accepted).map(friendship => (
                        <View key={friendship.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <View style={tw`flex-1`}>
                                <Text style={[tw`font-bold text-base text-white ml-3 mt-1`]}>{friendship.senderName}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableOpacity style={[tw`rounded-lg min-h-[31px] min-w-[20%] justify-center items-center mr-2 mt-1`, { backgroundColor: Colors.tbot.positive }]}>
                                    <Text>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[tw`rounded-lg min-h-[31px] min-w-[20%] justify-center items-center mr-2 mt-1`, { backgroundColor: Colors.tbot.negative }]}
                                    onPress={() => deleteFriend(loggedUser.id, friendship.senderId)}
                                >
                                    <Text>Decline</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                    {loggedUser?.friendshipsSent.filter(friendship => !friendship.accepted).map(friendship => (
                        <View key={friendship.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <View>
                                <Text style={[tw`font-bold text-base text-white ml-3 mt-1`]}>{friendship.receiverName}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center'}}>                                
                                <TouchableOpacity 
                                    style={[tw`rounded-lg min-h-[31px] min-w-[20%] justify-center items-center mr-2 mt-1`, { backgroundColor: Colors.tbot.negative }]}
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
    }

    return (
        <View style={[tw`flex-1`, { backgroundColor: Colors.tbot.bg}]}>
            <Header username={loggedUser.username}/>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <TouchableOpacity
                style={[tw`rounded-xl min-h-[62px] min-w-[40%] justify-center items-center m-2`, { backgroundColor: requestButton ? Colors.tbot.positive : Colors.tbot.green }]}        
                onPress={handleRequestButtonChange}
                activeOpacity={0.7}
            >
                <Text style={[tw`font-bold text-base`]}>{buttonLabel}</Text>
            </TouchableOpacity>
            <Image
            source={tbot}
            style={[tw`w-[40px] h-[40px]`]}                        
            resizeMode='contain'
            />
            <TouchableOpacity
                style={[tw`rounded-xl min-h-[62px] min-w-[40%] justify-center items-center m-2`, { backgroundColor: 'orange' }]}        
                onPress={handleAddFriendModalChange}
                activeOpacity={0.7}
            >               
                <Text style={[tw`font-bold text-base`]}>Add Friend</Text>
            </TouchableOpacity>
            </View>
                <Text style={tw`text-2xl font-bold p-2 text-center text-white`}>{title}</Text>
            <ScrollView style={tw`flex-1`} contentContainerStyle={[tw`flex-grow`, { backgroundColor: Colors.tbot.secondary }]}>
                {renderFriends()}
                <AddFriendModal show={addFriendModalShow} fetchUser={fetchUser} onHide={() => setAddFriendModalShow(false)}/>
            </ScrollView>
        </View>
    )
}

export default Friends;