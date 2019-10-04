import React, {Component} from 'react';
import {View, TouchableOpacity, TextInput, StyleSheet} from 'react-native';

class Node extends Component {

    defaultCellColor = '#ECF5F5';
    selectionColor = '#B8F9D8';

    constructor(props) {
        super(props);
        this.state = {
            cellBacgroundColor: this.defaultCellColor,
        };
    };

    render() {
        const {height, width, fontSize, index, chageCellChar} = this.props;
        const {cellBacgroundColor} = this.state;
        console.log('fontSize: ', parseInt(fontSize));

        return (
            <TouchableOpacity style={[styles.textInputContainerStyle, {backgroundColor: cellBacgroundColor}]}>
                <TextInput
                    style={[styles.textInputStyle, {
                        height: height,
                        width: width,
                        backgroundColor: cellBacgroundColor,
                        fontSize: parseInt(fontSize),
                    }]}
                    selectionColor={this.selectionColor} //change the cursor color here
                    onFocus={() => this.setState({cellBacgroundColor: this.selectionColor})}
                    onBlur={() => this.setState({cellBacgroundColor: '#ECF5F5'})}
                    autoFocus={false}
                    onChangeText={(text) => chageCellChar(index, text)}
                    caretHidden={true} //make the cursor hidden
                    maxLength={1}/>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    textInputContainerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    textInputStyle: {
        flex: 1,
        textAlign: 'center',
        fontWeight: '500',
        height: '100%',
        width: '100%',
        borderWidth: 1,
        borderColor:"#767977"
    },
});

export default Node;

