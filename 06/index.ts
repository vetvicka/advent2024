import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog';
import { printMap } from '../utils/maps';

function parseInput(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const data = input.split('\n')
        .filter(Boolean)
        .map(line => line.split(''))
    // parsing specific for the day
    return data;
}

const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
]

function changeDirection(direction: typeof directions[number]) {
    const index = directions.findIndex(([x, y]) => x === direction[0] && y === direction[1]);

    return directions[(index + 1) % directions.length];
}

function inBounds(map: string[][], x: number, y: number) {
    return map[x] && map[x][y] !== undefined;
}

function inObstacle(map: string[][], x: number, y: number) {
    return map[x][y] === '#';
}

function findStart(map: string[][]) {
    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[x].length; y++) {
            if (map[x][y] === '^') {
                return {x, y};
            }
        }
        const element = map[x];
    }
    throw new Error('invalid data')
}

function nextStep(x: number, y: number, direction: typeof directions[number]) {
    const [dx, dy] = direction;
    return [x + dx, y + dy];
}

function countSteps(map: string[][]) {
    let count = 0;
    map.forEach(row => {
        row.forEach(cell => {
            if (cell === 'X') {
                count++;
            }
        });
    });
    return count;
}

function testForLoop(map: string[][], ix: number, iy: number, direction: typeof directions[number]) {
    let [x, y] = [ix, iy];
    let currentDirection = direction;
    const pastPositionsMap: Record<string, boolean> = {};
    pastPositionsMap[`x${x}y${y}dx${currentDirection[0]}dy${currentDirection[1]}`] = true;
    try{
        let cnt = 0;
        while(true) {
            let [nx, ny] = nextStep(x, y, currentDirection);
            if (!inBounds(map, nx, ny)) {
                break;
            }
            if (pastPositionsMap[`x${nx}y${ny}dx${currentDirection[0]}dy${currentDirection[1]}`]) {
                throw new Error('loop detected');
            }
            if (inObstacle(map, nx, ny)) {
                currentDirection = changeDirection(currentDirection);
                continue;
            }
            x = nx;
            y = ny;
            if (!inBounds(map, x, y)) {
                break;
            }
            map[x][y] = 'Y';
            pastPositionsMap[`x${x}y${y}dx${currentDirection[0]}dy${currentDirection[1]}`] = true;
        }
    } catch (e) {
        return true;
    }
    return false;
}

export function solvePartOne(inputFileName: string) {
    const map = parseInput(inputFileName)
    let {x, y} = findStart(map);
    map[x][y] = 'X';
    let currentDirection = directions[0];
    let steps = 0;
    const pastPositionsMap: Record<string, boolean> = {};
    pastPositionsMap[`x${x}y${y}dx${currentDirection[0]}dy${currentDirection[1]}`] = true;
    while(true) {
        let [nx, ny] = nextStep(x, y, currentDirection);
        if (!inBounds(map, nx, ny)) {
            break;
        }
        if (inObstacle(map, nx, ny)) {
            currentDirection = changeDirection(currentDirection);
            continue;
        }
        if (pastPositionsMap[`x${nx}y${ny}dx${currentDirection[0]}dy${currentDirection[1]}`]) {
            throw new Error('loop detected');
        }
        x = nx;
        y = ny;
        if (!inBounds(map, x, y)) {
            break;
        }
        map[x][y] = 'X';
    }
    console.log('map', printMap(map))
    return countSteps(map);
}

export function solvePartTwo(inputFileName: string) {
    const map = parseInput(inputFileName)
    let {x, y} = findStart(map);
    const [ix, iy] = [x, y];
    map[x][y] = 'X';
    let currentDirection = directions[0];
    let loops = 0;
    const obstacleMap: Record<string, boolean> = {};
    obstacleMap[`x${x}y${y}`] = true;
    while(true) {
        let [nx, ny] = nextStep(x, y, currentDirection);
        if (!inBounds(map, nx, ny)) {
            break;
        }
        const copy = map.map(row => [...row]);
        if (copy[nx][ny] === '#') {
            obstacleMap[`x${nx}y${ny}`] = true;
        }
        copy[nx][ny] = '#';
        if (testForLoop(copy, ix, iy, directions[0])) {
            const copy = map.map(row => [...row]);
            copy[nx][ny] = 'O';
            if (!obstacleMap[`x${nx}y${ny}`]) {
                loops++;
                obstacleMap[`x${nx}y${ny}`] = true;
            }
        }
        if (inObstacle(map, nx, ny)) {
            currentDirection = changeDirection(currentDirection);
            continue;
        }
        x = nx;
        y = ny;
        if (!inBounds(map, x, y)) {
            break;
        }
        map[x][y] = 'X';
    }
    return loops;
}

runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));