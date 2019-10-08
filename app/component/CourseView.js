import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    AsyncStorage,
    TouchableOpacity,
    View,
    Dimensions,
} from 'react-native';

const {width, height } = Dimensions.get('window');



export default class CourseView extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        show : false,
        course : null,
    }
    
    hide = () => {
        this.setState({
            show : false
        });
    }

    show = (course) => {
        this.setState({
            show : true,
            course : course
        });
    }

    getWeeks() {
        if (this.state.course != undefined) {
            var course = this.state.course;
            // 获取周数的数组的拷贝，因为不会修改对象，所以不需要对对象进行深拷贝
            var weeks = course.weeks.slice(0);
            var str = "第"

            if (weeks.length <= 0)
                return "";

            weeks.sort((firstElement, secondElement) => {
                if (firstElement.start < secondElement.start)
                    return -1;
                return 1;
            });
            for (let i = 0; i < weeks.length - 1; i++) {
                str += weeks[i].start + "-" + weeks[i].end + ",";
            }
            str += weeks[weeks.length - 1].start + "-" + weeks[weeks.length - 1].end + "周";
            return str;
        }
    }

    getTime() {
        var startTime = ["8:00", "8:50", "9:55", "10:45", "11:35", "14:00", "14:50", "15:40", "16:45", "17:35", "19:00", "19:50", "20:40"];
        var endTime   = ["8:45", "9:35", "10:40", "11:30", "12:20", "14:45", "15:35", "16:25", "17:30", "18:20", "19:45", "20:35", "21:25"];

        if (this.state.course != undefined) {
            var course = this.state.course;
            var str = "";

            str = str + startTime[course.startTime -1] + " - " + endTime[course.endTime - 1];
            return str;
        }
    }


    render() {
        if (this.state.show) {
            var left = parseInt(width / 6);
            var top = parseInt(height / 5);
            var courseInfoWidth = parseInt(width / 3 * 2);
            var courseInfoHeight = parseInt(height / 5 * 3);
            return (
                <View style={styles.container}>
                    <TouchableOpacity style={styles.opacityArea} onPress={this.hide}>
                    </TouchableOpacity>
                    <View style={[
                        styles.courseInfoArea,
                        {
                            backgroundColor : "white",
                            height : courseInfoHeight,
                            width : courseInfoWidth,
                            left : left,
                            top : top
                        }
                    ]}>
                        <View style={styles.titleBar}>
                            <Text style={{color : "white"}}>{this.state.course.coursename}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <View style={{flex : 1 }}>
                                <Text style={styles.description}>授课老师</Text>
                            </View>
                            <View style={{flex : 2 }}>
                                <Text style={styles.detail}>{this.state.course.teacher}</Text>
                            </View>
                        </View>
                        <View style={styles.infoItem}>
                            <View style={{flex : 1 }}>
                                <Text style={styles.description}>授课周数</Text>
                            </View>
                            <View style={{flex : 2 }}>
                                <Text style={styles.detail}>{this.getWeeks()}</Text>
                            </View>
                        </View>
                        <View style={styles.infoItem}>
                            <View style={{flex : 1 }}>
                                <Text style={styles.description}>授课地点</Text>
                            </View>
                            <View style={{flex : 2 }}>
                                <Text style={styles.detail}>{this.state.course.classroom}</Text>
                            </View>
                        </View>
                        <View style={styles.infoItem}>
                            <View style={{flex : 1 }}>
                                <Text style={styles.description}>授课时间</Text>
                            </View>
                            <View style={{flex : 2}}>
                                <Text style={styles.detail}>{this.getTime()}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )
        }
        return <View/>
    }
}


const styles = StyleSheet.create({
    container : {
        position : 'absolute',
        width : width,
        height : height,
        backgroundColor : 'rgba(0,0,0,0.7)',
        elevation : 100,
    },
    opacityArea : {
        position : 'absolute',
        width : width,
        height : height,
        elevation : 101,
    },
    courseInfoArea : {
        position : 'absolute',
        borderRadius : 5
    },
    titleBar : {
        backgroundColor : "#2233FF",
        justifyContent : "center",
        alignItems : "center",
        borderTopLeftRadius : 5,
        borderTopRightRadius : 5,
        flex :3 
    },
    infoItem : {
        flex : 3,
        justifyContent : "center",
        padding : 10
    },
    description : {
        fontSize : 12,
        color : "#969696",
    },
    detail : {
        fontSize : 16
    }
});
