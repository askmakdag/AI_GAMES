import React from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions} from 'react-native';
import Cell from './Cell';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            num_columns: 8,
            modified_index: -1,
            word: '',
            start_new_word: true,
        };
    };

    componentWillMount() {
        let size = this.state.num_columns;
        this.createData(size);
    }

    /** */
    createData = (size) => {
        let data = [];

        for (let i = 0; i < size; i++) {
            for (let i = 0; i < size; i++) {
                data.push({char: '', last_modified_index: -1, start_new_word: true, row_or_column: ''});
            }
        }

        this.setState({data: data});
    };

    passThroughData = (last_modified_index, row_or_column) => {
        const {num_columns, data, start_new_word} = this.state;
        let newData = data;

        for (let i = 0; i < (num_columns * num_columns); i++) {
            newData[i].last_modified_index = last_modified_index;
            newData[i].start_new_word = start_new_word;
            newData[i].row_or_column = row_or_column;
        }

        this.setState({data: newData});
    };

    renderHeader = () => {
        return (
            <View style={{height: 120}}>

            </View>
        );
    };

    renderItem = ({item, index}) => {
        const {num_columns} = this.state;

        if (item.empty === true) {
            return <View style={[styles.item, styles.itemInvisible, {height: 45}]}/>;
        }
        return (
            <View style={[styles.item, {height: 45}]}>
                <Cell height={40}
                      index={index}
                      cellItem={item}
                      modifiedIndex={this.state.modified_index}
                      rowOrColumn={this.state.row_or_column}
                      changeCellChar={(indx, newChar) => this.changeCellChar(indx, newChar)}
                      width={Dimensions.get('window').width / num_columns}
                      fontSize={(Dimensions.get('window').width / num_columns) - 15}/>
            </View>
        );
    };

    changeCellChar = (index, newChar) => {
        const {modified_index, word} = this.state;

        let newData = this.state.data;
        /** Yeni bir harf girişi ...*/
        newData[index].char = newChar;

        /** Yeni bir kelime için harf giriliyor ise ...*/
        if (modified_index === -1) {
            this.setState({data: newData, modified_index: index, word: newChar, start_new_word: false});
            this.passThroughData(index, '');
        }
        /** Var olan bir kelimenin devamı için harf giriliyor ise ...*/
        else if (modified_index !== -1) {
            let temp_word = word + newChar;
            /** Kelime satır boyunca ilerliyor ise ...*/
            if (modified_index === (index - 1)) {
                this.passThroughData(index, 'row');
                this.setState({
                    data: newData,
                    modified_index: index,
                    word: temp_word,
                    start_new_word: false,
                });
            }
            /** Kelime sütun boyunca ilerliyor ise ...*/
            else if ((modified_index === (index - 8))) {
                this.passThroughData(index, 'column');
                this.setState({
                    data: newData,
                    modified_index: index,
                    word: temp_word,
                    start_new_word: false,
                });
            }
        }

    };

    renderFooter = () => {
        return (
            <View style={{height: 120}}>
                <Text> Selamlar </Text>
            </View>

        );
    };

    render() {
        console.log('data: ', this.state.data);
        console.log('kelime: ', this.state.word);

        return (
            <FlatList
                data={this.state.data}
                style={styles.container}
                renderItem={this.renderItem}
                numColumns={this.state.num_columns}
                ListHeaderComponent={this.renderHeader}
                ListFooterComponent={this.renderFooter}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 20,
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
    itemText: {
        color: '#fff',
    },
});
