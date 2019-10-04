import React, { Component } from 'react';
import Popup from './Popup';
import {
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
} from 'react-native';

class TableType {
    static get Small() {
        return "small";
    }

    static get Big() {
        return "big";
    }
}

class TableCell extends Component {
    constructor(props) {
        super(props)
        this.hasNoCourse = true;
    }

    courseData = null;


    render() {
        this.courseData = this.getCourse();
        return (
            <View style={this.getStyle()}>
                {this.renderCourse()}
                {this.renderEmpty()}
            </View>
        )
    }

    _showCourses = () => {
        this.props.showCourses(this.props.course);
    }


    renderCourse() {
        if (this.courseData != undefined) {
            var color = this.hasNoCourse ? "#84828A" : "white";
            return (
                <View style={this.getCourseStyle()}>
                    <TouchableOpacity style={{flex:1}} onPress={this._showCourses}>
                        <View style={{flex : 1}}>
                            <View style={styles.courseNameContainer} >
                                <Text style={[styles.courseName, {color : color}]}>
                                    { this.getCourseName() }
                                </Text>
                            </View>
                            <View style={styles.classRoomContainer} >
                                <Text style={[styles.classRoom, {color : color}]}>
                                    { this.getClassRoom() }
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    isSmallSection() {
        if (this.courseData != null)
            console.log("time length is " + (this.courseData.endTime - this.courseData.startTime + 1));
        if (this.courseData != null && (this.courseData.endTime - this.courseData.startTime + 1) == 2 && this.props.type == TableType.Big) {
            console.log(JSON.stringify(this.courseData) + " is small course");    
            return true;
        }
        return false;
    }

    renderEmpty() {
        if (this.props.type != undefined) {
            if (this.courseData == undefined
                || this.isSmallSection())
            {
                var emptyStyle = [styles.emptyCell,];

                if (this.courseData == undefined) {
                    emptyStyle.push(styles.emptyColor);
                    emptyStyle.push(styles.tableBoarder);
                }

                return (
                    <View style={emptyStyle}>
                    </View>
                )
            }
        }
    }

    getCourseStyle() {
        if (this.courseData != undefined) {
            let style = [];
            const dayColorStyle = [
                styles.dayOneColor, styles.dayTwoColor,
                styles.dayThreeColor, styles.dayFourColor,
                styles.dayFiveColor, styles.daySixColor,
                styles.daySevenColor
            ];
            if (this.props.type == TableType.Small) {
                style.push(styles.courseSmallCell);
            } else {
                style.push(styles.courseBigCell);
            }
            if (this.hasNoCourse)
                style.push(styles.emptyColor);
            else
                style.push(dayColorStyle[this.props.day])
            style.push(styles.tableBoarder)
            return style;
        }
    }

    getStyle() {
        if (this.props.type != undefined && this.props.type == TableType.Small)
            return styles.smallCell;
        else
            return styles.bigCell;
    }

    getCourse() {
        const week = this.props.week;
        console.log("week is " +  week);
        if (this.props.course != undefined && this.props.course.length != 0) {
            for (let i = 0; i < this.props.course.length; i++) {
                let each_course = this.props.course[i];
                for (let j = 0; j < each_course.weeks.length; j++) {
                    if (each_course.weeks[j].start <= week && each_course.weeks[j].end >= week)
                    {
                        this.hasNoCourse = false;
                        return each_course;
                    }
                }
            }
            return this.props.course[0];
        }
        return null;
    }

    getCourseName() {
        var _course = this.courseData;
        if (_course == null) {
            return "";
        } else {
            console.log(_course.coursename);
            return _course.coursename;
        }
    }

    getClassRoom() {
        var _course = this.courseData;
        if (_course == null) {
            return "";
        } else {
            console.log(_course.classroom)
            return _course.classroom;
        }
    }

}




export default class CourseTable extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={ styles.main }>
                <View style={styles.sectionGuide}>
                    <View style={styles.emptyItem}>
                    </View>
                    <View style={styles.bigSection}>
                        <Text> 上 </Text>
                        <Text> 午 </Text>
                    </View>
                    <View style={styles.bigSection}>
                        <Text> 下 </Text>
                        <Text> 午 </Text>
                    </View>
                    <View style={styles.nightSection}>
                        <Text> 晚 </Text>
                        <Text> 上 </Text>
                    </View>
                </View>

                <View style={ styles.tableMainTables } >
                    <View style={styles.tableRows}>
                        <ScrollView style={styles.tableScrollRows}
                                    contentContainerStyle={styles.tableScrollRowsInnerContainer}
                                    horizontal={true}>
                            { this.renderAllCell() }
                        </ScrollView>
                    </View>
                </View >
            </View >
        )
    }

    getDate() {
        var itemArr = [];
        var tmpDay = new Date();
        tmpDay.setTime(this.props.startDay);
        console.log("tmpDay is " + this.props.startDay);
        for (let i = 0; i < 7; i++) {
            itemArr.push((tmpDay.getMonth() + 1) + "-" + (tmpDay.getDate()));
            let timestamp = tmpDay.getTime();
            tmpDay.setTime(timestamp + 1000 * 3600 * 24);
        }
        return itemArr;
    }


    renderAllCell() {
        var itemArr = [];
        var day = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
        var date = this.getDate();
        

        for (let i = 0; i < 7; i++) {
            let dayItem = [];
            let dayMsg = [];
            var dayCourses;
            if (this.props.tableData != null)
                dayCourses = this.props.tableData[i];
            var row = [];

            for (let j = 0; j < 5; j++) {
                var course = [];
                if (dayCourses != null && dayCourses.length > j)
                    course = dayCourses[j];
                if (j == 0 || j == 3) {
                    row.push(
                        <TableCell 
                            key={i*5 + j}
                            type={TableType.Small}
                            week={this.props.week}
                            day={i}
                            course={course} 
                            showCourses={this.props.showPopup}
                        />
                    )
                } else {
                    row.push(
                        <TableCell  
                            key={i*5 + j}
                            type={TableType.Big}
                            week={this.props.week}
                            day={i}
                            course={course}
                            showCourses={this.props.showPopup}
                        />
                    )
                }
            }


            dayItem.push(styles.dayItem);
            dayMsg.push(styles.dayMsg);
            if (i == this.props.day) {
                dayItem.push(styles.currentDay);
                dayMsg.push(styles.dayMsgWhite);
            }


            itemArr.push(
                <View key={"day " + i} style={styles.tableRow}>
                    <View key={ "day" + (i+1)}
                          style={dayItem}
                    >
                        <Text style={dayMsg}>
                            {day[i]}
                        </Text>
                        <Text style={dayMsg}>
                            {date[i]}
                        </Text>
                    </View>

                    {row}
                </View>
            );
        }
        return itemArr;
    }
}


const styles = StyleSheet.create({
    main : {
        flex : 1,    
        flexDirection : "row"
    },
    tableBoarder: {
        borderWidth : 1,
        borderColor : "white",
        borderRadius : 5,
        overflow: 'hidden'
    },
    courseSmallCell : {
        flex : 1,
        padding : 5,
        backgroundColor : "#4F94CD",
    },
    courseBigCell : {
        flex : 2,
        padding : 5,
        backgroundColor : "#4F94CD",
    },
    emptyCell : {
        flex : 1,
    }, 
    smallCell : {
        flex : 2,
    },
    bigCell : {
        flex : 3,
    },
    title : {
        flex : 1,
        backgroundColor : "white",
        flexDirection : "row"
    },
    tableMainTables : {
        flex : 13,
        flexDirection : "row",
    },
    tableRows : {
        flex : 14,
    },
    tableRow : {
        flex : 4,
    },
    sectionGuide : {
        flex :1,
        backgroundColor : "white",
    },
    courseNameContainer : {
        flex : 7,
    },
    classRoomContainer : {
        flex : 3,
    },
    courseName : {
        fontSize : 11
    },
    classRoom : {
        fontSize : 9 
    }, 
    emptyItem : {
        flex : 1, 
    },
    dayContainer : {
        flex : 14,
        flexDirection : "row"
    },
    dayItem : {
        flex : 1,
        alignItems : "center",     
        backgroundColor : "white"
    },
    dayMsg : {
        color : "#969696",
    },
    dayMsgWhite : {
        color : "white",
    },
    bigSection : {
        flex : 5,
        justifyContent : "center",
        alignItems : "center",
    },
    nightSection : {
        flex : 3,
        justifyContent : "center",
        alignItems : "center",
    },
    tableScrollRows :{
        flexDirection : "row",
    },
    tableScrollRowsInnerContainer : {
        width : 460,
        flexGrow : 1,
    },
    currentDay : {
        backgroundColor : "#00e5e6"
    },
    dayOneColor : {
        backgroundColor : "#33A2FF"
    },
    dayTwoColor : {
        backgroundColor : "#333FFF"
    },
    dayThreeColor : {
        backgroundColor : "#9633FF"
    },
    dayFourColor : {
        backgroundColor : "#FF33BE"
    },
    dayFiveColor : {
        backgroundColor : "#FF3390"
    },
    daySixColor : {
        backgroundColor : "#FFA533"
    },
    daySevenColor : {
        backgroundColor : "#FF7433"
    },
    emptyColor : {
        backgroundColor : '#E4E2EA',
    }
});
