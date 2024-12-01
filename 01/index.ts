import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog'
;
function parseInput(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const data = input.split('\n')
        .filter(Boolean)
        .map(line => line.split('   '));
    const arr1: number[] = [];
    const arr2: number[] = [];
    data.forEach(([a, b]) => {
        arr1.push(parseInt(a));
        arr2.push(parseInt(b));
    })
    arr1.sort();
    arr2.sort();
    return [arr1, arr2];
}

export function solvePartOne(inputFileName: string) {
    const [arr1, arr2] = parseInput(inputFileName)
    let sum = 0;
    for (let i = 0; i < arr1.length; i++) {
        const a = arr1[i];
        const b = arr2[i];
        const diff = Math.abs(b - a);
        sum += diff;
    }
    return sum
}

export function solvePartTwo(inputFileName: string) {
    const [arr1, arr2] = parseInput(inputFileName)
    const similarityMap: Record<number, number> = {};
    let sum = 0;
    for (let i = 0; i < arr1.length; i++) {
        const a = arr1[i];
        if (similarityMap[a] === undefined) { 
            similarityMap[a] = a * arr2.reduce((acc, current) => current === a ? acc + 1 : acc, 0)
        }
        sum += similarityMap[a];
    }
    return sum
}



runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));