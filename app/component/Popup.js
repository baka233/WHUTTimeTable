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
            var guard = parseInt(modelBoxHeight / 10);
            var boxHeight = (modelBoxHeight + guard) * (this.state.courses.length + 1) ;
            console.log("boxHeight is " + boxHeight)
            return (
                <View style={styles.container}>
                    <TouchableOpacity style={{ height : height - boxHeight}} onPress={this.hide}>
                    </TouchableOpacity>
                    <Animated.View
                        style={[{
                            width : width,
                            height : boxHeight, backgroundColor : modelBoxBg,
                            border : 3, borderRadius : 10,
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


            console.log("length is " + courses.length);
            for (let i = 0; i < courses.length; i++) {
                courseRender.push(
                    <TouchableOpacity key={"a" + i} style={[styles.renderedItem, {height : modelBoxHeight}]}>
                        <Text>{courses[i].coursename}</Text>
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
    }
})

Popup.defaultProps = {
    modelBoxHeight : 300,
    modelBoxBg : '#fff',
    hide : function() {},
    transparentIsClick : true,
}
