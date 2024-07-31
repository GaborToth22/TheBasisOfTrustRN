import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image} from 'react-native';
import Header from '../../components/Header';
import AddExpenseModal from '../../components/AddExpenseModal';
import SettleUpModal from '../../components/SettleUpModal';
import { useGlobalState } from '../../context/globalContext';
import tw from 'twrnc';
import tbot from '../../constants/TBOT.png';
import { Colors } from '../../constants/Colors';
import { useFocusEffect } from '@react-navigation/native';

function AllExpensesPage() {
  const { loggedUser, setLoggedUser } = useGlobalState();
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [addExpenseModalShow, setAddExpenseModalShow] = useState(false);
  const [settleUpModalShow, setSettleUpModalShow] = useState(false);
  const [youOwe, setYouOwe] = useState(0);
  const [total, setTotal] = useState(0);
  const [owesYou, setOwesYou] = useState(0);
  const [userBalances, setUserBalances] = useState({});  

  useEffect(() => {
    if (loggedUser) {
      fetchExpenses();
      fetchBalances();
  }
}, [loggedUser, addExpenseModalShow, settleUpModalShow]);

  useFocusEffect(
    React.useCallback(() => {
      if (loggedUser) {
        fetchExpenses();
        fetchBalances();
      }
    }, [])
  );


  const fetchExpenses = async () => {
    try {
      const response = await fetch(`http://192.168.1.8:5263/expense/userId/${loggedUser.id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchBalances = async () => {
    try {
      const response = await fetch(`http://192.168.1.8:5263/balance/${loggedUser.id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBalances(data);
    } catch (error) {
      console.error('Error fetching balances:', error);
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

  const renderExpenses = () => {
    const sortedExpenses = expenses.sort((a, b) => {
      const dateComparison = new Date(b.date) - new Date(a.date);
      if (dateComparison !== 0) {
        return dateComparison;
      } else {
        return b.id - a.id;
      }
    });

    return (
      <ScrollView>
        {sortedExpenses.map((expense) => (
          <View key={expense.id} style={styles.row}>
            <View style={[styles.cell, { width: '25%' }]}>
              <Text style={styles.labelText}>{expense.date.slice(0, 10)}</Text>
            </View>
            <View style={[styles.cell, { width: '25%' }]}>
              <Text style={styles.labelText}>{expense.description}</Text>
            </View>
            <View style={[styles.cell, { width: '25%' }]}>
              <Text style={styles.labelText}>{expense.paidById === loggedUser.id ? 'You' : expense.participants.find((participant) => participant.userId === expense.paidById).username} paid {expense.amount}</Text>
            </View>
            <View style={[styles.cell, { width: '25%' }]}>
              <Text style={((loggedUser.id === expense.paidById && expense.description !== "Settle Up") || (loggedUser.id !== expense.paidById && expense.description === "Settle Up")) ? styles.fontsGreen : styles.fontsRed}>
                {expense.paidById === loggedUser.id ?
                  (expense.description === "Settle Up" ?
                    (`You paid back ${expense.participants.find((participant) => participant.userId !== expense.paidById).username} ${expense.amount.toFixed(2)}`)
                    :
                    (`${expense.participants
                      .filter((participant) => participant.userId !== loggedUser.id)
                      .map((participant, index, array) =>
                        index === array.length - 1 ? participant.username : participant.username
                      )
                      .join(', ')
                      .replace(/,([^,]*)$/, ' and$1')} owes You with ${(expense.amount / expense.participants.length).toFixed(2)}`))
                  :
                  (expense.description === "Settle Up" ?
                    (`${expense.participants
                      .filter((participant) => participant.userId !== loggedUser.id)
                      .map((participant, index, array) =>
                        index === array.length - 1 ? participant.username : participant.username
                      )
                      .join(', ')
                      .replace(/,([^,]*)$/, ' and$1')} paid back You ${expense.amount}`)
                    :
                    (`You,  ${expense.participants
                      .filter((participant) => participant.userId !== loggedUser.id && participant.userId !== expense.paidById)
                      .map((participant, index, array) =>
                        index === array.length - 1 ? participant.username : participant.username
                      )
                      .join(', ')
                      .replace(/,([^,]*)$/, ' and$1')} owe ${expense.participants.find((participant) => participant.userId === expense.paidById).username} with ${expense.split == 1 ? (expense.amount / expense.participants.length).toFixed(2) : expense.amount.toFixed(2)}`))
                }
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <>
      <View style={styles.container}>
      <Header username={loggedUser.username}/>
        <View style={ { backgroundColor: '#067f99', borderRadius: 6, borderWidth: 1 }}>
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
          <View style={styles.row}>
            <View style={[styles.cell, { width: '33%' }]}>
              <Text style={styles.labelText}>You owe</Text>
              <Text style={youOwe != 0 ? styles.fontsRed : styles.fonts}>{youOwe}</Text>
            </View>
            <View style={[styles.cell, { width: '33%' }]}>
              <Text style={styles.labelText}>Total balance</Text>
              <Text style={total > 0 ? styles.fontsGreen : (total < 0 ? styles.fontsRed : styles.fonts)}>{total}</Text>
            </View>
            <View style={[styles.cell, { width: '33%' }]}>
              <Text style={styles.labelText}>You are owed</Text>
              <Text style={owesYou != 0 ? styles.fontsGreen : styles.fonts}>{owesYou}</Text>
            </View>
          </View>
          <View style={[styles.row, { borderTopWidth: 1, borderBottomWidth: 1, backgroundColor: '#065F81' }]}>
            <View style={[styles.cell, { width: '25%' }]}>
              <Text style={styles.labelText}>Date</Text>
            </View>
            <View style={[styles.cell, { width: '25%' }]}>
              <Text style={styles.labelText}>Description</Text>
            </View>
            <View style={[styles.cell, { width: '25%' }]}>
              <Text style={styles.labelText}>How paid?</Text>
            </View>
            <View style={[styles.cell, { width: '25%' }]}>
              <Text style={styles.labelText}>Debt</Text>
            </View>
          </View>
          {renderExpenses()}
        </View>
      </View>
      <AddExpenseModal show={addExpenseModalShow} fetchUser={fetchUser} onHide={() => setAddExpenseModalShow(false)}/>
      <SettleUpModal show={settleUpModalShow} userBalances={userBalances} fetchUser={fetchUser} onHide={() => setSettleUpModalShow(false)}/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    backgroundColor: Colors.tbot.bg
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    width: '33%',
    backgroundColor: 'orange', 
  },  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 5,
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontsGreen: {
    color: Colors.tbot.positive,
  },
  fontsRed: {
    color: Colors.tbot.negative,
  },
  fonts: {
    color: 'white',
  },
  labelText: {
    color: 'white',
  }
});

export default AllExpensesPage;
