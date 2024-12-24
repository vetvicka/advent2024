import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog';
import { printMap, Point, directions, isInBounds, forEachMap } from '../utils/maps';


function parseInput(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const data = input.split('\n')
        .map(line => line.split(''))
        .filter(Boolean)
    return data;
}

function traverseRegion(map: string[][], start: Point, plant: string, visited: Map<string, boolean> = new Map()) {
    if (!isInBounds(map, start)) {
        return null;
    }
    if (map[start.x][start.y] !== plant) {
        return null;
    }
    const key = `${start.x}-${start.y}`;
    if (visited.has(key)) {
        return null;
    }
    visited.set(key, true);
    let area = 1;
    let perimeter = 0;
    directions.forEach(([dx, dy]) => {
        const x = start.x + dx;
        const y = start.y + dy;
        if (!isInBounds(map, {x, y}) || map[x][y] !== plant) {
            perimeter += 1;
        }
        const directionResult = traverseRegion(map, {x, y}, plant, visited);
        if (directionResult) {
            area += directionResult.area;
            perimeter += directionResult.perimeter;
        }
    })
    return { area, perimeter };
}

export function solvePartOne(inputFileName: string) {
    const map = parseInput(inputFileName)
    const visited = new Map<string, boolean>();
    const results: { area: number, perimeter: number }[] = [];
    forEachMap(map, (el, point) => {
        if (visited.has(`${point.x}-${point.y}`)) {
            return;
        }
        const result = traverseRegion(map, point, el, visited);
        if (result) {
            results.push(result);
        }
    })
    return results.reduce((acc, { area, perimeter }) => acc + area * perimeter, 0);
}

function traverseRegion2(map: string[][], start: Point, plant: string, visited: Map<string, boolean> = new Map(), countedSides: Map<string, boolean> = new Map()) {
    if (!isInBounds(map, start)) {
        return null;
    }
    if (map[start.x][start.y] !== plant) {
        return null;
    }
    const key = `${start.x}-${start.y}`;
    if (visited.has(key)) {
        return null;
    }
    visited.set(key, true);
    let area = 1;
    let perimeter = 0;
    directions.forEach(([dx, dy], directionIndex) => {
        const x = start.x + dx;
        const y = start.y + dy;
        if ((!isInBounds(map, {x, y}) || map[x][y] !== plant) && !countedSides.has(`${start.x}-${start.y}-${dx}-${dy}`)) {
            perimeter += 1;
            const sides = [];
            countedSides.set(`${start.x}-${start.y}-${dx}-${dy}`, true);
            sides.push(`${start.x}-${start.y}-${dx}-${dy}`);
            const directionA = directions[(directionIndex + 3) % 4];
            const directionB = directions[(directionIndex + 1) % 4];
            let xA = start.x + directionA[0];
            let yA = start.y + directionA[1];
            while (isInBounds(map, {x: xA, y: yA}) && map[xA][yA] === plant) {
                const xx = xA + dx;
                const yy = yA + dy;
                if (map[xx] && map[xx][yy] === plant) {
                    break;
                }
                countedSides.set(`${xA}-${yA}-${dx}-${dy}`, true);
                sides.push(`${xA}-${yA}-${dx}-${dy}`);
                xA += directionA[0];
                yA += directionA[1];
            }
            let xB = start.x + directionB[0];
            let yB = start.y + directionB[1];
            while (isInBounds(map, {x: xB, y: yB}) && map[xB][yB] === plant) {
                const xx = xB + dx;
                const yy = yB + dy;
                if (map[xx] && map[xx][yy] === plant) {
                    break;
                }
                countedSides.set(`${xB}-${yB}-${dx}-${dy}`, true);
                sides.push(`${xB}-${yB}-${dx}-${dy}`);
                xB += directionB[0];
                yB += directionB[1];
            }
        }
        const directionResult = traverseRegion2(map, {x, y}, plant, visited, countedSides);
        if (directionResult) {
            area += directionResult.area;
            perimeter += directionResult.perimeter;
        }
    })
    return { area, perimeter };
}

export function solvePartTwo(inputFileName: string) {
    const map = parseInput(inputFileName)
    const visited = new Map<string, boolean>();
    const results: { area: number, perimeter: number }[] = [];
    forEachMap(map, (el, point) => {
        if (visited.has(`${point.x}-${point.y}`)) {
            return;
        }
        const result = traverseRegion2(map, point, el, visited);
        if (result) {
            results.push(result);
        }
    })

    return results.reduce((acc, { area, perimeter }) => acc + area * perimeter, 0);
}



runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));