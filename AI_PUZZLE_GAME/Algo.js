const fs = require('fs');
const readline = require('readline');

let filePath = "sozluk.txt";
let dictSet = new Set();
let dictArr = [];
let grid = [];

/**
 * Disari export edilen metod, bilgisayar tarafından oynanmasi icin cagirilir.
 * Eger tahtaya herhangi bir kelime yazilamiyorsa undefined doner.
 * @param grid Oyun tahtasi
 * @returns {[]} Bilgisayar tarafindan dogru kelime yerlestirilip guncellenmis oyun tahtasi
 */
play = (grid) => {
    let updatedGrid = [];
    let regexpList1 = createRegexpList(grid);
    let bestOption = {};
    let bestWord = "";
    for (let regexpIndex = 0; regexpIndex < regexpList1.length; ++regexpIndex) {
        let regexp = regexpList1[regexpIndex];
        let wordArr = getWordsMatching(dictArr, regexp.re);

        for (let wordIndex = 0; wordIndex < wordArr.length; ++ wordIndex) {
            if (wordArr[wordIndex].length > bestWord.length) {
                bestWord = wordArr[wordIndex];
                bestOption = {word:bestWord, row:regexp.row, col:regexp.col, dir:regexp.dir};
            }
        }
    }

    if (bestWord !== "") {
        insertWord(grid, bestOption.word, bestOption.row, bestOption.col, bestOption.dir);
        console.log(bestOption);
        console.log(grid);
    }

    return grid;
};

insertWord = (grid, word, row, col, dir) => {
    if (dir === "right") {
        grid[row][col-1] = "X";
        for(let wordIndex = 0; wordIndex < word.length; ++wordIndex) {
            grid[row][col+wordIndex] = word.charAt(wordIndex);
        }
        grid[row][col+word.length] = "X";
    } else {
        grid[row-1][col] = "X";
        for(let wordIndex = 0; wordIndex < word.length; ++wordIndex) {
            grid[row+wordIndex][col] = word.charAt(wordIndex);
        }
        grid[row+word.length][col] = "X";
    }
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
        if (line.length > maxLength)
            continue;
        let word = line.toLocaleUpperCase('tr-TR');
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
        ["X","I",".","E",".",".",".","X",".",".",".","X"],
        ["X","L",".","Y",".",".",".","M",".",".",".","X"],
        ["X","I",".","D",".","X",".","O",".",".",".","X"],
        ["X","Ç",".","A",".","E",".","D",".",".",".","X"],
        ["X","X","X","N","E","S","N","E","X",".",".","X"],
        ["X",".",".","X",".","M",".","M",".",".",".","X"],
        ["X",".",".",".",".","E",".","X",".",".",".","X"],
        ["X",".",".",".","X","R","Ö","T","Ü","Ş","X","X"],
        ["X",".",".",".",".","X",".",".",".",".",".","X"],
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

