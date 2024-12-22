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

function blockInfo(dataTable: Array<number | null>, index: number) {
    let from = index;
    let to = index;
    const value = dataTable[index];
    while (dataTable[from - 1] === value) {
        from -= 1;
    }
    while (dataTable[to + 1] === value) {
        to += 1;
    }
    return { from, to, value, size: to - from + 1 };
}

function findEmptySpaceBlock(dataTable: Array<number | null>, index: number, size: number) {
    for (let i = 0; i < index; i++) {
        if (dataTable[i] !== null) { continue; }
        const block = blockInfo(dataTable, i);
        if (block.size >= size) {
            return block;
        }
    }
    return null;
}

function rearrangeBlocks(dataTable: Array<number | null>, emptySpaces: number[]) {
    let i = dataTable.length - 1;
    while (i > 0) {
        if (dataTable[i] === null) {
            i -= 1;
            continue;
        }
        const block = blockInfo(dataTable, i);
        const emptyBlock = findEmptySpaceBlock(dataTable, i, block.size);
        if (emptyBlock === null) {
            i = block.from - 1;
            continue;
        }
        for (let j = 0; j < block.size; j++) {
            dataTable[emptyBlock.from + j] = dataTable[block.from + j];
            dataTable[block.from + j] = null;
        }
    }
}

export function solvePartTwo(inputFileName: string) {
    const { dataTable, emptySpaces } = parseInput(inputFileName)
    rearrangeBlocks(dataTable, emptySpaces);
    return checksum(dataTable);
}



runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));