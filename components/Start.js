import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Button, ImageBackground } from 'react-native';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        name:""
    };
  }

  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>ChatApp</Text>
        <View style={styles.inputView} >
          <TextInput  
            style={styles.inputText}
            placeholder="Name..." 
            placeholderTextColor="#003f5c"
            onChangeText={text => this.setState({name:text})}/>
        </View>
        <TouchableOpacity 
            style={styles.chatBtn}
            onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name })}
            accessibilityLabel="Start Chart"
            accessibilityHint="Let’s give a name and start chatting"
            accessibilityRole="button">
          <Text style={styles.chatText}>Chat</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#003f5c',
        alignItems: 'center',
        justifyContent: 'center',
      },
      logo:{
        fontWeight:"bold",
        fontSize:50,
        color:"#fb5b5a",
        marginBottom:40
      },
      inputView:{
        width:"80%",
        backgroundColor:"#465881",
        borderRadius:25,
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20
      },
      inputText:{
        height:50,
        color:"white"
      },
      chatBtn:{
        width:"80%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
      },
      chatText:{
        color:"white"
      }
});