import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog';

function parseInput(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const data = input.split('\n')
        .filter(Boolean)
        .map(line => {
            const [result, numbersText] = line.split(': ');
            const numbers = numbersText.split(' ').map(Number)
            return { result: Number(result), numbers: numbers }
        })
    // parsing specific for the day
    return data;
}

const operators = ['+', '*']

function generatePermutations(operators: string[], length: number) {
    if (length === 1) {
        return operators.map(op => [op])
    }
    const permutations = []
    const subPermutations: any = generatePermutations(operators, length - 1)
    for (const op of operators) {
        for (const subPermutation of subPermutations) {
            permutations.push([op, ...subPermutation])
        }
    }
    return permutations
}

console.log(generatePermutations(operators, 3))

function evaluateOperators(numbers: number[], operators: string[]) {
    let result = numbers[0];
    for (let i = 0; i < operators.length; i++) {
        const op = operators[i]
        const nextNumber = numbers[i + 1]
        if (op === '+') {
            result += nextNumber
        } else if (op === '*') {
            result *= nextNumber
        }
        else if (op === '||') {
            result = Number(String(result) + String(nextNumber))
        }
    }
    return result
}



export function solvePartOne(inputFileName: string) {
    const data = parseInput(inputFileName)
    let result = 0;
    data.forEach(({ result: expected, numbers }) => {
        const permutations = generatePermutations(operators, numbers.length - 1)
        for (const permutation of permutations) {
            const evaluation = evaluateOperators(numbers, permutation)
            if (evaluation === expected) {
                result += expected
                break
            }
        }
    });
    return result
}

const operators2 = ['+', '*', '||'];

export function solvePartTwo(inputFileName: string) {
    const data = parseInput(inputFileName)
    let result = 0;
    data.forEach(({ result: expected, numbers }) => {
        const permutations = generatePermutations(operators2, numbers.length - 1)
        for (const permutation of permutations) {
            const evaluation = evaluateOperators(numbers, permutation)
            if (evaluation === expected) {
                result += expected
                break
            }
        }
    });
    return result
}



runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));