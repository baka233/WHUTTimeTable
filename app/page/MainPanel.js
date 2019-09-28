import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    AsyncStorage,
    View,
} from 'react-native';
import CourseTable from '../component/CourseTable.js'
import FreshIcon from '../../static/img/fresh.svg'
import ListIcon from '../../static/img/list.svg'




export default class MainPanel extends Component {
    constructor(props) {
        super(props)
        var day = new Date();

        var timezone = "+08:00";
        var startDayTimestamp = new Date(this.props.startDay + "T00:00:00" + timezone);
        this.state.week =  parseInt((day - startDayTimestamp) / (1000 * 3600 * 24 * 7));
        console.log("week is" + this.state.week);

        this.firstDay = day.getTime() - 1000 * 3600 * 24 * ((day.getDay() + 6) % 7);

        this.day = (day.getDay() + 6) % 7;


    }

    clearData() {
        console.log("start clear data");
        AsyncStorage.removeItem("tableList");
        AsyncStorage.removeItem("userInfo");
    }

    day=0;
    

    state= {
        week : 0
    };

    render() {
        console.log("first is " + this.firstDay);
        return (
            <View style={ styles.main }>
                <View style={ styles.titleBar } >
                    <View style={styles.returnBlock}>
                    </View>
                    <View style={styles.titleBlock}>
                        <Text style={ styles.titleMsg } >
                            我的课表
                        </Text>
                    </View>
                    <View style={styles.etcBlock}>
                        <FreshIcon onPress={this.clearData} height={20} width={40} />
                        <ListIcon onPress={this.clearData} height={20} width={40} />

                    </View>
                </View>
                <View style={ styles.tableMain } >
                    <CourseTable tableData={this.props.tableList } week={this.state.week} startDay={this.firstDay} day={this.day}/>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    main : {
        flex : 1,
    },
    titleBar : {
        flex : 1,
        flexDirection : 'row',
        backgroundColor : "white",
    },
    tableMain : {
        flex : 11,
    },
    returnBlock : {
        flex : 2,
    },
    titleBlock : {
        flex : 5,
        justifyContent : "center",
        alignItems : "center",
    },
    etcBlock : {
        flex : 2,
        padding : 10,
        flexDirection : "row",
        justifyContent : "center",
        alignItems : "center",
    },
    titleMsg : {
        fontSize : 18,
    }

})
