import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';


class TableCell extends Component {
    constructor(props) {
        super(props)
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

    renderCourse() {
        if (this.courseData != undefined) {
            return (
                <View style={this.getCourseStyle()}>
                    <View style={styles.courseNameContainer} >
                        <Text style={styles.courseName}>
                            { this.getCourseName() }
                        </Text>
                    </View>
                    <View style={styles.classRoomContainer} >
                        <Text style={styles.classRoom}>
                            { this.getClassRoom() }
                        </Text>
                    </View>
                </View>
            )
        }
    }

    isSmallSection() {
        if (this.courseData == null && this.courseData.endTime - this.courseData.startTime == 2
            && this.props.type == "big")
            return true;
        return false;
    }

    renderEmpty() {
        if (this.props.type != undefined) {
            if (this.courseData == undefined
                || this.isSmallSection())
                return (
                    <View style={styles.emptyCell}>
                    </View>
                )
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
            if (this.courseData.endTime - this.courseData.startTime == 2) {
                style.push(styles.smallCell);
            } else {
                style.push(styles.bigCell);
            }
            style.push(dayColorStyle[this.props.day])
            return style;
        }
    }

    getStyle() {
        if (this.props.type != undefined && this.props.type == "small")
            return styles.courseSmallCell;
        else
            return styles.courseBigCell;
    }

    getCourse() {
        var week = 4;
        if (this.props.course != undefined && this.props.course.length != 0) {
            for (let i = 0; i < this.props.course.length; i++) {
                let each_course = this.props.course[i];
                for (let j = 0; j < each_course.weeks.length; j++) {
                    if (each_course.weeks[j].start <= week && each_course.weeks[j].end >= week)
                    {
                        return each_course;
                    }
                }
            }
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
                            type="small"
                            day={i}
                            course={course} 
                        >
                        </TableCell>
                    )
                } else {
                    row.push(
                        <TableCell  
                            key={i*5 + j}
                            type="big"
                            day={i}
                            course={course}
                        >
                        </TableCell>
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

    smallCell : {
        flex : 1,
        padding : 8,
        backgroundColor : "#4F94CD",
    },
    bigCell : {
        flex : 2,
        padding : 8,
        backgroundColor : "#4F94CD",
    },
    emptyCell : {
        flex : 1,
    }, 
    courseSmallCell : {
        flex : 2,
        borderWidth : 1,
        borderColor : "white",
        backgroundColor : '#E4E2EA',
        borderRadius : 5,
        overflow : "hidden"
           
    },
    courseBigCell : {
        flex : 3,
        borderWidth : 1,
        borderColor : "white",
        backgroundColor : '#E4E2EA',
        borderRadius : 5,
        overflow: 'hidden'
       
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
        flex : 6,
    },
    classRoomContainer : {
        flex : 4,
    },
    courseName : {
        color : "white",
        fontSize : 11
    },
    classRoom : {
        color : "white",
        fontSize : 11
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
    }
});
