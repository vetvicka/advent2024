import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog'
;
function parseInput(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const data = input.split('')
    // parsing specific for the day
    let isFile = true;
    const dataTable: Array<number | null> = [];
    const emptySpaces: number[] = [];
    let fileId = 0;
    data.map(Number)
        .forEach((num) => {
            for (let i = 0; i < num; i++) {
                if(isFile) {
                    dataTable.push(fileId);
                } else {
                    const index = dataTable.length;
                    dataTable.push(null);
                    emptySpaces.push(index);
                }
            }
            if (isFile) {
                fileId += 1;
            }
            isFile = !isFile;
        })

    return { dataTable, emptySpaces };
}

function rearrange(dataTable: Array<number | null>, emptySpaces: number[]) {
    let freeSpaceIndex = 0
    for (let i = dataTable.length - 1; i > 0; i--) {
        const element = dataTable[i];
        if (freeSpaceIndex >= emptySpaces.length) {
            break;
        }
        if (element === null) {
            continue;
        }
        if (i <= emptySpaces[freeSpaceIndex]) {
            break;
        }
        const insertIndex = emptySpaces[freeSpaceIndex];
        freeSpaceIndex += 1;
        dataTable[insertIndex] = dataTable[i];
        dataTable[i] = null;
        emptySpaces.push(i);
    }
}

function checksum(dataTable: Array<number | null>) {
    return dataTable.reduce((acc, current, index) => {
        if (current === null || acc === null) {
            return acc;
        }
        return acc + current * index
    }, 0);
}

export function solvePartOne(inputFileName: string) {
    const { dataTable, emptySpaces } = parseInput(inputFileName)
    rearrange(dataTable, emptySpaces);
    return checksum(dataTable);
}

export function solvePartTwo(inputFileName: string) {
    const parsed = parseInput(inputFileName)
    // solve part 2
    return null
}



runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));