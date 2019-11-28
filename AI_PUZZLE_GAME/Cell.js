import React, {Component} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

class Cell extends Component {

    defaultCellColor = '#fff';
    selectedColor = '#E6BF83';
    selectionColor = '#B8F9D8';

    yellow_color = '#F7F1B4'; // 2 puan
    purple_color = '#EFE1FE'; // 3 puan
    blue_color = '#D0F2F9';   // 4 puan

    constructor(props) {
        super(props);
        this.state = {
            cellBackgroundColor: this.defaultCellColor,
            char: this.props.char,
        };
    };

    onChangeText = (index, text) => {
        const {cellItem} = this.props;

        let last_modified_index = cellItem.last_modified_index;
        let start_new_word = cellItem.start_new_word;
        let row_or_column = cellItem.row_or_column;
        let table_size = cellItem.size;

        /** Yanlış bir lokasyona harf girişi yapılması durumu tespiti...*/
        if ((
                ((row_or_column === 'row' && last_modified_index !== (index - 1)) ||
                    (row_or_column === 'column' && last_modified_index !== (index - table_size))) && (cellItem.last_modified_index !== index)
            ) &&
            !start_new_word
        ) {
            if (cellItem.last_modified_index !== index) {
                this.setState({char: text});
                this.props.changeCellChar(index, text);
            } else {
                alert('Kural dışı yazım!');
                /** Yanlış bir lokasyona harf girişi yapılmaya çalışıldı ilgili cell'i temizle...*/
                this.setState({char: ''});

            }
        } else {
            this.setState({char: text});
            this.props.changeCellChar(index, text);
        }
    };

    render() {
        const {height, width, fontSize, index, cellItem} = this.props;
        const {cellBackgroundColor} = this.state;
        let cell_background_color = '#fff';

        /** İçeriği "X" 'e eşit olan node'ların kullanılmayacağını varsayıyoruz.*/
        if (cellItem.cell_value === 1) {
            cell_background_color = cellItem.char === 'X' ? '#313231' : (cellItem.char === '' ? cellBackgroundColor : this.selectedColor);
        } else if (cellItem.cell_value === 2) {
            cell_background_color = cellItem.char === 'X' ? '#313231' : (cellItem.char === '' ? this.yellow_color : this.selectedColor);
        } else if (cellItem.cell_value === 3) {
            cell_background_color = cellItem.char === 'X' ? '#313231' : (cellItem.char === '' ? this.purple_color : this.selectedColor);
        } else if (cellItem.cell_value === 4) {
            cell_background_color = cellItem.char === 'X' ? '#313231' : (cellItem.char === '' ? this.blue_color : this.selectedColor);
        }

        return (
            <View style={styles.textInputContainerStyle}>
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
                    editable={cellItem.char !== 'X' && cellItem.agreed === false} //if char is 'X' make the cell inactive
                    value={cellItem.char}
                    onChangeText={(text) => this.onChangeText(index, text)}
                    caretHidden={true} //make the cursor hidden
                    maxLength={1}/>
            </View>
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
        justifyContent: 'center',
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

