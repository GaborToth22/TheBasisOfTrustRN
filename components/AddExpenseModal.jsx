import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Image } from 'react-native';
import { useGlobalState } from '../context/globalContext';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../constants/Colors';
import removeIcon from '../constants/decline.png';
import tw from 'twrnc';
import tbot from '../constants/TBOT.png';
import { API_BASE_URL } from '@env';

function AddExpenseModal(props) {
  const { loggedUser, setLoggedUser } = useGlobalState();
  const [participants, setParticipants] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [paidBy, setPaidBy] = useState(loggedUser.id);
  const [split, setSplit] = useState(1);
  const [message, setMessage] = useState("");
  const [options, setOptions] = useState([]);
  const [pickerItems, setPickerItems] = useState([
    <Picker.Item key="equally" label="Equally" value={1} />
  ]);
  
  useEffect(() => {   
    checkPaidByOptions(participants);        
  }, [loggedUser, participants]);

  useEffect(() => {
    const items = [
      <Picker.Item key="equally" label="Equally" value={1} />
    ];
    if (participants.length === 1) {
      items.push(
        <Picker.Item key="you-owe" label="You Owe" value={2} />,
        <Picker.Item key="owes-you" label="Owes You" value={3} />
      );
    }
    setPickerItems(items);
  }, [participants]);

  const handleFilterChange = (text) => {
    const inputValue = text.toLowerCase();
    const filtered = loggedUser.friendshipsSent
      .concat(loggedUser.friendshipsReceived)
      .filter(friendship => friendship.accepted)
      .filter(friendship => { 
        const name = (loggedUser.id === friendship.senderId) ? friendship.receiverName : friendship.senderName;
        return !participants.includes(friendship) && name.toLowerCase().includes(inputValue);
      });
    setFilter(text);
    setFilteredFriends(filtered);
  };

  const handleSubmit = async () => {
    try {
      const participantIds = participants.map(friendship => friendship.senderName === null ? friendship.receiverId : friendship.senderId);
      participantIds.push(loggedUser.id);
      const response = await fetch(`${API_BASE_URL}/expense`, {
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
        setMessage('Expense successfully created.');
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setMessage('Something went wrong, check that you have filled in everything');
      }
    } catch (error) {
      setMessage('Something went wrong, check that you have filled in everything');
    }
  };

  const handleClose = () => {
    setFilter("");
    setDate(new Date().toISOString().substr(0, 10));
    setParticipants([]);
    setAmount("");
    setSplit(1);
    setPaidBy(loggedUser.id);
    setDescription("");
    setMessage("");
    props.onHide();
  };

  const addParticipant = (friendship) => {
    if (!participants.some(participant => participant.id === friendship.id)) {
      setParticipants([...participants, friendship]);
      setFilter("");
    }
  };

  const removeParticipant = (friendshipId) => {
    const updatedParticipants = participants.filter(participant => participant.id !== friendshipId);
    setParticipants(updatedParticipants);
  };

  const checkPaidByOptions = async (participants) => {
    const participantsIds = participants.map(p => p.senderName === null ? p.receiverId : p.senderId);
    try {
      const response = await fetch(`${API_BASE_URL}/friendship/checkPaidBy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(participantsIds)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch paid by options');
      }

      const users = await response.json();
      setOptions(users);
    } catch (error) {
      return [];
    }
  };

  const renderOptions = (users) => {
    return users.map(user => (
      <Picker.Item key={user.id} label={user.username} value={user.id} />
    ));
  };

  return (
    <Modal 
        {...props}
        animationType="slide"
        transparent={true}
        visible={props.show}
        onRequestClose={() => handleClose() }>
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>Add an Expense</Text>
        <ScrollView style={styles.scrollView}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>With you and:</Text>
            {participants.length > 0 && (
              <View style={styles.participantsContainer}>
                {participants.map((result, index) => (
                  <View key={index} style={styles.participantItem}>
                    <Text style={styles.participantName}>{result.receiverName === null ? result.senderName : result.receiverName}</Text>
                    <TouchableOpacity onPress={() => removeParticipant(result.id)}>
                    <Image
                        source={removeIcon}
                        style={[tw`w-[25px] h-[25px]`, { tintColor: 'white' }]}                        
                        resizeMode='contain'
                    />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
          <View style={styles.formGroup}>
            <TextInput
              style={styles.input}
              placeholder="Search friends"
              placeholderTextColor="silver"
              value={filter}
              onChangeText={handleFilterChange}
            />
            {filter !== "" && filteredFriends.length > 0 && (
              <View>
                {filteredFriends.map((result, index) => (
                  <TouchableOpacity key={index} onPress={() => addParticipant(result)} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                    <Text style={styles.addButtonText}>{result.receiverName === null ? result.senderName : result.receiverName}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a description"
              placeholderTextColor="silver"
              value={description}
              onChangeText={setDescription}
            />
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
            <Text style={styles.label}>Paid by:</Text>
            <Picker
              selectedValue={paidBy}
              onValueChange={(itemValue) => setPaidBy(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="You" value={loggedUser.id} />
              {renderOptions(options)}
            </Picker>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Split:</Text>
            <Picker
              selectedValue={split}
              onValueChange={(itemValue) => {
                setSplit(itemValue);
                if (itemValue == 2 && participants.length === 1) {
                  setPaidBy(participants[0].senderName === null ? participants[0].receiverId : participants[0].senderId);
                } else if (itemValue == 3) {
                  setPaidBy(loggedUser.id);
                }
              }}
              style={styles.picker}
            >
              {pickerItems}
            </Picker>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="silver"
              value={date}
              onChangeText={setDate}
            />
          </View>
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <Image
            source={tbot}
            style={[tw`w-[40px] h-[40px]`]}                        
            resizeMode='contain'
          />
          <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: Colors.tbot.secondary,
    padding: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    margin: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white'
  },
  scrollView: {
    width: '100%'
  },
  formGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white'
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
  picker: {
    height: 50,
    width: '100%',
    color: 'white',
    backgroundColor: 'black',
  },
  participantsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    color: 'white',
    backgroundColor: Colors.tbot.bg,
    borderRadius: 5,
    borderWidth: 1,
    paddingLeft: 10,
    alignSelf: 'flex-start',
  },
  participantName: {
    marginRight: 5,
    color: 'white'
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    color: 'white',
    backgroundColor: Colors.tbot.bg,
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    marginRight: 5,
    fontSize: 18,
    color: 'white'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  button: {
    padding: 10,
    backgroundColor: 'orange',
    borderRadius: 5,
    alignItems: 'center',  
    width: '30%',
    
  },
  closeButton: {
    backgroundColor: '#0d3a82',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    
  },
  message: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10
  }  
});

export default AddExpenseModal;