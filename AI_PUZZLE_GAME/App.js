import React from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, TextInput} from 'react-native';
import Cell from './Cell';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            num_columns: 0,
            modified_index: -1,
            word: '',
            start_new_word: true,
            start_to_play: false,
            finish_to_play: false,
        };
    };

    componentWillMount() {
        this.createData(this.state.num_columns);
    }

    /** */
    createData = (size) => {
        let data = [];

        for (let i = 0; i < size; i++) {
            for (let i = 0; i < size; i++) {
                data.push({char: '', last_modified_index: -1, start_new_word: true, row_or_column: '', size: size});
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
            else if ((modified_index === (index - this.state.num_columns))) {
                this.passThroughData(index, 'column');
                this.setState({
                    data: newData,
                    modified_index: index,
                    word: temp_word,
                    start_new_word: false,
                });
            }
            /** Yetkisiz bir cell'e giriş yapılmaya çalışılıyor ise yazılan harfi sil...*/
            else {
                newData[index].char = '';
                this.setState({
                    data: newData,
                });
            }
        }

    };

    startTheGame = () => {
        this.createData(this.state.num_columns);
        this.setState({start_to_play: true});
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

    handleBoardPaneVisual = () => {
        return (
            <FlatList
                data={this.state.data}
                renderItem={this.renderItem}
                numColumns={this.state.num_columns}
                ListHeaderComponent={() => <View style={{height: 60}}/>}
                ListFooterComponent={() => <View style={{height: 60}}/>}
            />
        );
    };

    render() {
        console.log('data: ', this.state.data);
        console.log('kelime: ', this.state.word);
        console.log('num_columns: ', this.state.num_columns);

        return (
            <View style={styles.mainContainer}>
                <View style={styles.topContainer}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: 16, fontWeight: '500'}}>Boyut Seç</Text>

                        <TextInput
                            style={styles.textInputStyle}
                            keyboardType='numeric'
                            editable={!this.state.start_to_play}
                            onChangeText={(size) => this.setState({num_columns: size})}
                        />
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity style={styles.startButtonContainer}
                                          onPress={() => this.startTheGame()}>
                            <Text style={styles.finishButtonText}>Başla</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.finishButtonContainer}
                                          onPress={() => this.setState({start_to_play: false})}>
                            <Text style={styles.finishButtonText}>Bitir</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    height: '65%',
                    backgroundColor: '#F9D054',
                }}>
                    {(this.state.start_to_play) ?
                        this.handleBoardPaneVisual() :
                        <View style={{height: 60}}/>}
                </View>

                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.finishButtonContainer}>
                        <Text style={styles.finishButtonText}> buton </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: '100%',
        width: '100%',
        marginVertical: 20,
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        width: '100%',
        height: '20%',
        backgroundColor: '#F0F9D0',
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '15%',
        backgroundColor: '#F0F9D0',
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
    finishButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 60,
        borderRadius: 10,
        backgroundColor: '#6EBDFF',
    },
    startButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 60,
        borderRadius: 10,
        backgroundColor: '#6EBDFF',
        marginRight: 10,
    },
    finishButtonText: {
        fontSize: 15,
        fontWeight: '400',
    },
    textInputStyle: {

        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
        height: 35,
        width: 55,
        borderWidth: 0.7,
        color: '#313231',
        borderColor: '#767977',
        borderRadius: 10,
        marginHorizontal: 15,
    },
});
