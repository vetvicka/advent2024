import fs from 'fs';
import { create, all } from 'mathjs'

import { runMeasureLog } from '../utils/runMeasureLog';
import { Point } from '../utils/maps';

type Machine = {
    A: Point,
    B: Point,
    Prize: Point,
};

function parseInput(inputFileName: string, modifier = 0) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const machines: Machine[] = [];
    let partialMachine: Partial<Machine> = {}
    input.split('\n')
        .filter(Boolean)
        .forEach((line, index) => {
            if (line.includes('Button A:')) {
                const x = Number(line.substring(12, 14));
                const y = Number(line.substring(18));
                partialMachine.A = { x, y };
            } else if (line.includes('B:')) {
                const x = Number(line.substring(12, 14));
                const y = Number(line.substring(18));
                partialMachine.B = { x, y };
            } else if (line.includes('Prize:')) {
                const coords = line.split('Prize: ')[1];
                const xy = coords.split(', ');
                const x = Number(xy[0].substring(2)) + modifier;
                const y = Number(xy[1].substring(2)) + modifier;
                partialMachine.Prize = { x, y };
                machines.push(partialMachine as Machine);
                partialMachine = {};
            }
        })
    // parsing specific for the day
    return machines;
}

function maximumPushes(machine: Machine) {
    const { A, B, Prize } = machine;
    const xMax = Math.floor(Prize.x / A.x)
    const yMax = Math.floor(Prize.y / A.y)

    return Math.min(xMax, yMax);
}

function tryPushes(machine: Machine) { 
    const maxPushes = maximumPushes(machine);
    const possiblePushes = [];
    for (let a = 0; a <= maxPushes; a++) { 
        let tmpX = machine.A.x * a;
        let tmpY = machine.A.y * a;
        let b = 0;
        if (tmpX === machine.Prize.x && tmpY === machine.Prize.y) { 
            possiblePushes.push({ a, b });
        }
        while(tmpX < machine.Prize.x && tmpY < machine.Prize.y) { 
            tmpX += machine.B.x;
            tmpY += machine.B.y;
            b += 1;
            if (tmpX === machine.Prize.x && tmpY === machine.Prize.y) { 
                possiblePushes.push({ a, b });
            }
        }
    }
    return possiblePushes;
}

function pushCost({ a, b }: { a: number, b: number }) { 
    return a * 3 + b
    ;
}

function findChepestPush(pushes: { a: number, b: number }[]) {
    if (pushes.length === 0) return null;
    let minPush = pushes[0];
    pushes.forEach((push) => {
        if (pushCost(push) < pushCost(minPush)) {
            minPush = push;
        }
    })
    return minPush;

}

export function solvePartOne(inputFileName: string) {
    const parsed = parseInput(inputFileName)
    const pushes = parsed.map(tryPushes);
    const sum = pushes.reduce((acc, curr) => {
        const chepest = findChepestPush(curr);
        if (chepest) {
            return acc + pushCost(chepest);
        }
        return acc;
    }, 0);
    return sum;
}

// fuck it
const math = create(all, { number: 'BigNumber', precision: 64 })
function solveSystemOfEquations(machine: Machine) {
    const A = [
        [math.bignumber(machine.A.x), math.bignumber(machine.B.x)],
        [math.bignumber(machine.A.y), math.bignumber(machine.B.y)]
    ]
    const B = [math.bignumber(machine.Prize.x), math.bignumber(machine.Prize.y)]
    const solutions: any = math.lusolve(A, B)

    const delta = 0.0001;
    const a = solutions[0][0];
    const b = solutions[1][0];
    if (Math.abs( a - Math.floor(a) ) > delta || Math.abs( b - Math.floor(b) ) > delta) {
        return [];
    }
    return [{ a: Math.floor(a), b: Math.floor(b) }]
}


export function solvePartTwo(inputFileName: string) {
    const parsed = parseInput(inputFileName, 10000000000000)
    const pushes = parsed.map(solveSystemOfEquations);
    const sum = pushes.reduce((acc, curr) => {
        const chepest = findChepestPush(curr);
        if (chepest) {
            return acc + pushCost(chepest);
        }
        return acc;
    }, 0);

    return sum;
}



runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));