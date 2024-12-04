import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog'

function parseInput(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const regex = /^mul\(\d\d?\d?,\d\d?\d?\)$/
    const data = input.replaceAll('mul(', '\nmul(')
        .replaceAll(')', ')\n')
        .split('\n')
        .filter(Boolean)
        .filter(line => regex.test(line))
        .map(line => line.replace('mul(', '').replace(')', '').split(',').map(Number))
    return data;
}

function parseInput2(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const regex = /^mul\(\d\d?\d?,\d\d?\d?\)$/
    const data = input.replaceAll('mul(', '\nmul(')
        .replaceAll(')', ')\n')
        .replaceAll('don\'t()', '\ndon\'t()\n')
        .replaceAll('do()', '\ndo()\n')
        .split('\n')
        .filter(Boolean);
    const filtered: string[] = [];
    let enabled = true;
    data.forEach(line => {
        if (line === 'do()') {
            enabled = true;
        }
        if (line === 'don\'t()') {
            enabled = false;
        }
        if (enabled) {
            filtered.push(line);
        }
    })
    return filtered
        .filter(line => regex.test(line))
        .map(line => line.replace('mul(', '').replace(')', '').split(',').map(Number))
}

export function solvePartOne(inputFileName: string) {
    const parsed = parseInput(inputFileName)
    const result = parsed.reduce((acc, [a, b]) => acc + a * b, 0)
    return result
}

export function solvePartTwo(inputFileName: string) {
    const parsed = parseInput2(inputFileName)
    const result = parsed.reduce((acc, [a, b]) => acc + a * b, 0)
    return result
}



runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));