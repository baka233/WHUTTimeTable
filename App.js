import React, { Component } from 'react';
import Login from './app/Login';
import { processCourse } from './app/Process';
import MainPanel from './app/page/MainPanel';
import CookieManger from 'react-native-cookies';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  AsyncStorage,
  Button,
} from 'react-native';


export default class HelloWorldApp extends Component {
    constructor(props) {
        super(props);
        this.userInfo = {
            username : "",
            password : ""
        };
        this._getUserInfo();
        this.tableList = new Array(7);
        for (let i = 0; i < this.tableList.length; i++) {
            this.tableList[i] = new Array(5);
            for (let j = 0; j < this.tableList[i].length; j++) {
                this.tableList[i][j] = [];
            }
        }
        console.log("1. table is " + JSON.stringify(this.tableList));
    }


    state = {
        isReceivedTableData : false,
        isReceivedUserInfo : false
    };

    _getStorageData = async() => {
        var tableList = await AsyncStorage.getItem('tableList');
        if (tableList == null)
            return false;
        this.tableList = JSON.parse(tableList);
        console.log("getData successful");
        console.log(this.tableList);
        return true;
    };

    render() {
        CookieManger.clearAll();
        if (!this.state.isReceivedUserInfo
            ||this.state.isReceivedTableData 
            || (this.userInfo.username != "" 
            && this.userInfo.password != ""
            && this._loginPrepare()))
        {
            console.log("start render");
            return (
                <MainPanel tableList={this.tableList} startDay={"2019-08-25"}/>
            );
        } 
        else 
        {
            console.log("username and password empty");
            return (
                <View style={ styles.loginContainer}>
                    <TextInput style={styles.userNamePanel} autoComplete="username" onChangeText = { (text) => this.userInfo.username = text} placeholder="please input your username" />
                    <TextInput style={styles.passWordPanel} autoComplete="password" secureTextEntry onChangeText = { (text) => this.userInfo.password = text} placeholder="please input your password" />
                    <Button style={styles.submitButton} onPress={() => {this._loginPrepare()}} title="登录" />
                </View>
            )
        }
    }

    getData(text) {
        processCourse(text, this.tableList);
        console.log(this.tableList);
        AsyncStorage.setItem("userInfo", JSON.stringify(this.userInfo));
        AsyncStorage.setItem("tableList", JSON.stringify(this.tableList));
        console.log("storage tableList and userInfo successfully");
        this.setState((previousState) => (
            { isReceivedTableData : true }
        ));
    }

    _loginPrepare() {
        this._getStorageData()
            .then(
                (res) => {
                    if (!res) {
                        return Login.login(this.userInfo.username, this.userInfo.password);
                    } else {
                        this.setState((previousState) => (
                            { isReceivedTableData : true }
                        ));
                        console.log("get data successful and use this data");
                        return Promise.reject("get data successfully")
                    }
                }
            ).then(
                (text) => {
                    this.getData(text);
                }
            ).catch(
                (err) => {
                    console.log(err);
                }
            )
        return true;
    }

    _getUserInfo = async() => {
        try {
            var userInfo = await AsyncStorage.getItem("userInfo");
            if (userInfo != undefined) {
                this.userInfo = userInfo;
            }
            console.log("userInfo is " + JSON.stringify(userInfo));
            this.setState((previousState) => (
                { isReceivedUserInfo : true }
            ));
        } catch(err) {
            this.setState((previousState) => (
                { isReceivedUserInfo : true }
            ));
            console.log("get userInfo failed");
        }
    };

    _clearUserInfo() {
        AsyncStorage.clear((err) => {
            if (err) {
                console.log("clear information error!");
            }
        })
    }


}

const styles = StyleSheet.create({
    welcomeContainer : {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center"
    },
    loginContainer : {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    userNamePanel : {
        
    },
    passWrodPanel : {

    },
    submitButton : {

    }
});
