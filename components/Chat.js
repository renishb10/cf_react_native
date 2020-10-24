import React from 'react';
import { View, Text} from 'react-native';

import { GiftedChat, Bubble , InputToolbar } from 'react-native-gifted-chat'

const firebase = require('firebase');
require('firebase/firestore');

import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      isConnected: false,
      messages: [],
    }

    //Firebase
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyAkEM4nWe8JIsXnxXYq4ioxO6V7X5dvlfk",
      authDomain: "cf-chat-app-71483.firebaseapp.com",
      databaseURL: "https://cf-chat-app-71483.firebaseio.com",
      projectId: "cf-chat-app-71483",
      storageBucket: "cf-chat-app-71483.appspot.com",
      messagingSenderId: "265983189937",
      appId: "1:265983189937:web:2de4015310b087f3495390"
    };
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      this.referenceChatMessages = firebase.firestore().collection("messages");
    }
  }

  // Localstorage methods
  addMessage(messages) {
    console.log(messages)
    this.referenceChatMessages.add(messages[0]);
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }  

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      }); 
    });
    this.setState({
      messages,
    });
  };

  onSend(messages = []) {
    this.addMessage(messages)
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.saveMessages();
    })
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }  

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }  

  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }  
  }
  

  componentDidMount() {
    // NetInfo
    NetInfo.fetch().then(async connection => {
      if (connection.isConnected) {
        this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate)

        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
        
          //update user state with currently active user data
          this.setState({
            uid: user.uid,
            messages: [],
            isConnected: true,
          });
          
          this.unsubscribe = this.referenceChatMessages
           .orderBy("createdAt", "desc")
           .onSnapshot(this.onCollectionUpdate);
        });
        console.log('online');
      } else {
        this.setState({
          messages: [],
          isConnected: false,
        });
        await this.getMessages();

        console.log('offline');
      }
    });
  } 

  componentWillUnmount() {
    if (this.state.isConnected) {
      this.unsubscribe();
    }
  }

  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    return (
      <GiftedChat
        renderBubble={this.renderBubble.bind(this)}
        renderInputToolbar={this.renderInputToolbar.bind(this)}
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    )
  }
}
