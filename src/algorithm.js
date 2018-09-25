const sizeOfBlock = 64; // Unicode=16, 4 symbols
const sizeOfChar = 16; // Unicode=16
const lengthOfBlock = sizeOfBlock / sizeOfChar;
const quantityOfRounds = 16;

const keyShifts = "1	1	2	2	2	2	2	2	1	2	2	2	2	2	2	1".split(/\s+/);
const keyShiftsReversed = "0	1	2	2	2	2	2	2	1	2	2	2	2	2	2	1".split(/\s+/);

const Etable =
    `32	1	2	3	4	5
4	5	6	7	8	9
8	9	10	11	12	13
12	13	14	15	16	17
16	17	18	19	20	21
20	21	22	23	24	25
24	25	26	27	28	29
28	29	30	31	32	1`.split(/\s+/);

const Ptable =
    `16	7	20	21	29	12	28	17
1	15	23	26	5	18	31	10
2	8	24	14	32	27	3	9
19	13	30	6	22	11	4	25`.split(/\s+/);

const IPTable =
    `58	50	42	34	26	18	10	2	60	52	44	36	28	20	12	4
62	54	46	38	30	22	14	6	64	56	48	40	32	24	16	8
57	49	41	33	25	17	9	1	59	51	43	35	27	19	11	3
61	53	45	37	29	21	13	5	63	55	47	39	31	23	15	7`.split(/\s+/);

const IPReversedTable =
    `40	8	48	16	56	24	64	32	39	7	47	15	55	23	63	31
38	6	46	14	54	22	62	30	37	5	45	13	53	21	61	29
36	4	44	12	52	20	60	28	35	3	43	11	51	19	59	27
34	2	42	10	50	18	58	26	33	1	41	9	49	17	57	25`.split(/\s+/);

const keyIPTable =
    `57	49	41	33	25	17	9	1	58	50	42	34	26	18
10	2	59	51	43	35	27	19	11	3	60	52	44	36
63	55	47	39	31	23	15	7	62	54	46	38	30	22
14	6	61	53	45	37	29	21	13	5	28	20	12	4`.split(/\s+/);

const ithKeyTable =
    `14	17	11	24	1	5	3	28	15	6	21	10	23	19	12
26	8	16	7	27	20	13	2	41	52	31	37	47	55	30
51	45	33	48	44	49	39	56	34	53	46	42	50	36	29`.split(/\s+/);

const Stables = [
    [
        "14	4	13	1	2	15	11	8	3	10	6	12	5	9	0	7".split(/\s+/),
        "0	15	7	4	14	2	13	1	10	6	12	11	9	5	3	8".split(/\s+/),
        "4	1	14	8	13	6	2	11	15	12	9	7	3	10	5	0".split(/\s+/),
        "15	12	8	2	4	9	1	7	5	11	3	14	10	0	6	13".split(/\s+/),
    ],
    [
        "15	1	8	14	6	11	3	4	9	7	2	13	12	0	5	10".split(/\s+/),
        "3	13	4	7	15	2	8	14	12	0	1	10	6	9	11	5".split(/\s+/),
        "0	14	7	11	10	4	13	1	5	8	12	6	9	3	2	15".split(/\s+/),
        "13	8	10	1	3	15	4	2	11	6	7	12	0	5	14	9".split(/\s+/),
    ],
    [
        "10	0	9	14	6	3	15	5	1	13	12	7	11	4	2	8".split(/\s+/),
        "13	7	0	9	3	4	6	10	2	8	5	14	12	11	15	1".split(/\s+/),
        "13	6	4	9	8	15	3	0	11	1	2	12	5	10	14	7".split(/\s+/),
        "1	10	13	0	6	9	8	7	4	15	14	3	11	5	2	12".split(/\s+/),
    ],
    [
        "7	13	14	3	0	6	9	10	1	2	8	5	11	12	4	15".split(/\s+/),
        "13	8	11	5	6	15	0	3	4	7	2	12	1	10	14	9".split(/\s+/),
        "10	6	9	0	12	11	7	13	15	1	3	14	5	2	8	4".split(/\s+/),
        "3	15	0	6	10	1	13	8	9	4	5	11	12	7	2	14".split(/\s+/)
    ],
    [
        "2	12	4	1	7	10	11	6	8	5	3	15	13	0	14	9".split(/\s+/),
        "14	11	2	12	4	7	13	1	5	0	15	10	3	9	8	6".split(/\s+/),
        "4	2	1	11	10	13	7	8	15	9	12	5	6	3	0	14".split(/\s+/),
        "11	8	12	7	1	14	2	13	6	15	0	9	10	4	5	3".split(/\s+/),
    ],
    [
        "12	1	10	15	9	2	6	8	0	13	3	4	14	7	5	11".split(/\s+/),
        "10	15	4	2	7	12	9	5	6	1	13	14	0	11	3	8".split(/\s+/),
        "9	14	15	5	2	8	12	3	7	0	4	10	1	13	11	6".split(/\s+/),
        "4	3	2	12	9	5	15	10	11	14	1	7	6	0	8	13".split(/\s+/),
    ],
    [
        "4	11	2	14	15	0	8	13	3	12	9	7	5	10	6	1".split(/\s+/),
        "13	0	11	7	4	9	1	10	14	3	5	12	2	15	8	6".split(/\s+/),
        "1	4	11	13	12	3	7	14	10	15	6	8	0	5	9	2".split(/\s+/),
        "6	11	13	8	1	4	10	7	9	5	0	15	14	2	3	12".split(/\s+/),
    ],
    [
        "13	2	8	4	6	15	11	1	10	9	3	14	5	0	12	7".split(/\s+/),
        "1	15	13	8	10	3	7	4	12	5	6	11	0	14	9	2".split(/\s+/),
        "7	11	4	1	9	12	14	2	0	6	10	13	15	3	5	8".split(/\s+/),
        "2	1	14	7	4	10	8	13	15	12	9	0	3	5	6	11".split(/\s+/),
    ],
];

console.log();

function expandString(str) {
    while (((str.length * sizeOfChar) % sizeOfBlock) != 0) {
        str += "%";
    }

    return str;
}

function keyToBlocks(keyStr, textBinaryLength) {
    keyStr = strToBinary(keyStr, sizeOfChar);
    if(keyStr.length < 56) {
        keyStr = expandLeftZero(keyStr, 56);
    }

    let textBlocksCount = textBinaryLength / 64;
    let keyBlocks = keyStr.match(/.{56}/g);
    for(let i = 0; keyBlocks.length < textBlocksCount; i++) {
        keyBlocks.push(keyBlocks[i]);
    }

    return keyBlocks;
}

function expandLeftZero(str, lenNeeded) {
    // add zeros at the beginning until it's of needed size
    while (str.length < lenNeeded) {
        str = "0" + str;
    }

    return str;
}

function splitBlocks(str) {
    let blocks = [];
    for (let i = 0; i < str.length / lengthOfBlock; i++) {
        let block = str.substr(i * lengthOfBlock, lengthOfBlock);
        blocks[i] = strToBinary(block, sizeOfChar);
    }

    return blocks;
}

function splitBlocksBinary(str) {
    let blocks = [];
    let size = str.length / sizeOfBlock;
    for (let i = 0; i < size; i++) {
        blocks[i] = str.substr(i * sizeOfBlock, sizeOfBlock);
    }

    return blocks;
}

function splitInTwo(block) {
    return [
        block.slice(0, block.length / 2),
        block.slice(block.length / 2, block.length)
    ];
}

function strToBinary(str, size) {
    return codesToBinary(str.split('').map(x => x.charCodeAt(0)), size);
}

function codesToBinary(codes, size) {
    let output = "";

    for (let i = 0; i < codes.length; i++) {
        let charBinary = codes[i].toString(2);
        charBinary = expandLeftZero(charBinary, size);

        output += charBinary;
    }

    return output;
}

function fromBinary(str) {
    let regex = new RegExp(`.{${sizeOfChar}}`, "g");
    let charCodesBinary = str.match(regex);
    let charCodes = charCodesBinary.map(x => parseInt(x, 2));
    // let chars = charCodes.map(String.fromCharCode);

    return charCodes.join(', ');
}

// -------------------------------------

function runDESEncode(str, key) {
    str = expandString(str);
    // str = toBinary(str); not needed, is inside of split 
    let blocks = splitBlocks(str);
    blocks = blocks.map(IP);

    let keys = keyToBlocks(key, blocks.length * 64);
    for(let i = 0; i < keys.length; i++) {
        keys[i] = extendKeyUnevenBits(keys[i]);
    }

    let textBinary = DESEncode(blocks, keys);
    let resultText = fromBinary(textBinary, sizeOfChar / 2);

    return resultText;
}

function runDESDecode(strCodes, key) {
    // str = expandString(str);
    let strBinary = codesToBinary(strCodes, sizeOfChar);
    let blocks = splitBlocksBinary(strBinary);
    blocks = blocks.map(IP);

    let keys = keyToBlocks(key, blocks.length * 64);
    for(let i = 0; i < keys.length; i++) {
        keys[i] = extendKeyUnevenBits(keys[i]);
    }

    let resultTextBinary = DESDecode(blocks, keys);
    // for 64 = 16 x 4 = 4 chars
    let resultCodes = fromBinary(resultTextBinary).split(',');
    let resultChars = resultCodes.map(x => String.fromCharCode(x));
    let resultText = resultChars.join('');
    return resultText;
}

// -----------------------------------

function DESEncode(blocks, originalKeys) {
    console.log('\nENTROPY MEASURES\n');
    let [keyLeft, keyRight] = splitInTwo(keyIPTable);
    let key;
    // let key = keyLeft.concat(keyRight).map(i => originalKey[i]);
    for (let i = 0; i < 16; i++) {
        let entrops = [];
        [keyLeft, keyRight] = shiftKeysLeft(keyLeft, keyRight, i);
        for (let j = 0; j < blocks.length; j++) {
            let ithKeyPerm = keyLeft.concat(keyRight).map(i => originalKeys[j][i]);
            key = ithKey(ithKeyPerm);
            let block = blocks[j];
            entrops.push(entropy(block));
            let [left, right] = splitInTwo(block);
            [left, right] = encodeRound(left, right, key);
            blocks[j] = left.concat(right);
        }
        console.log(`${i + (i >= 10 ? '' : ' ')}: ` + entrops.map(x => x.toFixed(2)).join('|'));
    }
    let entrops = [];
    for (let j = 0; j < blocks.length; j++) {
        entrops.push(entropy(blocks[j]));
    }
    console.log(`16: ` + entrops.map(x => x.toFixed(2)).join('|'));

    let text = blocks.map(x => IPReversed(x).join('')).join('');

    return text;
}

function DESDecode(blocks, originalKey) {
    let [keyLeft, keyRight] = splitInTwo(keyIPTable);
    let key;
    // let key = keyLeft.concat(keyRight).map(i => originalKey[i]);
    for (let i = 0; i < 16; i++) {
        [keyLeft, keyRight] = shiftKeysRight(keyLeft, keyRight, i);
        for (let j = 0; j < blocks.length; j++) {
            let ithKeyPerm = keyLeft.concat(keyRight).map(i => originalKey[j][i]);
            key = ithKey(ithKeyPerm);   
            let block = blocks[j];
            let [left, right] = splitInTwo(block);
            [left, right] = decodeRound(left, right, key);
            blocks[j] = left.concat(right);
        }
    }
    let text = blocks.map(x => IPReversed(x).join('')).join('');

    return text;
}

function encodeRound(left, right, key) {
    // left, right = 32bit each
    let tmp = right;
    right = XOR(left, f(right, key));
    left = tmp;

    return [left, right];
}

function decodeRound(left, right, key) {
    let tmp = left;
    left = XOR(right, f(left, key));
    right = tmp;

    return [left, right];
}

function f(right, key) {
    let rightExpanded = E(right);
    let result = XOR(rightExpanded, key).join('');

    // split into 6-bit blocks
    let bBlocks = result.match(/.{6}/g);
    result = S(bBlocks).join('');

    result = P(result);

    return result;
}

function extendKeyUnevenBits(str) {
    // split each 7 characters
    let bytes = str.match(/.{7}/g);
    for (let i = 0; i < bytes.length; i++) {
        // let ones = bytes[i].split('').reduce((acc, x) => acc + parseInt(x), 0);
        // [] - in case we have all 0s
        let ones = (bytes[i].match(/1/g) || []).length;
        bytes[i] += ones % 2 == 0 ? 1 : 0;
    }

    return bytes.join('');
}

function keyIP(str) {
    return keyIPTable.map(i => str[i - 1]);
}

function ithKey(str) {
    return ithKeyTable.map(i => str[i - 1]);
}

function IP(str) {
    return IPTable.map(i => str[i - 1]);
}

function IPReversed(str) {
    return IPReversedTable.map(i => str[i - 1]);
}

// tables are 1-based
function E(str) {
    return Etable.map(i => str[i - 1]);
}

function P(str) {
    return Ptable.map(i => str[i - 1]);
}

function S(bBlocks) {
    // b-block = 6bit
    // result-b-block = 4bit 
    let resultBlocks = [];
    for (let i = 0; i < bBlocks.length; i++) {
        let block = bBlocks[i];

        let a = block[0] + block[block.length - 1];
        let b = block.substring(1, block.length - 1);
        a = parseInt(a, 2);
        b = parseInt(b, 2);

        // binary representation
        let resultBlock = parseInt(Stables[i][a][b]).toString(2);
        resultBlock = expandLeftZero(resultBlock, 4);
        resultBlocks.push(resultBlock);
    }

    return resultBlocks;
}

function shiftKeysLeft(left, right, i) {
    left = shiftArray(left, -keyShifts[i]);
    right = shiftArray(right, -keyShifts[i]);

    return [left, right];
}

function shiftKeysRight(left, right, i) {
    left = shiftArray(left, keyShiftsReversed[i]);
    right = shiftArray(right, keyShiftsReversed[i]);

    return [left, right];
}

function shiftArray(key, len) {
    while (len > 0) {
        key.unshift(key.pop());
        len--;
    }
    while (len < 0) {
        key.push(key.shift());
        len++;
    }

    return key;
}

function XOR(left, right) {
    result = [];
    for (let i = 0; i < left.length; i++) {
        result[i] = left[i] == right[i] ? "0" : "1";
    }

    return result;
}

function entropy(block) {
    // block = 64 bit
    let onesCount = 0;
    for (let i = 0; i < block.length; i++) {
        if (block[i] == "1") {
            onesCount++;
        }
    }
    let pOne = onesCount / block.length;
    let pZero = 1 - pOne;

    let entrop = -1 * (pOne * Math.log2(pOne) + pZero * Math.log2(pZero));

    return entrop;
}