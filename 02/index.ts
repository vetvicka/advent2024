import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog'
;
function parseInput(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const data = input.split('\n')
        .filter(Boolean)
        .map(line => line.split(' ').map(Number))
    // parsing specific for the day
    return data;
}

export function isValid(report: number[]) {
    const isAsc = report[1] > report[0];
    return report.every((level, i) => {
        if (i === 0) {
            return true;
        }
        const prev = report[i - 1];
        const diff = isAsc ? level - prev : prev - level;
        return diff >= 1 && diff <= 3;
    })
}

export function isValidWithProblemDampener(report: number[]) {
    if (isValid(report)) {
        return true;
    }
    const copy = [...report];
    return copy.some((el, i) => {
        const toBeSpliced = [...copy];
        toBeSpliced.splice(i, 1);
        // console.log('splice', toBeSpliced)
        return isValid(toBeSpliced)
    })
}

export function solvePartOne(inputFileName: string) {
    const reports = parseInput(inputFileName)
    const validReports = reports.filter(isValid)
    return validReports.length
}

export function solvePartTwo(inputFileName: string) {
    const reports = parseInput(inputFileName)
    const validReports = reports.filter(isValidWithProblemDampener)
    return validReports.length
}



runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));