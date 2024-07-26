import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { useGlobalState } from '../context/globalContext';
import { Colors } from '../constants/Colors';
import { Picker } from '@react-native-picker/picker';
import tbot from '../constants/TBOT.png'
import tw from 'twrnc';

function SettleUpModal({ show, onHide, userBalances }) {
  const { loggedUser, setLoggedUser } = useGlobalState();
  const [selectedFriend, setSelectedFriend] = useState("");    
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [paidBy, setPaidBy] = useState(loggedUser.id);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!show) {
      resetForm();
    }
  }, [show]);

  const handleFilterChange = (itemValue) => {
    setSelectedFriend(itemValue);
    const balance = -1 * userBalances[itemValue];
    setAmount(balance);
  };

  const handlePaidByChange = (itemValue) => {
    if (itemValue == loggedUser.id && selectedFriend == loggedUser.id) {
      setSelectedFriend(null);
    } else if (itemValue !== loggedUser.id) {
      setSelectedFriend(loggedUser.id);
    }
    setPaidBy(itemValue);
    const balance = userBalances[itemValue];
    setAmount(balance);
  };

  const handleSubmit = async () => {
    try {
      const participantIds = [paidBy, selectedFriend];
      const description = "Settle Up";
      const split = paidBy == loggedUser.id ? 2 : 3;

      const response = await fetch('http://192.168.1.8:5263/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantIds: participantIds,
          amount: amount,
          date: date,
          description: description,
          paidById: paidBy,
          split: split                 
        }),
      });

      if (response.ok) {
        setMessage('Settle Up successfully');
        setTimeout(() => {
          onHide();
        }, 1500);
      } else {
        setMessage('Something went wrong, check that you have filled in everything');
      }
    } catch (error) {
      setMessage('Something went wrong, check that you have filled in everything');
    }
  };

  const resetForm = () => {
    setDate(new Date().toISOString().substr(0, 10));
    setSelectedFriend("");
    setAmount("");
    setPaidBy(loggedUser.id);    
    setMessage("");
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };
  const createOptionsToPay = () => {
    const friendshipsSent = loggedUser.friendshipsSent || [];
        const friendshipsReceived = loggedUser.friendshipsReceived || [];
        const friendships = friendshipsSent.concat(friendshipsReceived) ;
    return Object.entries(userBalances).map(([userId, balance]) => {
      if (balance < 0) {
        const friend = friendships.find(friendship => friendship.receiverId == userId || friendship.senderId == userId);
        const friendName = friend.receiverId == userId ? friend.receiverName : friend.senderName;
        const id = friend.receiverId == userId ? friend.receiverId : friend.senderId;
        return <Picker.Item key={id} label={friendName} value={id} />;
      }
      return null;
    }).filter(item => item !== null);
  };

  const createOptionsToGet = () => {
    let friendships = [];
    if(loggedUser){
        friendships = loggedUser.friendshipsSent.concat(loggedUser.friendshipsReceived);
    }
    return Object.entries(userBalances).map(([userId, balance]) => {
      if (balance > 0) {
        const friend = friendships.find(friendship => friendship.receiverId == userId || friendship.senderId == userId);
        const friendName = friend?.receiverId == userId ? friend?.receiverName : friend?.senderName;
        const id = friend?.receiverId == userId ? friend?.receiverId : friend?.senderId;
        return <Picker.Item key={id} label={friendName} value={id} />;
      }
      return null;
    }).filter(item => item !== null);
  };

  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={show}
        onRequestClose={() => handleClose() }>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Settle Up</Text>
        <View style={styles.row}>
          <View style={styles.col}>
            <Picker selectedValue={paidBy} onValueChange={handlePaidByChange} style={styles.picker}>
              <Picker.Item label="You" value={loggedUser.id} />
              {createOptionsToGet()}
            </Picker>
          </View>
          <Text style={styles.label}>Paid</Text>
          <View style={styles.col}>
            <Picker selectedValue={selectedFriend} onValueChange={handleFilterChange} style={styles.picker}>
              <Picker.Item label="Select a friend" value={""} />
              {paidBy == loggedUser.id ? createOptionsToPay() : <Picker.Item label="You" value={loggedUser.id} />}
            </Picker>
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor="silver"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="silver"
            value={date}
            onChangeText={setDate}
          />
        </View>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <Image
            source={tbot}
            style={[tw`w-[40px] h-[40px]`]}                        
            resizeMode='contain'
          />
          <TouchableOpacity onPress={onHide} style={[styles.button, styles.closeButton]}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: Colors.tbot.secondary,
    padding: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    margin: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginHorizontal: 10,
    fontWeight: 'bold',
    color: 'white'
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'white',
    backgroundColor: 'black',
  },
  formGroup: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'black',
    width: '100%',
    color: 'white'
  },
  message: {
    color: 'red',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    alignItems: 'center'
  },
  closeButton: {
    backgroundColor: '#0d3a82',
  },
  buttonText: {
    color: 'black',
  },
  closeButtonText: {
    color: 'white',
  },
});

export default SettleUpModal;
