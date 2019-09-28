import React, { Component } from 'react';
import Login from './app/Login';
import { processCourse } from './app/Process';
import MainPanel from './app/page/MainPanel';
import LoginPanel from './app/page/LoginPanel';
import CookieManger from 'react-native-cookies';
import Loading from './app/util/Loading'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  AsyncStorage,
  Button,
} from 'react-native';
import Toast from 'react-native-root-toast';


export default class HelloWorldApp extends Component {
    constructor(props) {
        super(props);
        console.log(this.userInfo)
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


    userInfo = {
        username : "",
        password : ""
    };


    state = {
        isReceivedTableData : false,
        isReceivedUserInfo : false,
        isLogin : false,
    };

    reqState = {
        SUCCESS : 1,
        FAILED  : 0,
    }

    _getStorageData = async() => {
        var tableList = await AsyncStorage.getItem('tableList');
        if (tableList == null)
            return false;
        this.tableList = JSON.parse(tableList);
        console.log("getData successful");
        console.log(this.tableList);
        return true;
    };

    logout = () => {
        console.log("logout ");
        this.setState((previousState) => (
            { isLogin : false }
        ));
        this.userInfo.username = "";
        this.userInfo.password = "";
    }

    fresh = () => {
        AsyncStorage.removeItem("tableList")
            .then(
                (res) => {
                    return Login.login(this.userInfo.username, this.userInfo.password);
                } 
            ).then(
                (text) => {
                    this.getData(text);
                    Toast.show("刷新成功", {
                        duration : Toast.durations.LONG,
                        position : Toast.positions.BUTTOM,
                        shadow : true,
                        animation : true,
                        hideOnPress : true,
                        delay : 0,
                        onShow: () => {
                            
                        },
                        onShown: () => {

                        },
                        onHide: () => {

                        },
                        onHidden: () => {

                        }
                    })

                }
            )
    }

    render() {
        CookieManger.clearAll();
        if (!this.state.isReceivedUserInfo) 
        {
            console.log("didn't receive userInfo");
            return (
                <View>
                </View>
            )
        } 
        else if (this.state.isReceivedTableData && this.state.isLogin)
        {
            console.log("start render");
            return (
                <MainPanel 
                    fresh={this.fresh}
                    logout={this.logout}
                    tableList={this.tableList} startDay={"2019-08-25"}/>
            );
        } 
        else if (this.userInfo.username == "" && this.userInfo.password == "")
        {
            console.log("username and password empty");
            return (
                <View style={styles.welcomeContainer}>
                    <LoginPanel setUserName={(text) => { this.userInfo.username = text}}
                                setPassword={(text) => { this.userInfo.password = text}}
                                logout={this.logout}
                                login={() => {this._loginPrepare(true)}}
                    />
                    <Loading> </Loading>
                </View>
            )
        }
        else {
            console.log("has received loginfo")
            console.log("userinfo is " + JSON.stringify(this.userInfo));
            this._loginPrepare(false);
            return (
                <View>
                </View>
            );
        }
    }

    getData(text) {
        processCourse(text, this.tableList);
        console.log(this.tableList);
        AsyncStorage.setItem("userInfo", JSON.stringify(this.userInfo));
        AsyncStorage.setItem("tableList", JSON.stringify(this.tableList));
        console.log("storage tableList and userInfo successfully");
        this.setState((previousState) => ({ 
            isReceivedTableData : true,
            isLogin : true,
        }));
    }

    _loginPrepare(isUserLogin) {
        this._getStorageData()
            .then(
                (res) => {
                    if (!res) {
                        if (isUserLogin)
                            Loading.show();
                        console.log("state is " + JSON.stringify(this.state))
                        console.log("login username and password is " +  this.userInfo.username + " " + this.userInfo.password);
                        return Login.login(this.userInfo.username, this.userInfo.password);
                    } else {
                        this.setState((previousState) => ({ 
                            isReceivedTableData : true,
                            isLogin : true, 
                        }));
                        console.log("get data successful and use this data");
                        return Promise.reject(this.reqState.SUCCESS)
                    }
                }
            ).then(
                (text) => {
                    if (isUserLogin)
                        Loading.hide();
                    this.getData(text);
                }
            ).catch(
                (err) => {
                    console.log("err is " + err);
                    if (isUserLogin)
                        Loading.hide();
                    if (err != this.reqState.SUCCESS)
                    {
                        Toast.show("登录失败，请确认账号密码是否正确", {
                            duration : Toast.durations.LONG,
                            position : Toast.positions.BUTTOM,
                            shadow : true,
                            animation : true,
                            hideOnPress : true,
                            delay : 0,
                            onShow: () => {
                                
                            },
                            onShown: () => {

                            },
                            onHide: () => {

                            },
                            onHidden: () => {

                            }
                        })
                    }
                }
            )
        return true;
    }

    _getUserInfo = async() => {
        try {
            var userInfo = await AsyncStorage.getItem("userInfo");
            if (userInfo != undefined) {
                this.userInfo = JSON.parse(userInfo);
            }
            console.log("userInfo is ");
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
