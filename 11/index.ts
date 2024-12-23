import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog'
;
function parseInput(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const data = input.split(' ')
        .filter(Boolean)
    // parsing specific for the day
    return data;
}

const rules = [
    (stone: string) => stone === '0' ? '1' : null,
    (stone: string) => {
        if (stone.length % 2 !== 0) {
            return null;
        }
        const mid = stone.length / 2;
        return [stone.substring(0, mid), String(Number(stone.substring(mid)))];
    },
    (stone: string) => `${Number(stone) * 2024}`,
]

function applyRules(stone: string) {
    for (const rule of rules) {
        const result = rule(stone);
        if (result) {
            return result;
        }
    }
}

const memo = new Map<string, number>()

function calcStoneValue(stone:string, blinks: number) {
    if (blinks === 0) {
        return 1;
    }
    const key = `${stone}-${blinks}`
    if (memo.has(key)) {
        return memo.get(key) as number;
    }
    let tmp = [stone];
    tmp = tmp.flatMap(applyRules) as string[];
    const sum: number = tmp.reduce((acc, stone) => acc + calcStoneValue(stone, blinks - 1), 0)
    memo.set(key, sum)
    return sum;
}

export function solvePartOne(inputFileName: string) {
    let stones = parseInput(inputFileName)
    let sum = 0;
    const blinks = 25
    stones.forEach(stone => {
        sum += calcStoneValue(stone, blinks);
    })
    return sum
}

export function solvePartTwo(inputFileName: string) {
    let stones = parseInput(inputFileName)
    let sum = 0;
    const blinks = 75
    stones.forEach(stone => {
        sum += calcStoneValue(stone, blinks);
    })
    return sum
}



runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));