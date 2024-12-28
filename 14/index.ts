import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog';
import { printMap, forEachMap } from '../utils/maps';

function parseInput(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const data = input.split('\n')
        .filter(Boolean)
        .map((line: string) => {
            const [pos, vel] = line.split(' ')
                .map(part => part.substring(2).split(',').map(Number))
            return { 
                position: { x: pos[1], y: pos[0] },
                velocity: { x: vel[1], y: vel[0] },
             }
        })
    // parsing specific for the day
    return data;
}

const width = 101;
const height = 103;

function  calcPart1(robots: any[], step: number) {
    robots.forEach(({ position, velocity }, i) => {
        const x = ((position.x + velocity.x * step) % height + height) % height;
        const y = ((position.y + velocity.y * step) % width + width) % width;
        robots[i].resPosition = { x, y }
    })

    const quadrants = [0, 0 ,0 ,0];
    robots.forEach(({ resPosition }) => {
        if (resPosition.x < Math.floor(height / 2) && resPosition.y < Math.floor(width / 2)) {
            quadrants[0] += 1;
        }
        if (resPosition.x < Math.floor(height / 2) && resPosition.y > Math.floor(width / 2)) {
            quadrants[1] += 1;
        }
        if (resPosition.x > Math.floor(height / 2) && resPosition.y < Math.floor(width / 2)) {
            quadrants[2] += 1;
        }
        if (resPosition.x > Math.floor(height / 2) && resPosition.y > Math.floor(width / 2)) {
            quadrants[3] += 1;
        }
    })
    return quadrants.reduce((acc, curr) => acc * curr, 1)
}

export function solvePartOne(inputFileName: string) {
    const parsed = parseInput(inputFileName)

   return calcPart1(parsed, 100);
}

export function solvePartTwo(inputFileName: string) {
    const robots: any[] = parseInput(inputFileName)
    loop: for (let i = 0; i < 10000; i++) {
        const positionMap: any = {};
        for (let r = 0; r < robots.length; r++) {
            const { position, velocity } = robots[r];
            const x = ((position.x + velocity.x * i) % height + height) % height;
            const y = ((position.y + velocity.y * i) % width + width) % width;
            robots[r].resPosition = { x, y }
            if (positionMap[`${x}:${y}`]) {
                continue loop;
            }
            positionMap[`${x}:${y}`] = true;
        }
        return i;
    }
    
    return null
}



runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));