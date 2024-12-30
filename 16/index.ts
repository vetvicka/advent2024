import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog';
import { forEachMap, Point, printMap } from '../utils/maps';

function parseInput(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const map = input.split('\n')
        .map(line => line.split(''))
        .filter(Boolean)
    // parsing specific for the day
    return map;
}

const directionNames = ['Up', 'Right', 'Down', 'Left'] as const;

const directionNameToDirection = {
    'Up':       { x: -1, y: 0 , name: 'Up'},
    'Right':    { x: 0, y: 1 , name: 'Right'},
    'Down':     { x: 1, y: 0 , name: 'Down'},
    'Left':     { x: 0, y: -1 , name: 'Left'},
} as const;

const directions = directionNames.map(name => directionNameToDirection[name]);


function nodeId(position: Point, direction: typeof directionNames[number]) {
    const { x, y } = position;
    return `${x}-${y}-${direction}`;
}

function getRotations(direction: typeof directionNames[number]) {
    const index = directionNames.indexOf(direction);
    return [
        directionNames[(index + 1) % 4],
        directionNames[(index + 3) % 4],
    ];
}

const visitedNodes = new Set();
const distances = new Map();
const unvisitedNodes = new Set();
const predecessors: Record<string, string[]> = {};

function getAvailableNodes(map: string[][], position: Point, direction: typeof directionNames[number]) {
    const distance = distances.get(nodeId(position, direction));
    const rotations = getRotations(direction).map(d => nodeId(position, d)).filter(n => !visitedNodes.has(n));
    rotations.forEach(r => {
        const newDist = distance + 1000;
        const oldDist = distances.get(r);
        if (!oldDist || oldDist >= newDist) {
            distances.set(r, newDist)
            if (!predecessors[r] || oldDist > newDist) {
                predecessors[r] = []
            }
            predecessors[r].push(nodeId(position, direction));
        }
    });
    const res = [ ...rotations ];
    const { x: dx, y: dy } = directionNameToDirection[direction];
    const x = position.x + dx;
    const y = position.y + dy;
    if (map[x][y] === '.') {
        const id = nodeId({ x, y }, direction);
        res.push(id);
        const newDist = distance + 1;
        const oldDist = distances.get(id);
        if (!oldDist || oldDist >= newDist) {
            distances.set(id, newDist)
            if (!predecessors[id] || oldDist > newDist) {
                predecessors[id] = []
            }
            predecessors[id].push(nodeId(position, direction));
        }
    }
    return res;
}

function nodeIdToData(id: string) {
    const [x, y, direction] = id.split('-');
    return { x: Number(x), y: Number(y), name: direction as typeof directionNames[number] };
}

function getClosestNode() {
    let closest = null;
    for (const n of unvisitedNodes) {
        if (closest === null) {
            closest = n;
            continue;
        }
        const closestDistance = distances.get(closest);
        const nDistance = distances.get(n)
        if (nDistance < closestDistance) {
            closest = n
        }
    }
    return closest;
}

function markPath(map: string[][], end: string) {
    let current = end;
    const { x, y } = nodeIdToData(current);
    map[x][y] = 'o';
    if (!predecessors[current]) {
        // console.log('way way', current)
        return;
    }
    // if (map[x][y] === 'o') {
    //     console.log('wasdadsa');
    //     return;
    // }
    
    const preds = predecessors[current];
    predecessors[current] = []
    preds
    .forEach(c => markPath(map, c));
}

let part2: number = 0;
export function solvePartOne(inputFileName: string) {
    const map = parseInput(inputFileName)
    
    // printMap(map)
    const startX = map.length - 2;
    const startY = 1;
    const start = nodeId({ x: startX, y: startY }, 'Right');
    distances.set(start, 0);
    visitedNodes.add(start);
    let current = start;
    let cnt = 0;
    let result = null;
    while (true) {
        // if (cnt === 2000000) {
        //     return;
        // }
        cnt += 1;
        const currentData = nodeIdToData(current);
        const neighbours = getAvailableNodes(map, currentData, currentData.name);
        neighbours.forEach(n => unvisitedNodes.add(n));
        const closest = getClosestNode();
        if (!closest) {
            break;
        }
        // console.log('neig‹hbours', unvisitedNodes.size, neighbours, neighbours.map(n => distances.get(n)), closest)
        current = closest as string;
        
        // if (current.startsWith(`1-`)) {
        //     console.log('hey WTF
        //         !', distances.get(closest))
        // }
        if (current.startsWith(`1-${map[0].length - 2}`) && !result) {
            result = distances.get(closest);
            // console.log('YAAAAAAY!', distances.get(closest))
            // results.push(distances.get(closest))
            // if(results.length > 3) {
            //     console.log('OMG!!', results)
            //     return;
            // }
            // markPath(map, current)
            // printMap(map)
            // console.log(distances)
            // return distances.get(closest);
        }
        visitedNodes.add(current);
        unvisitedNodes.delete(current);
    }
    markPath(map, `1-${map[0].length - 2}-Up`)
    forEachMap(map, e => e === 'o' ? part2 += 1 : null)
    // solve part 1
    return result
}

function traceBack(map: string[][], position: Point, direction: typeof directionNames[number], stack: string[] = []) {
    const { x, y } = position;
    map[x][y] = 'o';
    console.log('traceBack', position, direction)
    // find cheapest predecesors
    let candidates = []
    // lidear move backwards
    const index = directionNames.indexOf(direction);
    const oppositeDirection = directionNameToDirection[directionNames[(index + 2) % 4]];
    const { x: dx, y: dy } = oppositeDirection;
    const prev = nodeId({ x: x + dx, y: y + dy }, direction);
    if (map[x + dx][y + dy] !== '#') {
        candidates.push(prev);
    }

    const rots = getRotations(direction).map(d => nodeId(position, d));
    candidates.push(...rots);
    let min = Infinity;
    candidates.forEach(c => {
        if (distances.get(c) && min > distances.get(c)) {
            min = distances.get(c);
        }
    })
    if (min === 0) {
        console.log('ZERO DONE');
        return;
    }
    console.log('distances: ', min, candidates.map(c => distances.get(c)))
    candidates = candidates.filter(c => {
        return distances.get(c) === min && !stack.includes(c)
    })
    if (candidates.length > 1) {
        console.log('MAYBEEEEE', candidates)
    }
    candidates.forEach(c => {
        const data = nodeIdToData(c);
        traceBack(map, data, data.name, [...stack, nodeId(position, direction)])
    })
}

export function solvePartTwo(inputFileName: string) {
    const map = parseInput(inputFileName)
    // traceBack(map, { x: 1, y: map[0].length - 2 }, 'Up');
    // printMap(map)
    return part2;
}



runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));