import { View, Text } from 'react-native';
import React, { useState, useEffect} from 'react';
import tw from 'twrnc';
import { useGlobalState } from '../../context/globalContext';

const Dashboard = () => {
    const { loggedUser, setLoggedUser } = useGlobalState();
    const [balances, setBalances] = useState([]);
    const [youOwe, setYouOwe] = useState(0);
    const [total, setTotal] = useState(0);
    const [owesYou, setOwesYou] = useState(0);
    const [userBalances, setUserBalances] = useState({});

    useEffect(() => {
        fetchBalances();
    }, [loggedUser]);

    console.log(loggedUser)
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

    console.log(balances);
    console.log(total);
    console.log(youOwe);
    console.log(owesYou);
    return (
        <View style={tw`flex-1 justify-center`}>
            <Text style={tw`text-2xl font-bold text-center`}>Dashboard Screen is coming soon</Text>
        </View>
    )
}

export default Dashboard;