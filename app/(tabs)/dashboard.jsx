import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useGlobalState } from '../../context/globalContext';
import Header from '../../components/Header';
import { Colors } from "../../constants/Colors";
import AddExpenseModal from '../../components/AddExpenseModal';
import SettleUpModal from '../../components/SettleUpModal';
import tbot from '../../constants/TBOT.png';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '@env';

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
        if (loggedUser) {
            fetchBalances();
        }
    }, [loggedUser, addExpenseModalShow, settleUpModalShow]);

    useFocusEffect(
        React.useCallback(() => {
            if (loggedUser) {
                fetchBalances();
            }
        }, [])
    );

    const fetchBalances = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/balance/${loggedUser.id}`);
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

    useEffect(() => {
        if (balances.length !== 0 && loggedUser) {
            const userBalances = {};
            let youOweSum = 0.00;
            let owesYouSum = 0.00;

            balances.forEach(balance => {
                const amount = balance.amount;                
                console.log(balance.userId);
                if (balance.userId === loggedUser.id) {
                    userBalances[balance.participantUserId] = (userBalances[balance.participantUserId] || 0) + amount;
                } else {
                    userBalances[balance.userId] = (userBalances[balance.userId] || 0) - amount;
                }
            });

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
                            <View key={userId} style={styles.balanceRow}>
                                <Text style={styles.balanceText}>{friendName} </Text>
                                <Text style={[styles.balanceText, getTextColor(parseFloat(youOwe))]}>{balance}</Text>
                            </View>
                        );
                    } else {
                        return null;
                    }
                })}
            </>
        );        
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
                            <View key={userId} style={styles.balanceRow}>
                                <Text style={styles.balanceText}>{friendName} </Text>
                                <Text style={[styles.balanceText, getTextColor(parseFloat(owesYou))]}>{balance}</Text>
                            </View>
                        );
                    } else {
                        return null;
                    }
                })}
            </>
        );        
    }

    return (
        <View style={styles.container}>
            <Header username={loggedUser.username}/>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: 'orange' }]}        
                    onPress={() => setAddExpenseModalShow(true)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>Add Expense</Text>
                </TouchableOpacity>
                <Image
                    source={tbot}
                    style={styles.image}                        
                    resizeMode='contain'
                />
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: Colors.tbot.green }]}        
                    onPress={() => setSettleUpModalShow(true)}
                    activeOpacity={0.7}
                >               
                    <Text style={styles.buttonText}>Settle Up</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceTitle}>Total Balance</Text>
                    <Text style={[styles.balanceValue, getTextColor(parseFloat(total))]}>{total}</Text>
                </View>
                <View style={styles.balanceDetails}>
                    <View>
                        <Text style={styles.balanceTitle}>You Owe</Text>
                        <Text style={[styles.balanceValue, getTextColor(parseFloat(youOwe))]}>{youOwe}</Text>
                    </View>
                    <View>
                        <Text style={styles.balanceTitle}>Owes You</Text>
                        <Text style={[styles.balanceValue, getTextColor(parseFloat(owesYou))]}>{owesYou}</Text>
                    </View>
                </View>
                <View style={styles.balancesContainer}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.tbot.bg,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        borderRadius: 10,
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
    image: {
        width: 40,
        height: 40,
    },
    scrollViewContainer: {
        flexGrow: 1,
        backgroundColor: Colors.tbot.secondary,
    },
    balanceContainer: {
        padding: 12,
    },
    balanceTitle: {
        fontSize: 24,
        textAlign: 'center',
        color: 'white',
    },
    balanceValue: {
        fontSize: 24,
        textAlign: 'center',
    },
    balanceDetails: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    balancesContainer: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    balanceText: {
        fontSize: 18,
        color: 'white',
        marginRight: 8,
    },
});

export default Dashboard;