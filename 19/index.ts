import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog';

function parseInput(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const towels: string[] = [];
    const designs: string[] = [];
    input.split('\n')
        .filter(Boolean)
        .forEach(line => {
            if (line.includes(', ')) {
                towels.push(...line.split(', '))
            } else {
                designs.push(line);
            }
        })
    // parsing specific for the day
    return { towels, designs };
}

export function findMatchingTowels(towels: string[], pattern: string) {
    return towels.filter(towel => pattern.startsWith(towel));
}

const memory: Record<string, number> = {};

function solve(pattern: string, towels: string[], usedTowels: string[] = []): number {
    if (memory[pattern]) {
        return memory[pattern];
    }
    if (pattern === "") {
        return 1;
    }
    let sum = 0;
    // find all matching towels for the current index
    const matching = findMatchingTowels(towels, pattern);
    
    // recurse the matching towels
    const res: string[][] = [];
    matching.forEach(matching => {
        const subPattern = pattern.substring(matching.length);
        sum += solve(
            subPattern,
            towels.filter(t => subPattern.includes(t)),
        )
    });
    // profit
    memory[pattern] = sum;
    return sum;
}

export function solvePartOne(inputFileName: string) {
    const { towels, designs } = parseInput(inputFileName)
    return designs
        .map((design) => solve(design, towels) > 0 ? 1 : 0)
        .reduce((acc, c) => acc + c, 0 as number)
}


export function solvePartTwo(inputFileName: string) {
    const { towels, designs } = parseInput(inputFileName)
    const solutions = designs.map((design, i) => {
        const solution = solve(design, towels);
        return solution;
    })
    return solutions.reduce((acc, c) => acc + c)
}



runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));