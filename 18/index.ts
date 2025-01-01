import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog';
import { dijkstra } from '../utils/dijkstra';

function parseInput(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const data = input.split('\n')
        .filter(Boolean)
        .map(line => line.split(',').map(Number))
        .map(([y, x]) => ({ x, y }));
    // parsing specific for the day
    return data;
}

function createEmptyMap(x: number, y: number) {
    return new Array(x).fill([]).map(() => new Array(y).fill('.'))
}



export function solvePartOne(inputFileName: string, bytes: number = 12) {
    const parsed = parseInput(inputFileName)
    const size = 71
    const map = createEmptyMap(size, size);
    for (let i = 0; i < bytes; i++) {
        const {x, y} = parsed[i];
        map[x][y] = '#';
    }
    const start = { x: 0, y: 0 };
    const end = { x: size - 1, y: size - 1 };
    const tmp = dijkstra(map, start, end);
    tmp?.trace.forEach(({ position }) => {
        map[position.x][position.y] = 'o';
    })

    return tmp?.distance;
}

export function solvePartTwo(inputFileName: string) {
    const parsed = parseInput(inputFileName)
    const size = 71
    const map = createEmptyMap(size, size);
    let bytes = 1024;
    for (let i = 0; i < bytes; i++) {
        const {x, y} = parsed[i];
        map[x][y] = '#';
    }
    for (let i = bytes; i < parsed.length; i++) {
        const {x, y} = parsed[i];
        map[x][y] = '#';
        const start = { x: 0, y: 0 };
        const end = { x: size - 1, y: size - 1 };
        const tmp = dijkstra(map, start, end);
        if (tmp === null) {
            return `${y},${x}`;
        }
    }
}



runMeasureLog(() => solvePartOne('input.txt', 1024), () => solvePartTwo('input.txt'));
