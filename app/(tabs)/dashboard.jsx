import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect} from 'react';
import tw from 'twrnc';
import { useGlobalState } from '../../context/globalContext';
import Header from '../../components/Header';
import { Colors } from "../../constants/Colors";
import AddExpenseModal from '../../components/AddExpenseModal';
import SettleUpModal from '../../components/SettleUpModal';
import tbot from '../../constants/TBOT.png'

const Dashboard = () => {
    const { loggedUser, setLoggedUser } = useGlobalState();
    const [balances, setBalances] = useState([]);
    const [youOwe, setYouOwe] = useState(0);
    const [total, setTotal] = useState(0);
    const [owesYou, setOwesYou] = useState(0);
    const [userBalances, setUserBalances] = useState({});
    const [addExpenseModalShow, setAddExpenseModalShow] = useState(false);
    const [settleUpModalShow, setSettleUpModalShow] = useState(false);

    useEffect(() => {
        fetchBalances();
    }, [loggedUser, addExpenseModalShow, settleUpModalShow]);

    console.log(loggedUser)
    console.log(addExpenseModalShow)

    const fetchBalances = async () => {
        try {
            const response = await fetch(`http://192.168.1.8:5263/balance/${loggedUser.id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setBalances(data);
        } catch (error) {
            console.error('Error fetching balance data:', error);
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

    useEffect(() => {
        if (balances.length !== 0 && loggedUser) {
            const userBalances = {};
            let youOweSum = 0.00;
            let owesYouSum = 0.00;

            balances.forEach(balance => {
                const amount = balance.amount;                
                console.log(balance.userId)
                if (balance.userId === loggedUser.id) {
                    userBalances[balance.participantUserId] = (userBalances[balance.participantUserId] || 0) + amount;
                } else {
                    userBalances[balance.userId] = (userBalances[balance.userId] || 0) - amount;
                }})

            Object.values(userBalances).forEach(balance => {
                if (balance < 0) {
                    youOweSum += balance;
                } else {
                    owesYouSum += balance;
                }
            });
            const formattedBalances = {};
        Object.keys(userBalances).forEach(key => {
            formattedBalances[key] = userBalances[key].toFixed(2);
        });

        setYouOwe(youOweSum.toFixed(2));
        setOwesYou(owesYouSum.toFixed(2));
        setTotal((owesYouSum + youOweSum).toFixed(2));
        setUserBalances(formattedBalances);
        }
    }, [balances, loggedUser]);

    const getTextColor = (value) => {
        if (value > 0) {
            return { color: Colors.tbot.positive };
        } else if (value < 0) {
            return { color: Colors.tbot.negative };
        } else {
            return { color: Colors.tbot.white };
        }
    };

    function renderYouOwe(userBalances) {
        const friendshipsSent = loggedUser.friendshipsSent || [];
        const friendshipsReceived = loggedUser.friendshipsReceived || [];
        const friendships = friendshipsSent.concat(friendshipsReceived);
      return(
        <>
            {Object.entries(userBalances).map(([userId, balance]) => {
                if (balance < 0) {
                    const friend = friendships.find(friendship => friendship.receiverId == userId || friendship.senderId == userId);
                    const friendName = friend.receiverId == userId ? friend.receiverName : friend.senderName;
                    return (
                        <View key={userId} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={tw`text-lg text-white mr-2`}>{friendName} </Text><Text style={[tw`text-lg`, getTextColor(parseFloat(youOwe))]}>{balance}</Text>
                        </View>
                    );
                } else {
                    return null;
                }
            })}
        </>
      )        
    }

    function renderOwesYou(userBalances) {
        const friendships = loggedUser.friendshipsSent.concat(loggedUser.friendshipsReceived);
        return(
          <>
              {Object.entries(userBalances).map(([userId, balance]) => {
                  if (balance > 0) {
                      const friend = friendships.find(friendship => friendship?.receiverId == userId || friendship?.senderId == userId);
                      const friendName = friend?.receiverId == userId ? friend?.receiverName : friend?.senderName;
                      return (
                        <View key={userId} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={tw`text-lg text-white mr-2`}>{friendName} </Text><Text style={[tw`text-lg`, getTextColor(parseFloat(owesYou))]}>{balance}</Text>
                        </View>
                      );
                  } else {
                      return null;
                  }
              })}
          </>
        )        
      }

    return (
        <View style={[tw`flex-1`, { backgroundColor: Colors.tbot.bg}]}>
            <Header username={loggedUser.username}/>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <TouchableOpacity
                style={[tw`rounded-xl min-h-[62px] min-w-[40%] justify-center items-center m-2`, { backgroundColor: 'orange' }]}        
                onPress={() => setAddExpenseModalShow(true)}
                activeOpacity={0.7}
            >
                <Text style={[tw`font-bold text-base`]}>Add Expense</Text>
            </TouchableOpacity>
            <Image
            source={tbot}
            style={[tw`w-[40px] h-[40px]`]}                        
            resizeMode='contain'
            />
            <TouchableOpacity
                style={[tw`rounded-xl min-h-[62px] min-w-[40%] justify-center items-center m-2`, { backgroundColor: Colors.tbot.green }]}        
                onPress={() => setSettleUpModalShow(true)}
                activeOpacity={0.7}
            >               
                <Text style={[tw`font-bold text-base`]}>Settle Up</Text>
            </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={[tw`flex-grow`, { backgroundColor: Colors.tbot.secondary}]}>
                <View style={ tw`p-3 `}>
                    <Text style={tw`text-2xl text-center text-white`}>Total Balance</Text>
                    <Text style={[tw`text-2xl text-center`, getTextColor(parseFloat(total))]}>{total}</Text>
                </View>
                <View style={{ padding: 5, flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: 'black', borderBottomWidth: 1}}>
                    <View>
                        <Text style={tw`text-2xl text-center text-white`}>You Owe</Text>
                        <Text style={[tw`text-2xl text-center`, getTextColor(parseFloat(youOwe))]}>{youOwe}</Text>
                    </View>
                    <View>
                        <Text style={tw`text-2xl text-center text-white`}>Owes You</Text>
                        <Text style={[tw`text-2xl text-center`, getTextColor(parseFloat(owesYou))]}>{owesYou}</Text>
                    </View>
                </View>
                <View style={{ padding: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        {loggedUser !== "" && renderYouOwe(userBalances)}
                    </View>
                    <View>
                        {loggedUser !== "" && renderOwesYou(userBalances)}
                    </View>
                </View>
                <AddExpenseModal show={addExpenseModalShow} fetchUser={fetchUser} onHide={() => setAddExpenseModalShow(false)}/>
                <SettleUpModal show={settleUpModalShow} userBalances={userBalances} fetchUser={fetchUser} onHide={() => setSettleUpModalShow(false)}/>
            </ScrollView>
        </View>
    )
}

export default Dashboard;