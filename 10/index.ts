import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog';
import { directions, isInBounds, Point, forEachMap, printMap } from '../utils/maps';

function parseInput(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const data = input.split('\n')
        .map(line => line.split('').map(Number))
        .filter(Boolean)
    // parsing specific for the day
    return data;
}


type Map2D = number[][];
type Visited = Record<string, boolean>;


function traverseTrail(start: Point, map: Map2D, countUniqueTrails = false, elevation: number = -1, nineMap: Visited = {}, trace: Point[] = []) {
    if (!isInBounds(map, start)) {
        return 0;
    }
    const current = map[start.x][start.y];
    if(!countUniqueTrails && 
        nineMap[`${start.x}-${start.y}`]) {
        return 0;
    }
    if (current - elevation !== 1) {
        return 0;
    }
    if (current === 9) {
        nineMap[`${start.x}-${start.y}`] = true;
        return 1;
    }
    let sum = 0;
    directions.forEach(([dx, dy]) => {
        const s = { x: start.x + dx, y: start.y + dy };

        sum += traverseTrail(s, map, countUniqueTrails, current, nineMap, [...trace, start]);
    })
    return sum;
}

function sumScoresOfAllHeads(map: Map2D, countUniqueTrails: boolean) {
    const results: Array<{ point: Point, score: number }> = [];
    forEachMap(map, (el, point) => {
        if (el === 0) {
            const score = traverseTrail(point, map, countUniqueTrails)
            results.push({ point, score });
        }
    })

    return results.reduce((acc, { score }) => acc + score, 0);
}

export function solvePartOne(inputFileName: string) {
    const parsed = parseInput(inputFileName)
    return sumScoresOfAllHeads(parsed, false);
}

export function solvePartTwo(inputFileName: string) {
    const parsed = parseInput(inputFileName)
    return sumScoresOfAllHeads(parsed, true);
}



runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));