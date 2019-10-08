import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, PixelRatio, Animated, Easing, Dimensions } from 'react-native'

const {width, height } = Dimensions.get('window');

export default class Popup extends Component {
    constructor(props) {
        super(props);

        this.height = PixelRatio.getPixelSizeForLayoutSize(height);
        this.width = PixelRatio.getPixelSizeForLayoutSize(width);
    }

    state= {
        offset : new Animated.Value(0),
        show : false,
        courses : [],
    }

    out() {
        Animated.timing(
            this.state.offset,
            {
                easing : Easing.liner,
                duration : 200,
                toValue : 0
            }
        ).start(() => {
            this.setState({
                show : false,
                courses : [],
            })
        });
    }

    _in() {
        Animated.timing(
            this.state.offset,
            {
                easing : Easing.liner,
                duration : 300,
                toValue : 1
            }
        ).start()
    }

    show(courses) {
        this.setState({
            show : true,
            courses : courses,
        }, this._in());
    }

    hide = () => {
        this.out();
    }

    render() {
        let { transparentIsClick, modelBoxBg, modelBoxHeight } = this.props
        

        if (this.state.show) {
            var guard = 1;
            var boxHeight = (modelBoxHeight + guard) * (this.state.courses.length + 1.5);
            console.log("boxHeight is " + boxHeight)
            return (
                <View style={styles.container}>
                    <TouchableOpacity style={{ height : height - boxHeight}} onPress={this.hide}>
                    </TouchableOpacity>
                    <Animated.View
                        style={[{
                            width : width,
                            height : boxHeight, backgroundColor : modelBoxBg,
                            borderRadius : 10,
                            transform : [{
                                translateY: this.state.offset.interpolate({
                                    inputRange : [0, 1],
                                    outputRange : [boxHeight, 0]
                                }),
                            }]
                        }]}
                    >
                        {this.renderAllCourses()}
                    </Animated.View>
 
               </View>
            )
        }
        return <View />
    }




    renderAllCourses() {
        if (this.state.courses != undefined) {
            let {modelBoxHeight} = this.props;
            var guard = parseInt(modelBoxHeight / 10);

            var courses = this.state.courses;
            var courseRender = [];

            var flag = false;

            console.log("length is " + courses.length);
            for (let i = 0; i < courses.length; i++) {
                var renderedItem = styles.renderedItem
                var appendStr = "";
                var textColor = "black";
        
                if (!flag) {
                    var weeks = courses[i].weeks;
                    for (let j = 0; j < weeks.length; j++) {
                        if (weeks[j].start <= this.props.thisWeek && weeks[j].end >= this.props.thisWeek) {
                            flag = true;
                            appendStr = "(本周)";
                            textColor = "#33ccff";
                        }
                    }
                }

                courseRender.push(
                    <TouchableOpacity key={"a" + i} onPress={() => {this.props.showCourseInfo(courses[i])}} style={[styles.renderedItem, {height : modelBoxHeight}]}>
                        <Text style={{color : textColor}}>{courses[i].coursename + appendStr}</Text>
                    </TouchableOpacity>
                )
                courseRender.push(
                    <View key={"b"+i} style={{height : 1, backgroundColor : "#E4E2EA"}}>
                    </View>
                )
            }
            courseRender.push(
               <TouchableOpacity key={"c"} style={[styles.renderedItem, {height : modelBoxHeight}]}
                    onPress={this.hide}
                >
                   <Text style={{color : "red"}}>关闭</Text>
               </TouchableOpacity>
            );
            return courseRender;
        }
    }
}


const styles = StyleSheet.create({
    container : {
        position : 'absolute',
        width : width,
        height : height,
        backgroundColor : 'rgba(0,0,0,0.5)',
        top : 0,
        left : 0,
        elevation : 100,
    },
    modelBox: {
        width : width
    },
    renderedItem : {
        alignItems : "center",
        justifyContent : "center",
        flexShrink : 1,
    },
})

Popup.defaultProps = {
    modelBoxHeight : 300,
    modelBoxBg : '#fff',
    hide : function() {},
    transparentIsClick : true,
}
