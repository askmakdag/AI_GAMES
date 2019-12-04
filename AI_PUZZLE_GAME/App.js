import React from 'react';
import {
    StyleSheet,
    Text,
    Alert,
    View,
    FlatList,
    TouchableOpacity,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native';
import Cell from './Cell';
import ColorDisplayComponent from './ColorDisplayComponent';
import {importDictionary, play} from './Algo';

export default class App extends React.Component {

    yellow_color = '#F7F1B4'; // 2 puan
    purple_color = '#EFE1FE'; // 3 puan
    blue_color = '#D0F2F9';   // 4 puan

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            num_columns: 0,
            modified_index: -1,
            word: '',
            start_to_play: false,
            finish_to_play: false,
            score1: 0,
            score2: 0,
            start_the_game: true,
            active_player: 0,
            row_or_column: '',
            word_start_index: -1,
        };
    };

    componentWillMount() {
        this.createData(this.state.num_columns);
        importDictionary();
    }

    distribute_random_cell_colors = (data, size) => {
        console.log('ddata ', data);

        if (data === []) {
            console.log('ddata boşş', data);
        } else {
            /** %10 sarı kutucuk. */
            let yellow_cell_rate = Math.ceil(size * size / 10);
            /** %6 mor kutucuk. */
            let purple_cell_rate = Math.ceil(size * size * 6 / 100);
            /** %3 mavi kutucuk. */
            let blue_cell_rate = Math.ceil(size * size * 3 / 100);

            let rand_cell_indx = 0;

            /** Sarı kutucuk 2 puan. */
            for (let i = 0; i < yellow_cell_rate; i++) {
                rand_cell_indx = Math.floor(Math.random() * (size * size));
                //console.log('rand_cell_indx sarı: ', rand_cell_indx);
                data[rand_cell_indx].cell_value = 2;
            }

            /** Mor kutucuk 3 puan. */
            for (let i = 0; i < purple_cell_rate; i++) {
                rand_cell_indx = Math.floor(Math.random() * (size * size));
                //console.log('rand_cell_indx mor: ', rand_cell_indx);
                data[rand_cell_indx].cell_value = 3;
            }

            /** Mavi kutucuk 4 puan. */
            for (let i = 0; i < blue_cell_rate; i++) {
                rand_cell_indx = Math.floor(Math.random() * (size * size));
                //console.log('rand_cell_indx mavi: ', rand_cell_indx);
                data[rand_cell_indx].cell_value = 4;
            }
        }

    };


    /** Başlangıçta oluşturulan tablo değerleri
     * @param size Kare tablonun bir satır veya sütununun uzunluğu
     * */
    createData = (size) => {
        let data = [];

        for (let i = 0; i < size * size; i++) {
            data.push({
                char: '',
                agreed: false,
                last_modified_index: -1,
                word_start_index: -1,
                start_new_word: true,
                row_or_column: '',
                size: size,
                cell_value: 1,
            });
        }

        this.distribute_random_cell_colors(data, size);
        this.setState({data: data});
    };

    modifyTableWithNewWord = async (bisey) => {
        const {num_columns} = this.state;

        let newData = this.state.data;
        let col = bisey.col;
        let row = bisey.row;
        let dir = bisey.dir;
        let result_word = bisey.word;

        if (dir === 'column') {
            console.log('bisey in column: ', bisey);

            for (let i = 0; i < result_word.length; i++) {
                newData[row * num_columns + col + num_columns * i].char = bisey.word[i];
                newData[row * num_columns + col + num_columns * i].agreed = true;
            }
            //console.log('newData: ', newData);
            let start_index = row * num_columns + col;
            let last_modified_index = row * num_columns + col + num_columns * (result_word.length - 1);
            this.calculate_score(2, 'column', start_index, last_modified_index);

            /** ****************************************************************************************************/
            let indexT = last_modified_index;
            console.log('last modified: ', last_modified_index);
            while (indexT > num_columns && newData[indexT - num_columns].char !== 'X') {
                if (indexT - num_columns >= 0) {
                    if (newData[indexT - num_columns].char === '') {
                        newData[indexT - num_columns].char = 'X';
                        break;
                    }
                }
                indexT = indexT - num_columns;
            }

            let indexB = parseInt(last_modified_index);
            const matrisSize = parseInt(num_columns);
            while ((indexB + matrisSize) <= matrisSize * matrisSize && newData[indexB + matrisSize].char !== 'X') {
                if (indexB + matrisSize <= matrisSize * matrisSize) {
                    if (newData[indexB + matrisSize].char === '') {
                        newData[indexB + matrisSize].char = 'X';
                        break;
                    }
                }
                indexB = indexB + matrisSize;
            }
            /** ****************************************************************************************************/

            this.setState({active_player: 1, data: newData});
        }

        if (dir === 'row') {
            console.log('bisey in row: ', bisey);

            for (let i = 0; i < result_word.length; i++) {
                newData[row * num_columns + col + i].char = bisey.word[i];
                newData[row * num_columns + col + i].agreed = true;
            }
            //console.log('newData: ', newData);
            let start_index = row * num_columns + col;
            let last_modified_index = row * num_columns + col + result_word.length - 1;
            this.calculate_score(2, 'row', start_index, last_modified_index);
            /** ****************************************************************************************************/
            let indexR = last_modified_index;
            while (indexR > 0 && (indexR % num_columns !== 0) && newData[indexR - 1].char !== 'X') {
                if (newData[indexR - 1].char === '') {
                    newData[indexR - 1].char = 'X';
                    break;
                }
                indexR = indexR - 1;
            }

            let indexF = last_modified_index;
            while ((indexF + 1) % num_columns !== 0 && newData[indexF + 1].char !== 'X') {
                if (newData[indexF + 1].char === '') {
                    newData[indexF + 1].char = 'X';
                    break;
                }
                indexF = indexF + 1;
            }
            /** ****************************************************************************************************/
            this.setState({active_player: 1, data: newData});
        }

    };

    /** Tüm tablo boyunca cell'lerin içerdiği bilginin manipülasyonu
     * @param last_modified_index Tabloda en son güncellenen hücre index'i
     * @param row_or_column Şuan da girilen kelimenin satıra mı yoksa sütuna mı yazıldığı bilgisi
     * @param start_new_word Tabloya şuan da kelime girişi oluyor mu olmuyor mu bilgisi
     * */
    passThroughData = (last_modified_index, row_or_column, start_new_word) => {
        const {num_columns, data} = this.state;
        let newData = data;
        for (let i = 0; i < (num_columns * num_columns); i++) {
            newData[i].last_modified_index = last_modified_index;
            newData[i].start_new_word = start_new_word;
            newData[i].row_or_column = row_or_column;
        }
        this.setState({data: newData});
    };

    /** Herhangi bir cell içindeki verinin değişmesi durumunda yapılacaklar
     * */
    changeCellChar = (index, newChar) => {
        const {modified_index, word, num_columns} = this.state;
        let newData = this.state.data;

        /** Yeni bir harf girişi ...*/
        newData[index].char = newChar;
        newData[index].agreed = false;

        /** Yeni bir kelime için harf giriliyor ise ...*/
        if (modified_index === -1) {
            this.setState({
                data: newData, modified_index: index, row_or_column: '', word: newChar,
            });

            this.passThroughData(index, '', false);

            /** kelimenin başladığı index numarasını da kaydediyoruz.*/
            for (let i = 0; i < (num_columns * num_columns); i++) {
                newData[i].word_start_index = index;
            }

            this.setState({data: newData, word_start_index: index});
        }
        /** Var olan bir kelimenin devamı için harf giriliyor ise ...*/
        else if (modified_index !== -1) {
            console.log('burada');
            let temp_word = word + newChar;
            /** Kelime satır boyunca ilerliyor ise ...*/
            if (modified_index === (index - 1)) {
                this.passThroughData(index, 'row', false);
                this.setState({
                    data: newData,
                    modified_index: index,
                    word: temp_word,
                    row_or_column: 'row',
                });
            }
            /** Kelime sütun boyunca ilerliyor ise ...*/
            else if ((modified_index === (index - this.state.num_columns))) {
                this.passThroughData(index, 'column', false);
                this.setState({
                    data: newData,
                    modified_index: index,
                    word: temp_word,
                    row_or_column: 'column',
                });
            }
            /** Son girilen karakterin silinmek istemesi durumunda ...*/
            else if (modified_index === index) {
                const {num_columns, data, row_or_column} = this.state;
                let newData = data;
                newData[index].char = newChar;

                /** Son girilen karakterin silinmek istemesi durumunda "last_modified_index=last_modified_index-1" olmalıdır. */
                if (newChar === '') {

                    if (row_or_column === 'row') {
                        this.setState({modified_index: index - 1});
                        for (let i = 0; i < (num_columns * num_columns); i++) {
                            newData[i].last_modified_index = index - 1;
                        }
                    }

                    if (row_or_column === 'column') {
                        this.setState({modified_index: index - num_columns});
                        for (let i = 0; i < (num_columns * num_columns); i++) {
                            newData[i].last_modified_index = index - num_columns;
                        }
                    }
                }

                this.setState({
                    data: newData,
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
        const {num_columns} = this.state;
        if (num_columns === 0) {
            Alert.alert('Matris boyutunu giriniz lütfen.');
        } else {
            this.createData(num_columns);
            this.setState({start_to_play: true, start_the_game: false, active_player: 1});
        }
    };

    endTheGame = () => {
        this.setState({
            start_to_play: false,
            modified_index: -1,
            word: '',
            start_the_game: true,
            num_columns: 0,
            active_player: 0,
            score1: 0,
            score2: 0,
        });
    };

    renderItem = ({item, index}) => {
        const {num_columns} = this.state;
        let fontSize = (Dimensions.get('window').width / num_columns) - 15 < 15 ? 15 : (Dimensions.get('window').width / num_columns) - 15;

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
                      fontSize={fontSize}/>
            </View>
        );
    };

    makeSelectionsAgreed = () => {
        const {num_columns} = this.state;
        let newData = this.state.data;

        for (let i = 0; i < (num_columns * num_columns); i++) {
            if (newData[i].char !== '') {
                newData[i].agreed = true;
            }
        }

        this.setState({data: newData});
    };

    calculate_score = (active_player, row_or_column, start_index, modified_index) => {
        const {num_columns, data, score1, score2} = this.state;
        let score = active_player === 1 ? score1 : score2;
        let col_size = parseInt(num_columns);

        /** Kelime satır boyunca ilerlemiş ise.*/
        if (row_or_column === 'row') {
            for (let i = start_index; i <= modified_index; i++) {
                if (data[i].char !== 'X') {
                    score = score + data[i].cell_value;
                }
            }
        }

        /** Kelime sütun boyunca ilerlemiş ise.*/
        if (row_or_column === 'column') {
            for (let i = start_index; i <= modified_index; i = i + col_size) {
                if (data[i].char !== 'X') {
                    score = score + data[i].cell_value;
                }
            }
        }
        console.log('score: ', score);

        active_player === 1 ?
            this.setState({modified_index: -1, word_start_index: -1, score1: score, row_or_column: ''})
            :
            this.setState({modified_index: -1, word_start_index: -1, score2: score, row_or_column: ''});
    };

    turnMove = () => {
        const {word, num_columns, active_player, modified_index, word_start_index, row_or_column} = this.state;
        let newData = this.state.data;
        console.log('Word: ', this.state.word);
        if (word === '') {
            Alert.alert('Lütfen öncelikle kelimenizi giriniz.');
        } else {
            /** Kelime girildikten sonra hangi hücrelerin siyaha boyanacağı burada belirleniyor. Pass butonuna basıldığında geçerli olmayanlar("agreed=false") silinecek.*/
            this.checkXLocations();

            /** Son girilen kelimenin tüm harflerinin artık geçerli olduğunu belitriyor.*/
            this.passThroughData(-1, '', false);

            /** Boş olmayan karakterlerin "agreed" değerlerini false yapar..*/
            this.makeSelectionsAgreed();

            if (active_player === 1) {
                this.calculate_score(1, row_or_column, word_start_index, modified_index);
                this.setState({active_player: 2});
            } else {
                this.calculate_score(2, row_or_column, word_start_index, modified_index);

                this.setState({active_player: 1});
            }

            if (newData.length !== 0) {
                /** Matrisin n*n lik olduğu varsayılmıştır. Yani "Math.sqrt()" metodu sonucunda mantıklı bir değer return edilecektir.*/
                //this.getCharMatris(Math.sqrt(newData.length), newData);
            }

            for (let i = 0; i < (num_columns * num_columns); i++) {
                newData[i].last_modified_index = -1;
                newData[i].start_new_word = true;
                newData[i].row_or_column = '';
            }

            /** Yeni kelimenin başladığı index değerini tekrar -1 yapıyoruz. */
            for (let i = 0; i < (num_columns * num_columns); i++) {
                newData[i].word_start_index = -1;
            }

            this.setState({
                data: newData,
                word: '',
            });
        }

        let grid = this.getCharMatris(num_columns, this.state.data);
        let cell_values_grid = this.getCellValueMatris(num_columns, this.state.data);
        console.log('cell_values_grid: ', cell_values_grid);

        let bisey = play(grid);
        console.log('bisey: ', bisey);
        this.modifyTableWithNewWord(bisey);
    };

    checkXLocations = () => {
        const {num_columns, modified_index} = this.state;
        let newData = this.state.data;

        let indexT = modified_index;
        if (newData[1].row_or_column === 'column') {
            while (indexT > num_columns && newData[indexT - num_columns].char !== 'X') {
                if (indexT - num_columns >= 0) {
                    if (newData[indexT - num_columns].char === '') {
                        newData[indexT - num_columns].char = 'X';
                        break;
                    }
                }
                indexT = indexT - num_columns;
            }

            let indexB = parseInt(modified_index);
            const matrisSize = parseInt(num_columns);
            while ((indexB + matrisSize) <= matrisSize * matrisSize && newData[indexB + matrisSize].char !== 'X') {
                if (indexB + matrisSize <= matrisSize * matrisSize) {
                    if (newData[indexB + matrisSize].char === '') {
                        newData[indexB + matrisSize].char = 'X';
                        break;
                    }
                }
                indexB = indexB + matrisSize;
            }

        } else if (newData[1].row_or_column === 'row') {
            let indexR = modified_index;
            while (indexR > 0 && (indexR % num_columns !== 0) && newData[indexR - 1].char !== 'X') {
                if (newData[indexR - 1].char === '') {
                    newData[indexR - 1].char = 'X';
                    break;
                }
                indexR = indexR - 1;
            }

            let indexF = modified_index;
            while ((indexF + 1) % num_columns !== 0 && newData[indexF + 1].char !== 'X') {
                if (newData[indexF + 1].char === '') {
                    newData[indexF + 1].char = 'X';
                    break;
                }
                indexF = indexF + 1;
            }
        }
    };

    passMove = () => {
        const {active_player, num_columns, data} = this.state;

        if (active_player === 1) {
            this.setState({active_player: 2});
        } else {
            this.setState({active_player: 1});
        }

        let newData = data;
        for (let i = 0; i < (num_columns * num_columns); i++) {
            if (newData[i].agreed === false) {
                newData[i].char = '';
            }
        }

        this.passThroughData(-1, '', false);

        /** Yeni kelimenin başladığı index değerini tekrar -1 yapıyoruz. */
        for (let i = 0; i < (num_columns * num_columns); i++) {
            newData[i].word_start_index = -1;
        }

        this.setState({
            data: newData,
            modified_index: -1,
            word: '',
            row_or_column: '',
        });

        let grid = this.getCharMatris(num_columns, this.state.data);
        let cell_values_grid = this.getCellValueMatris(num_columns, this.state.data);
        console.log('cell_values_grid: ', cell_values_grid);

        let bisey = play(grid);
        console.log('bisey: ', bisey);
        this.modifyTableWithNewWord(bisey);
    };

    /** Search algoritmalarının kullanacağı matris. Board'un en güncel halini içerir.*/
    getCharMatris = (SIZE, DATA) => {
        SIZE = parseInt(SIZE);
        let matris = new Array(SIZE + 2);

        // Loop to create 2D array using 1D array
        for (let i = 0; i < matris.length; i++) {
            matris[i] = new Array(SIZE + 2);
        }

        // Loop to initilize 2D array elements.
        for (let i = 0; i < matris.length; i++) {
            for (let j = 0; j < matris.length; j++) {
                if (i === 0 || j === 0 || i === matris.length - 1 || j === matris.length - 1) {
                    matris[i][j] = 'X';
                } else {
                    if (DATA[(i - 1) * SIZE + (j - 1)].char === '') {
                        matris[i][j] = '.';
                    } else {
                        matris[i][j] = DATA[(i - 1) * SIZE + (j - 1)].char;
                    }
                }
            }
        }

        return matris;
    };

    getCellValueMatris = (SIZE, DATA) => {
        SIZE = parseInt(SIZE);
        let matris = new Array(SIZE + 2);

        // Loop to create 2D array using 1D array
        for (let i = 0; i < matris.length; i++) {
            matris[i] = new Array(SIZE + 2);
        }

        // Loop to initilize 2D array elements.
        for (let i = 0; i < matris.length; i++) {
            for (let j = 0; j < matris.length; j++) {
                if (i === 0 || j === 0 || i === matris.length - 1 || j === matris.length - 1) {
                    matris[i][j] = 0;
                } else {
                    matris[i][j] = DATA[(i - 1) * SIZE + (j - 1)].cell_value;
                }
            }
        }

        return matris;
    };

    handleBoardPaneVisual = () => {
        const keyboardVerticalOffset = Platform.OS === 'ios' ? 85 : 0;
        return (
            <KeyboardAvoidingView style={styles.textInputContainerStyle} behavior="position"
                                  keyboardVerticalOffset={keyboardVerticalOffset}>
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                    numColumns={this.state.num_columns}
                    ListHeaderComponent={() => <View style={{height: 60}}/>}
                    ListFooterComponent={() => <View style={{height: 60}}/>}
                />
            </KeyboardAvoidingView>
        );
    };

    render() {
        const {start_the_game, num_columns, active_player, data} = this.state;
        const active_player_color = '#2E8B57';
        console.log('data: ', data);

        return (
            <View style={styles.mainContainer}>
                <View style={styles.topContainer}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: 16, fontWeight: '500'}}>Boyut Seç</Text>

                        <TextInput
                            style={styles.textInputStyle}
                            keyboardType='numeric'
                            editable={!this.state.start_to_play}
                            value={num_columns}
                            autoFocus={true}
                            onChangeText={(size) => this.setState({num_columns: size})}
                        />
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View display={start_the_game ? 'flex' : 'none'}>
                            <TouchableOpacity style={styles.startButtonContainer}
                                              onPress={() => this.startTheGame()}>
                                <Text style={styles.finishButtonText}>Başla</Text>
                            </TouchableOpacity>
                        </View>

                        <View display={!start_the_game ? 'flex' : 'none'}>
                            <TouchableOpacity style={styles.finishButtonContainer}
                                              onPress={() => this.endTheGame()}>
                                <Text style={styles.finishButtonText}>Bitir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <ColorDisplayComponent/>

                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    height: '68%',
                    backgroundColor: '#2E8B57',
                }}>
                    {(this.state.start_to_play) ?
                        this.handleBoardPaneVisual() :
                        <View style={{height: 60}}/>}
                </View>

                <View style={styles.bottomContainer}>

                    <View style={{alignItems: 'flex-start', flexDirection: 'column'}}>
                        <Text style={[styles.scoreTextStyle, active_player === 1 ? {
                            color: active_player_color,
                            fontWeight: 'bold',
                            fontSize: 17,
                        } : {fontSize: 16}]}>Oyucu: {this.state.score1} </Text>
                        <Text
                            style={[styles.scoreTextStyle, active_player === 2 ? {
                                color: active_player_color,
                                marginVertical: 15,
                                fontSize: 17,
                            } : {marginVertical: 15, fontSize: 16}]}>Bilgisayar: {this.state.score2} </Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <View display={!start_the_game ? 'flex' : 'none'}>
                            <TouchableOpacity style={styles.finishButtonContainer} onPress={() => this.passMove()}>
                                <Text style={styles.finishButtonText}> Pass </Text>
                            </TouchableOpacity>
                        </View>

                        <View display={!start_the_game ? 'flex' : 'none'}>
                            <TouchableOpacity style={styles.finishButtonContainer} onPress={() => this.turnMove()}>
                                <Text style={styles.finishButtonText}> Oyna </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 40,
        width: '100%',
        height: '15%',
        backgroundColor: '#D2AB6F',
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        width: '100%',
        height: '15%',
        backgroundColor: '#D2AB6F',
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
        width: 80,
        borderRadius: 10,
        backgroundColor: '#6F96D1',
        marginRight: 20,
    },
    startButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 80,
        borderRadius: 10,
        backgroundColor: '#6F96D1',
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
        backgroundColor: '#DCB579',
        borderRadius: 10,
        marginHorizontal: 15,
    },
    scoreTextStyle: {
        textAlign: 'center',
        fontWeight: '500',
    },
});
