import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import database from '@react-native-firebase/database';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [list, setList] = useState('');
  const [cardIndex, setCardIndex] = useState(null);
  const [isUpdataData, setIsUpdataData] = useState(false);

  useEffect(() => {
    getDBData();
  }, []);

  const getDBData = async () => {
    const response = await database()
      .ref('todo')
      .on('value', snapshot => {
        const data = snapshot.val();
        setList(data);
      });
  };

  const handleAddData = async () => {
    try {
      if (inputText.length > 0) {
        const index = list?.length ? list?.length : 1;
        await database().ref(`todo/${index}`).set({
          value: inputText,
        });
        setInputText('');
      } else {
        Alert.alert('Warning', ' Enter the value');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateData = async () => {
    try {
      if (inputText.length > 0) {
        await database().ref(`todo/${cardIndex}`).update({
          value: inputText,
        });
        setInputText('');
        setIsUpdataData(false);
      } else {
        Alert.alert('Warning', ' Enter the value');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const hnadleDeleteData = (cardIndexNo, cardText) => {
    Alert.alert('Alert', `Are you sure to delete :  \n${cardText}`, [
      {
        text: 'Cancel',
        onPress: () => {},
      },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await database().ref(`todo/${cardIndexNo}`).remove();
            setInputText('');
            setIsUpdataData(false);
          } catch (error) {
            console.log(error);
          }
        },
      },
    ]);
  };
  const handleCardPress = (cardIndexNo, textValue) => {
    setInputText(textValue);
    setCardIndex(cardIndexNo);
    setIsUpdataData(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <View>
        <Text style={{textAlign: 'center', fontWeight: '900', fontSize: 20}}>
          Todo App
        </Text>
        <TextInput
          placeholder="Enter your daily task..."
          value={inputText}
          onChangeText={value => setInputText(value)}
          style={styles.inputBox}
        />

        {isUpdataData ? (
          <TouchableOpacity
            style={[styles.addBtn, {backgroundColor: 'green'}]}
            onPress={handleUpdateData}>
            <Text style={{color: 'white'}}>Update</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.addBtn} onPress={handleAddData}>
            <Text style={{color: 'white'}}>Add</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardContainer}>
        <Text style={{fontSize: 20, marginBottom: 10, fontWeight: 'bold'}}>
          Todo List
        </Text>
        <FlatList
          data={list}
          renderItem={item => {
            const cardIndex = item.index;
            if (item.item !== null) {
              return (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => handleCardPress(cardIndex, item?.item?.value)}
                  onLongPress={() =>
                    hnadleDeleteData(cardIndex, item?.item?.value)
                  }>
                  <Text>{item?.item?.value}</Text>
                </TouchableOpacity>
              );
            }
          }}
        />
      </View>
    </View>
  );
};

const {height, width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  inputBox: {
    marginVertical: 10,
    padding: 10,
    width: width - 30,
    borderRadius: 15,
    borderWidth: 1,
    fontSize: 16,
    fontWeight: '400',
  },
  addBtn: {
    backgroundColor: 'blue',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
  },
  cardContainer: {
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: width - 40,
    padding: 20,
    borderRadius: 20,
    margin: 5,
  },
});

export default App;
