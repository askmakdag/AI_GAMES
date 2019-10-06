import React, {Component} from 'react';
import {View, TouchableOpacity, TextInput, StyleSheet} from 'react-native';

class Cell extends Component {

    defaultCellColor = '#ECF5F5';
    selectionColor = '#B8F9D8';

    constructor(props) {
        super(props);
        this.state = {
            cellBackgroundColor: this.defaultCellColor,
        };
    };

    render() {
        const {height, width, fontSize, index, char, changeCellChar} = this.props;
        const {cellBackgroundColor} = this.state;
        /** İçeriği "X" 'e eşit olan node'ların kullanılmayacağını varsayıyoruz.*/
        const cell_background_color = char === 'X' ? '#313231' : cellBackgroundColor;

        return (
            <TouchableOpacity style={styles.textInputContainerStyle}>
                <TextInput
                    style={[styles.textInputStyle, {
                        height: height,
                        width: width,
                        backgroundColor: cell_background_color,
                        fontSize: parseInt(fontSize),
                    }]}
                    selectionColor={this.selectionColor} //change the cursor color here
                    onFocus={() => this.setState({cellBackgroundColor: this.selectionColor})}
                    onBlur={() => this.setState({cellBackgroundColor: '#ECF5F5'})}
                    autoFocus={false}
                    editable={char !== 'X'} //if char is 'X' make the cell inactive
                    defaultValue={char}
                    onChangeText={(text) => changeCellChar(index, text)}
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
        borderWidth: 0.7,
        color: '#313231',
        borderColor: '#767977',
    },
});

export default Cell;

