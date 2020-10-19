import React from 'react';
import { View, Text} from 'react-native';

import { GiftedChat, Bubble } from 'react-native-gifted-chat'

const firebase = require('firebase');
require('firebase/firestore');


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
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

  addMessage(messages) {
    console.log(messages)
    this.referenceChatMessages.add(messages[0]);
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
    }))
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

  componentDidMount() {
    this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate)

    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
    
      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        messages: [],
      });
      
      this.unsubscribe = this.referenceChatMessages
       .orderBy("createdAt", "desc")
       .onSnapshot(this.onCollectionUpdate);
    });
  } 

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    return (
      <GiftedChat
        renderBubble={this.renderBubble.bind(this)}
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    )
  }
}
