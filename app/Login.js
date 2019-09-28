import React, { PureComponent } from 'react';
import CryptoJS from "crypto-js";
import { fetchPost } from "./util/Http";

export default class Login extends PureComponent {
    render() {
        return (
            <View> 
                
            </View>
        );
    }

    static url = "http://sso.jwc.whut.edu.cn/Certification//login.do";
    static code_url = "http://sso.jwc.whut.edu.cn/Certification//getCode.do"

    static _getCode(webfinger) {

        var headers = {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "http://sso.jwc.whut.edu.cn",
            "Pragma": "no-cache",
            "Referer": "http://sso.jwc.whut.edu.cn/Certification//login.do",
            "User-Agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BLA-AL00 Build/HUAWEIBLA-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/8.9 Mobile Safari/537.36",
            "X-Requested-With": "XMLHttpRequest"
        }
        var formData = "webfinger=" + webfinger;
        const option = {
            method: "POST",
            headers : headers,
            body : formData
        };


        console.log(option);


        console.log(this.code_url);
        return fetch(this.code_url, option)
    }

    static login(username, password, callback) {
        var _webfinger = "";
        var _charTable = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
        for (let i = 0; i < 32; i++) {
            _webfinger += _charTable[Math.floor(Math.random() * 16)];
        }
        return this._getCode(_webfinger)
            .then(
                (res) => {
                    console.log(res.status);
                    if (res.ok)
                    {
                        if (res != null && res != "") {
                            return res.text();
                        } else {
                            throw "code is empty"
                        }
                    } else {
                        throw "getCode status is error"
                    }
                }
            ).then(
                (code) => {
                    console.log("code is " + code);
                    return this._login(username, password, code, _webfinger);
                }
            ).then(
                (res) => {
                    console.log(res);
                    if (res.ok) {
                        return res.text();
                    }
                }
            ).then(
                (text) => {
                    console.log(text);
                    if (text.search("个人信息") == -1) {
                        throw err
                    }
                    // 替换文本
                    return text.replace(/(\t)+\n/g, '');
                }
            );
    }

    static _login(username, password, code, webfinger) {
        var params = {
                "MsgID":"",
                "KeyID" : "",
                "UserName" : "",
                "Password" : "",
                "rnd"      : 61141,
                "return_EncData" : "",
                "code"    : code,
                "userName1" : CryptoJS.MD5(username + "").toString(),
                "password1" : CryptoJS.SHA1(username + "" + password).toString(),
                "webfinger" : webfinger,
                "type"      : "xs",
                "userName" : username,
                "password" : password,
            },
            headers = {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Encoding": "gzip, deflate",
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Origin": "http://sso.jwc.whut.edu.cn",
                "Referer": "http://sso.jwc.whut.edu.cn/Certification//login.do",
                "User-Agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BLA-AL00 Build/HUAWEIBLA-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/8.9 Mobile Safari/537.36",
            };
    

        return fetchPost(this.url, headers, params);
    }

}

