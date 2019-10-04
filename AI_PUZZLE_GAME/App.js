import React from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions} from 'react-native';
import Node from './Node';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            numColumns: 8,
        };
    };

    componentWillMount() {
        let size = this.state.numColumns;
        this.createData(size);
    }

    createData = (size) => {
        let data = [];

        for (let i = 0; i < size; i++) {
            for (let i = 0; i < size; i++) {
                data.push({char: ''});
            }
        }

        this.setState({data: data});
    };

    renderHeader = () => {
        return (
            <View style={{height: '40%'}}>

            </View>
        );
    };

    renderItem = ({item, index}) => {
        const {numColumns} = this.state;
        console.log('index: ', index);

        if (item.empty === true) {
            return <View
                style={[styles.item, styles.itemInvisible, {height: 45}]}/>;
        }
        return (
            <View style={[styles.item, {height: 45}]}>
                <Node height={40}
                      index={index}
                      chageCellChar={(indx, newChar) => this.chageCellChar(indx, newChar)}
                      width={Dimensions.get('window').width / numColumns}
                      fontSize={(Dimensions.get('window').width / numColumns) - 15}/>
            </View>
        );
    };

    chageCellChar = (indx, newChar) => {
        let newData = this.state.data;
        newData[indx].char = newChar;
        this.setState({data: newData});
    };

    render() {
        console.log('data: ', this.state.data);

        return (
            <FlatList
                data={this.state.data}
                style={styles.container}
                renderItem={this.renderItem}
                numColumns={this.state.numColumns}
                ListHeaderComponent={this.renderHeader}
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
