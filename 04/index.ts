import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog'
;
function parseInput(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const data = input.split('\n')
        .filter(Boolean)
        .map(line => line.split(''))
    return data;
}

type Data = string[][];

const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
]

function isInBounds(data: Data, x: number, y: number) {
    return data[x] && data[x][y] !== undefined
}

function getWordInDirection(data: Data, x: number, y: number, direction: typeof directions[1]) {
    const letters = [];
    let xx = x;
    let yy = y;
    letters.push(data[xx][yy])
    for (let i = 0; i < 3; i++) {
        xx += direction[0];
        yy += direction[1];
        if (!isInBounds(data, xx, yy)) {
            return null;
        }
        letters.push(data[xx][yy]);
    }
    return letters.join('');
}

function isValidWord(word: string | null) {
    return word === 'XMAS';
}

function countXmas(data: Data, x: number, y: number): number {
    return directions.map(direction => {
        return isValidWord(getWordInDirection(data, x, y, direction)) ? 1 : 0 as number;
    }).reduce((acc, current) => acc + current)
}

export function solvePartOne(inputFileName: string) {
    const parsed = parseInput(inputFileName)
    let sum = 0;
    for (let x = 0; x < parsed.length; x++) {
        for (let y = 0; y < parsed[x].length; y++) {
            sum += countXmas(parsed, x, y);
        }
    }
    return sum
}

const diagonal1 = [
    [1, 1],
    [0, 0],
    [-1, -1],
];
const diagonal2 = [
    [-1, 1],
    [0, 0],
    [1, -1],
]
function isValidWord2(word: string) {
    return word === "MAS" || word === "SAM";
}
function getDiagonalWord(data: Data, x: number, y: number, directions: number[][]) {
    const word = [];
    for (let i = 0; i < directions.length; i++) {
        const [dx, dy] = directions[i];
        if (!isInBounds(data, x + dx, y + dy)) {
            return '';
        }
        word.push(data[x + dx][y + dy]);
    }
    return word.join('');
}
function isXmas(data: Data, x: number, y: number) {
    const wordA = getDiagonalWord(data, x, y, diagonal1);
    const wordB = getDiagonalWord(data, x, y, diagonal2);

    return isValidWord2(wordA) && isValidWord2(wordB);
}



export function solvePartTwo(inputFileName: string) {
    const parsed = parseInput(inputFileName)
    let sum = 0;
    for (let x = 0; x < parsed.length; x++) {
        for (let y = 0; y < parsed[x].length; y++) {
            if (isXmas(parsed, x, y)) {
                sum += 1
            }
        }
    }
    return sum
}



runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));