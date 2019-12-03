const fs = require('fs');
const readline = require('readline');

let filePath = "sozluk.txt";
let dictSet = new Set();
let dictArr = [];
let wholeDictSet = new Set();
let wholeDictArr = [];

/**
 * Disari export edilen metod, bilgisayar tarafından oynanmasi icin cagirilir. Gride en iyi kelimeyi yazar.
 * Eger tahtaya herhangi bir kelime yazilamiyorsa undefined doner.
 * @param grid Oyun tahtasi
 */
play = (grid) => {

    let bestOption1 = {word:"", row:0, col:0, dir:"nowhere"};
    let bestPoints1 = -100000;

    ////////////////****************** BILGISAYAR OYNAR *************************************///////////////////////////
    let regexpList1 = createRegexpList(grid);
    regexpList1.sort(() => 0.5 - Math.random());
    regexpList1.sort((a, b) => { return b.re.length - a.re.length;});

    for (let regexpIndex1 = 0; regexpIndex1 < regexpList1.length; ++regexpIndex1) {
        let regexp1 = regexpList1[regexpIndex1];
        let wordArr1 = getWordsMatching(dictArr, regexp1.re);
        wordArr1.sort(() => 0.5 - Math.random());

        for (let wordIndex1 = 0; wordIndex1 < wordArr1.length; ++ wordIndex1) {
            let option1 = {word:wordArr1[wordIndex1], row:regexp1.row, col:regexp1.col, dir:regexp1.dir};
            let gridClone1 = JSON.parse(JSON.stringify(grid));
            let points1 = 0;
            points1 += insertWord(gridClone1, option1);

            let worstPoints1 = 100000;

            ////////////////**************************** INSAN OYNAR ***********************************////////////////
            /*let regexpList2 = createRegexpList(gridClone1);
            regexpList2.sort(() => 0.5 - Math.random());
            regexpList2.sort((a, b) => { return b.re.length - a.re.length;});


            for (let regexpIndex2 = 0; regexpIndex2 < regexpList2.length; ++regexpIndex2) {
                let regexp2 = regexpList2[regexpIndex2];
                let wordArr2 = getWordsMatching(dictArr, regexp2.re);
                wordArr2.sort(() => 0.5 - Math.random());

                for (let wordIndex2 = 0; wordIndex2 < wordArr2.length; ++wordIndex2) {
                    let option2 = {word: wordArr2[wordIndex2], row: regexp2.row, col: regexp2.col, dir: regexp2.dir};
                    let gridClone2 = JSON.parse(JSON.stringify(gridClone1));
                    let points2 = 0;
                    points2 -= insertWord(gridClone2, option2);

                    let bestPoints2 = 0;

                    //////////////!******************** BILGISAYAR OYNAR ************************!////////////////////////
                    let regexpList3 = createRegexpList(gridClone2);
                    regexpList3.sort(() => 0.5 - Math.random());
                    regexpList3.sort((a, b) => { return b.re.length - a.re.length;});

                    for (let regexpIndex3 = 0; regexpIndex3 < regexpList3.length; ++regexpIndex3) {
                        let regexp3 = regexpList3[regexpIndex3];
                        let wordArr3 = getWordsMatching(dictArr, regexp3.re);
                        wordArr3.sort(() => 0.5 - Math.random());

                        for (let wordIndex3 = 0; wordIndex3 < wordArr3.length; ++wordIndex3) {
                            let option3 = {word: wordArr3[wordIndex3], row: regexp3.row, col: regexp3.col, dir: regexp3.dir};
                            let gridClone3 = JSON.parse(JSON.stringify(gridClone2));
                            let points3 = insertWord(gridClone3, option3);

                            if (points3 > bestPoints2) {
                                bestPoints2 = points3;
                            } else {
                                break;
                            }
                        }
                    }

                    points2 += bestPoints2;
                    if(points2 < worstPoints1) {
                        worstPoints1 = points2;
                    } else if (points2 === worstPoints1) {
                        break;
                    }
                }
            }
                */
            points1 -= worstPoints1;
            if (points1 > bestPoints1) {
                bestPoints1 = points1;
                bestOption1 = option1;
            } else if (points1 === bestPoints1) {
                break;
            }
        }
    }

    if (bestOption1.word !== "") {
        insertWord(grid, bestOption1);
        console.log(bestOption1);
        console.log(bestPoints1);
        console.log(grid);
    }
    return grid;
};

/**
 * Disari export edilen metod, verilen kelimenin sozluk icerisinde yer alip almadigini doner.
 * @param {string} word
 * @returns {boolean}
 */
isValid = (word) => {
    return wholeDictSet.has(word);
};

/**
 * Recursive olarak en iyi opsiyonu bulur
 * @param {[]} grid Oyun tahtasi
 * @param {number} turnCount Kac kez bilgisayar-insan oynayacagini belirtir.
 * @param {string} maxORmin maximize ya da minimize etmek icindir. "max" ya da "min" yazilir.
 * @param {number} points Recursive olarak bestOptionu bulmak icin point tutulur.
 */
turn = (grid, turnCount, maxORmin, points) => {
    if (turnCount === 0 && maxORmin === "max") {
        return points;
    }

    if (maxORmin === "max") {


    } else {
        let regexpList = createRegexpList(grid);
        regexpList = regexpList.sort(() => 0.5 - Math.random());

        for (let regexpIndex = 0; regexpIndex < regexpList.length; ++regexpIndex) {
            let regexp = regexpList[regexpIndex];
            let wordArr = getWordsMatching(dictArr, regexp.re);

            for (let wordIndex = 0; wordIndex < wordArr.length; ++ wordIndex) {
                let option = {word:wordArr[wordIndex], row:regexp.row, col:regexp.col, dir:regexp.dir};
                let gridClone = JSON.parse(JSON.stringify(grid));
                points -= insertWord(gridClone, option);
                return turn(gridClone, turnCount-1, "max", points);

            }
        }
    }




        // Insan icin oyna (MIN)

        //

};

/**
 * Verilen oyun tahtasina, verilen kelime objesini yerlestirir.
 * @param {[]} grid Oyun tahtasi
 * @param {{col: number, row: number, dir: string, word: string}} wordObject Kelime objesi
 */
insertWord = (grid, wordObject) => {
    let point = 0;
    if (wordObject.dir === "right") {
        grid[wordObject.row][wordObject.col-1] = "X";
        for(let wordIndex = 0; wordIndex < wordObject.word.length; ++wordIndex) {
            grid[wordObject.row][wordObject.col+wordIndex] = wordObject.word.charAt(wordIndex);
            point++;
        }
        grid[wordObject.row][wordObject.col+wordObject.word.length] = "X";
    } else {
        grid[wordObject.row-1][wordObject.col] = "X";
        for(let wordIndex = 0; wordIndex < wordObject.word.length; ++wordIndex) {
            grid[wordObject.row+wordIndex][wordObject.col] = wordObject.word.charAt(wordIndex);
            point++;
        }
        grid[wordObject.row+wordObject.word.length][wordObject.col] = "X";
    }
    return point;
};

/**
 *
 * @param filePath Yuklenecek sozluk dosyasinin bulundugu yer
 * @param maxLength Yuklenecek kelimelerin maksimum uzunluklari, bundan daha uzun kelimeler yuklenmez
 * @param maxCount Yuklenecek dizinin maksimum uzunlugu
 * @returns {Promise<void>}
 */
importDictionary = async (filePath, maxLength, maxCount) => {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        let word = line.toLocaleUpperCase('tr-TR');
        if (!wholeDictSet.has(word))
            wholeDictArr.push(word);
        wholeDictSet.add(word);

        if (word.length > maxLength)
            continue;

        if (!dictSet.has(word))
            dictArr.push(word);
        dictSet.add(word);
    }

    const shuffled = dictArr.sort(() => 0.5 - Math.random());
    dictArr = shuffled.slice(0, maxCount);
    dictArr.sort();
};

/**
 *
 * @param arr Arama yapilacak array
 * @param regexp Aramada kullanilacak regexp stringi
 * @returns {[]} Arama sonrasi donecek array
 */
getWordsMatching = (arr, regexp) => {
    let vals = [];
    arr.forEach( val => {
        if (new RegExp(regexp).test(val)) {
            vals.push(val);
            //console.log(val);
        }
    });
    return vals;
};

/**
 * Verilen grid icerisinden yaratilabilecek tum structRegexp leri yaratir.
 * @param grid Olabilecek tum regexplerin arama yapilacagi kelime tahtasi
 * @returns {[]} Kelime tahtasi uzerine yazilabilecek tum regexpleri iceren array
 */
createRegexpList = (grid) => {
    let list = [];
    let size = grid.length;
    // Once soldan saga yazilabilecekler icin her satira bakilir.
    for (let i  = 1; i < size-1; ++i) {       // Her satir icin
        let str = "";
        for  (let j  = 0; j < size; ++j) {
            str += grid[i][j];
        }
        createRegexpListHelperRow(str, i, list);
    }

    // Simdi yukaridan asagiya bakilir.
    for (let i  = 1; i < size-1; ++i) {       // Her sutun icin
        let str = "";
        for  (let j  = 0; j < size; ++j) {
            str += grid[j][i];
        }
        createRegexpListHelperCol(str, i, list);
    }
    return list;
};

/**
 * Verilen kelimeden regexpler meydana getirip listeye ekler
 * @param {string} str Satir ya da Sutunun tek kelime haline getirilmis hali
 * @param {number} rowNumber Satir numarasi
 * @param {[]} list Olusturulan regexpin eklenecegi liste
 */
createRegexpListHelperRow = (str, rowNumber, list) => {
    for (let colNumber = 1; colNumber < str.length-2; ++ colNumber) {
        if (str.charAt(colNumber) === 'X')
            continue;

        for (let endIndex = colNumber+1; endIndex < str.length-1; ++ endIndex) {
            let word = str.substring(colNumber, endIndex+1);
            if (word.includes("X") || !word.includes(".")) {
                continue;
            }

            if ((str.charAt(colNumber-1) === "X" || str.charAt(colNumber-1) === ".")
                && (str.charAt(endIndex+1) === "X" || str.charAt(endIndex+1) === "."))
            {
                if (word.match(/.*[A-ZÖÜİĞŞÇ]+.*/)) {
                    list.push({re:"^"+word+"$", row:rowNumber, col:colNumber, dir:"right"});
                }
            }
        }
    }
};

/**
 * Verilen kelimeden regexpler meydana getirip listeye ekler
 * @param {string} str Satir ya da Sutunun tek kelime haline getirilmis hali
 * @param {number} colNumber Sutun numarasi
 * @param {[]} list Olusturulan regexpin eklenecegi liste
 */
createRegexpListHelperCol = (str, colNumber, list) => {
    for (let rowNumber = 1; rowNumber < str.length-2; ++ rowNumber) {
        if (str.charAt(rowNumber) === 'X')
            continue;

        for (let endIndex = rowNumber+1; endIndex < str.length-1; ++ endIndex) {
            let word = str.substring(rowNumber, endIndex+1);
            if (word.includes("X") || !word.includes(".")) {
                continue;
            }

            if ((str.charAt(rowNumber-1) === "X" || str.charAt(rowNumber-1) === ".")
                && (str.charAt(endIndex+1) === "X" || str.charAt(endIndex+1) === "."))
            {
                if (word.match(/.*[A-ZÖÜİĞŞÇ]+.*/)) {
                    list.push({re:"^"+word+"$", row:rowNumber, col:colNumber, dir:"down"});
                }
            }
        }
    }
};

/**
 * Verilen stringinin harf içerip içermediğini döner
 * @param regexp Kontrol edilecek string
 * @returns {boolean} harf içeriyor mu
 */
containsLiteral = (regexp) => {
    for (let i = 0; i < regexp.length; ++i) {
        if ("/^[a-zşıöüğşç]+$/".match(regexp.charAt(i))) {
            return true;
        }
    }
    return false;
};

/**
 * Verilen stringinin nokta içerip içermediğini döner
 * @param regexp Kontrol edilecek string
 * @returns {boolean} nokta içeriyor mu
 */
containsDots = (regexp) => {
    for (let i = 0; i < regexp.length; ++i) {
        if (regexp.charAt(i) === ".") {
            return true;
        }
    }
    return false;
};

// Test kismi
importDictionary(filePath,  15, 10000).then(r => {
    console.log("********************************");
    console.log(dictArr.length);
    console.log("********************************");
    let re = new RegExp("^.{0,3}e.$");
    let start = getNanoSecTime();
    //let res = getWordsMatching(dictArr, re);
    //console.log(res.sort(() => 0.5 - Math.random()));
    let end =  getNanoSecTime();
    console.log(end-start);
    console.log("********************************");
    let board = [
        ["X","X","X","X","X","X","X","X","X","X","X","X"],
        ["X","K","E","M","A","N","C","I","L","I","K","X"],
        ["X","I",".",".",".",".",".",".",".",".",".","X"],
        ["X","L",".",".",".",".",".",".",".",".",".","X"],
        ["X","I",".",".",".",".",".",".",".",".",".","X"],
        ["X","Ç",".",".",".",".",".",".",".",".",".","X"],
        ["X","X",".",".",".",".",".",".",".",".",".","X"],
        ["X",".",".",".",".",".",".",".",".",".",".","X"],
        ["X",".",".",".",".",".",".",".",".",".",".","X"],
        ["X",".",".",".",".",".",".",".",".",".",".","X"],
        ["X",".",".",".",".",".",".",".",".",".",".","X"],
        ["X","X","X","X","X","X","X","X","X","X","X","X"]
    ];
    for (let i = 0; i < 15; ++i){
        console.log("TURN " + i);
        board = play(board);
    }
});

function getNanoSecTime() {
    var hrTime = process.hrtime();
    return hrTime[0] * 1000000000 + hrTime[1];
}

