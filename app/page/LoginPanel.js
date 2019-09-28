import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
} from 'react-native';



export default class LoginPanel extends Component {
    render() {
        return (
            <View style={ styles.loginContainer}>
                <TextInput style={styles.userNamePanel} autoComplete="username" onChangeText = { (text) => this.props.setUserName(text)} placeholder="学号" />
                <TextInput style={styles.passWordPanel} autoComplete="password" secureTextEntry onChangeText = { (text) => this.props.setPassword(text)} placeholder="密码" />
                <Button style={styles.submitButton} onPress={this.props.login} title="     登录     " />
            </View>
        )
    }
}


styles=StyleSheet.create({
    loginContainer : {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    userNamePanel : {
        margin : 10,
        width : 250,
        paddingHorizontal : 30,
        borderWidth : 1,
        borderColor : "#e0e0eb",
        borderRadius : 20
    },
    passWordPanel : {
        margin : 10,
        width : 250,
        paddingHorizontal : 30,
        borderWidth : 1,
        borderColor : "#e0e0eb",
        borderRadius : 20
    },
    submitButton : {
        width : 100,
        borderRadius : 10,
        color : "blue"
    }
})
