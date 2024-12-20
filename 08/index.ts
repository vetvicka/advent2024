import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog';
import { printMap, isInBounds } from '../utils/maps';

function parseInput(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const data = input.split('\n')
        .filter(Boolean)
        .map((line) => line.split(''));
    // parsing specific for the day
    return data;
}

function findAntennas(map: string[][]) {
    const antenasMap: Record<string, number[][]> = {};
    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[x].length; y++) {
            const cell = map[x][y];
            if (cell !== '.') {
                antenasMap[cell] = antenasMap[cell] || [];
                antenasMap[cell].push([x, y]);
            }
        }
    }
    return antenasMap;
}

function makePairs<T>(array: T[]) {
    const pairs = [];
    for (let i = 0; i < array.length - 1; i++) {
        for (let z = i + 1; z < array.length; z++) {
            pairs.push([array[i], array[z]]);
        }        
    }
    return pairs;
}

export function solvePartOne(inputFileName: string) {
    const map = parseInput(inputFileName)
    const antenasMap = findAntennas(map);
    const signalMap: Record<string, boolean> = {};
    for (const coordinates of Object.values(antenasMap)) {
        const pairs = makePairs(coordinates);
        pairs.forEach((pair) => {
            const first = pair[0];
            const second = pair[1];
            const diff: number[] = [first[0] - second[0], first[1] - second[1]];
            const candidateA = [first[0] + diff[0], first[1] + diff[1]];
            const candidateB = [second[0] - diff[0], second[1] - diff[1]];
    
            if (isInBounds(map, candidateA[0], candidateA[1])) {
                map[candidateA[0]][candidateA[1]] = '#';
                signalMap[`${candidateA[0]}-${candidateA[1]}`] = true;
            }
            if (isInBounds(map, candidateB[0], candidateB[1])) {
                map[candidateB[0]][candidateB[1]] = '#';
                signalMap[`${candidateB[0]}-${candidateB[1]}`] = true;
            }
        });
    }
    return Object.keys(signalMap).length;
}

function markNodes(map: string[][], signalMap: Record<string, boolean>, diff: number[], start: number[]) {
    const current = [...start];
    while(true) {
        signalMap[`${current[0]}-${current[1]}`] = true;
        const candidate = [current[0] + diff[0], current[1] + diff[1]];
        current[0] = candidate[0];
        current[1] = candidate[1];
        if (!isInBounds(map, current[0], current[1])) {
            break;
        }
    }
}

export function solvePartTwo(inputFileName: string) {
    const map = parseInput(inputFileName)
    const antenasMap = findAntennas(map);
    const signalMap: Record<string, boolean> = {};
    for (const coordinates of Object.values(antenasMap)) {
        const pairs = makePairs(coordinates);
        pairs.forEach((pair) => {
            const first = pair[0];
            const second = pair[1];
            const diff: number[] = [first[0] - second[0], first[1] - second[1]];
            markNodes(map, signalMap, diff, first);
            markNodes(map, signalMap, [-diff[0], -diff[1]], second);
        });
    }
    return Object.keys(signalMap).length;
}



runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));