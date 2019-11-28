import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';

class ColorDisplayComponent extends Component {

    yellow_color = '#F7F1B4'; // 2 puan
    purple_color = '#EFE1FE'; // 3 puan
    blue_color = '#D0F2F9';   // 4 puan
    font_size = 20;

    render() {
        return (
            <View style={styles.colorDisplayContainer}>
                <View style={[styles.colorCellStyle, {
                    borderColor: '#FFF',
                    backgroundColor: '#FFF',
                }]}/>
                <Text style={{fontSize: this.font_size}}> X1</Text>

                <View style={[styles.colorCellStyle, {
                    borderColor: this.yellow_color,
                    backgroundColor: this.yellow_color,
                    marginLeft: '10%',
                }]}/>
                <Text style={{fontSize: this.font_size}}> X2</Text>

                <View style={[styles.colorCellStyle, {
                    borderColor: this.purple_color,
                    backgroundColor: this.purple_color,
                    marginLeft: '10%',
                }]}/>
                <Text style={{fontSize: this.font_size}}> X3</Text>

                <View style={[styles.colorCellStyle, {
                    borderColor: this.blue_color,
                    backgroundColor: this.blue_color,
                    marginLeft: '10%',
                }]}/>
                <Text style={{fontSize: this.font_size}}> X4</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    colorDisplayContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingBottom: 10,
        width: '100%',
        height: 30,
        backgroundColor: '#D2AB6F',
    },
    colorCellStyle: {
        borderWidth: 1,
        height: 25,
        width: 25,
    },
});

export default ColorDisplayComponent;

