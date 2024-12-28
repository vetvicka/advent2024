import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog';
import {
    Point, forEachMap, isInBounds, printMap, isUp, isDown, isRight, isLeft
} from '../utils/maps';

function parseInput(inputFileName: string, double: boolean = false) {
    const input = fs.readFileSync(`${__dirname}/${inputFileName}`, { encoding: 'utf8' });
    const map: string[][] = [];
    const instructions: string[] = [];
    const tileMap: Record<string, string[]> = {
        '#': '##'.split(''),
        'O': '[]'.split(''),
        '.': '..'.split(''),
        '@': '@.'.split('')
    };
    const doubleMap = (char: string) => double ? tileMap[char] : char;
    const data = input.split('\n')
        .filter(Boolean)
        .forEach((line) => {
            if (line.startsWith('#')) {
                map.push(line.split('').flatMap(doubleMap));
            } else {
                instructions.push(...line);
            }
        })
    // parsing specific for the day
    return { map, instructions };
}

function pushOnMap(map: string[][], start: Point, direction: Point, distance = 1, config = { wall: '#', moveable: 'O', empty: '.' }) {
    let obstacles = [];
    let position = start;
    let lastEmptySpace = start;
    let d = 0;
    if (map[start.x][start.y] !== config.empty) {
        throw new Error('Invalid start, was expecting empty space');
    }
    while (isInBounds(map, position) && map[position.x][position.y] !== config.wall) {
        const cell = map[position.x][position.y];
        if (cell === config.empty && d === 1) {
            return position;
        }
        if (cell === config.moveable) {
            obstacles.push(position);
        }
        if (cell === config.empty && obstacles.length > 0) {
            const { x, y } = obstacles.shift() as Point;
            map[x][y] = config.empty;
            map[position.x][position.y] = config.moveable;
            obstacles.push(position);
            lastEmptySpace = { x, y }
            return lastEmptySpace;
        }
        if (map[position.x][position.y] === config.empty) {
            lastEmptySpace = position;
        }
        position = { x: position.x + direction.x, y: position.y + direction.y };
        d += 1;
    }
    return lastEmptySpace;
}

function findOnMap(map: string[][], value: string) {
    for (let x = 0; x < map.length; x++) {
        const row = map[x];
        const y = row.indexOf(value);
        if (y !== -1) {
            return { x, y }
        }
    }
    // console.log('This is bullshit, lol', map)
    return null;
}

const instructionMap: Record<string, Point> = {
    '^': { x: -1, y: 0 },
    'v': { x: 1, y: 0 },
    '>': { x: 0, y: 1 },
    '<': { x: 0, y: -1 },
}

function canPushBigBlock(map: string[][], position: Point, direction: Point): boolean {
    const { x, y } = position;
    const pos = map[x][y];
    let blockPosition = [];
    if (pos === '[') {
        blockPosition = [position, { x, y: y + 1 }];
    } else if (pos === ']') {
        blockPosition = [{ x, y: y - 1 }, position];
    } else {
        throw new Error('I am here only for the big boys buddy.');
    }

    if (isUp(direction) || isDown(direction)) {
        return canPushSingle(map, blockPosition[0], direction) && canPushSingle(map, blockPosition[1], direction);
    }
    if (isLeft(direction)) {
        return canPushSingle(map, blockPosition[0], direction);
    }
    if (isRight(direction)) {
        return canPushSingle(map, blockPosition[1], direction);
    }
    throw new Error('Invalid direction');
}

function canPushSingle(map: string[][], position: Point, direction: Point) {
    const next = { x: position.x + direction.x, y: position.y + direction.y };
    if (!isInBounds(map, next)) {
        return false;
    }
    if (map[next.x][next.y] === '.') {
        return true;
    }
    if (map[next.x][next.y] === '#') {
        return false;
    }
    if (map[next.x][next.y] === '[' || map[next.x][next.y] === ']') {
        return canPushBigBlock(map, next, direction);
    }
    throw new Error('Invalid cell');
}

function pushEm(map: string[][], position: Point, direction: Point) {
    const next = { x: position.x + direction.x, y: position.y + direction.y };
    if (map[position.x][position.y] === '.') {
        return;
    }
    const { x, y } = position;
    const pos = map[x][y];
    let blockPosition: Point[] = [];
    if (pos === '[') {
        blockPosition = [position, { x, y: y + 1 }];
    } else if (pos === ']') {
        blockPosition = [{ x, y: y - 1 }, position];
    } else {
        console.log('This is bullshit', pos, position, direction);
    }

    const { x: dx, y: dy } = direction;
    const left = { x: blockPosition[0].x + dx, y: blockPosition[0].y + dy };
    const right = { x: blockPosition[1].x + dx, y: blockPosition[1].y + dy };
    if (isUp(direction) || isDown(direction)) {
        pushEm(map, left, direction);
        pushEm(map, right, direction);
    }
    if (isLeft(direction)) {
        pushEm(map, left, direction);
    }
    if (isRight(direction)) {
        pushEm(map, right, direction);
    }


    map[blockPosition[0].x + dx][blockPosition[0].y + dy] = '[';
    map[blockPosition[1].x + dx][blockPosition[1].y + dy] = ']';
    if (isUp(direction) || isDown(direction)) {
        map[blockPosition[0].x][blockPosition[0].y] = '.';
        map[blockPosition[1].x][blockPosition[1].y] = '.';
    }

    if (isLeft(direction)) {
        map[blockPosition[1].x][blockPosition[1].y] = '.';
    }

    if (isRight(direction)) {
        map[blockPosition[0].x][blockPosition[0].y] = '.';
    }
}

export function solvePartOne(inputFileName: string) {
    const { instructions, map } = parseInput(inputFileName)
    const start = findOnMap(map, '@');
    if (!start) {
        throw new Error('No start found');
    }
    map[start.x][start.y] = '.';
    let position = start;
    instructions.forEach((instruction) => {
        const direction = instructionMap[instruction];
        position = pushOnMap(map, position, direction);
    })
    let sum = 0;
    forEachMap(map, (cell, { x, y }) => {
        if (cell === 'O') {
            sum += x * 100 + y;
        }
    });
    return sum
}

export function solvePartTwo(inputFileName: string) {
    const { instructions, map } = parseInput(inputFileName, true)
    const start = findOnMap(map, '@');
    if (!start) {
        throw new Error('No start found');
    }
    map[start.x][start.y] = '.';
    let position = start;
    instructions.forEach((instruction) => {
        const direction = instructionMap[instruction];
        if (canPushSingle(map, position, direction)) {
            const next = { x: position.x + direction.x, y: position.y + direction.y };
            pushEm(map, next, direction);
            position = next;
        }
    })
    let sum = 0;
    forEachMap(map, (cell, { x, y }) => {
        if (cell === '[') {
            sum += x * 100 + y;
        }
    });
    return sum
}



runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));