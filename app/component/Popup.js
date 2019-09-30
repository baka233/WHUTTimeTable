import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native'

const {width, height } = Dimensions.get('window');

export default class Popup extends Component {
    constructor(props) {
        super(props);
        this.state= {
            offset : new Animated.Value(0),
            show : false
        }
    }

    out() {
        Animated.timing(
            this.state.offset,
            {
                easing : Easing.liner,
                duration : 300,
                toValue : 0
            }
        ).start()
    }

    in() {
        Animated.timing(
            this.state.offset,
            {
                easing : Easing.liner,
                duration : 300,
                toValue : 1
            }
        ).start()
    }

    show() {
        this.setState({
            show : true,
        }, this.in());
    }

    hide() {
        this.out();
    }

    render() {
        let { transparentIsClick, modelBoxBg, modelBoxHeight } = this.props

        if (this.state.show) {
            return (
                <View style={[styles.container, {height : height}]}>
                    <TouchableOpacity style={{ height : height - modalBoxHeight}} onPress={transparentIsClick && this.defualtHide.bind(this)}>
                    </TouchableOpacity>
                    <Animated.View
                        style={[styles.modelBox, {
                            height : height, top: 0, backgroundColor : modelBoxBg,
                            tranform : [{
                                translateY: this.state.offset.interpolate({
                                    inputRange : [0, 1],
                                    outputRange : [height, height - modelBoxHeight]
                                }),
                            }]
                        }]}>
                            {this.props.children}
                    </Animated.View>
                </View>
            )
        }

        return <View />
    }
}

const styles = StyleSheet.create({
    container : {
        width : width,
        backgroundColor : 'rgba(0,0,0,0.6)',
        position : 'absolute',
        top : 0,
        zIndex : 9
    },
    modelBox: {
        position : 'absolute',
        width : width
    }
})

Popup.defaultProps = {
    modelBoxHeight : 300,
    modelBoxBg : '#fff',
    hide : function() {},
    transparentIsClick : true,
}
