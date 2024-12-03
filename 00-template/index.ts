import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog'
;
function parseInput(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const data = input.split('\n')
        .filter(Boolean)
    // parsing specific for the day
    return data;
}

export function solvePartOne(inputFileName: string) {
    const parsed = parseInput(inputFileName)
    // solve part 1
    return null
}

export function solvePartTwo(inputFileName: string) {
    const parsed = parseInput(inputFileName)
    // solve part 2
    return null
}



runMeasureLog(() => solvePartOne('input_example.txt'), () => solvePartTwo('input.txt'));