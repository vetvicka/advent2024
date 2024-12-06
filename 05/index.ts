import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog'
;
function parseInput(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const updates: number[][] = [];
    const rulesMap: Record<number, number[]> = {};
    const reverseRulesMap: Record<number, number[]> = {};
    input.split('\n')
        .filter(Boolean)
        .forEach(line => {
            if (line[2] === '|'){
                const pair = line.split('|').map(Number)
                rulesMap[pair[1]] = rulesMap[pair[1]] ?? [];
                rulesMap[pair[1]].push(pair[0])
                reverseRulesMap[pair[0]] = reverseRulesMap[pair[0]] ?? [];
                reverseRulesMap[pair[0]].push(pair[1])
            } else {
                updates.push(line.split(',').map(Number))
            }
        })

    return { updates, rulesMap, reverseRulesMap };
}

function isValid(update: number[], rulesMap: Record<number, number[]>) {
    for (let i = 0; i < update.length; i++) {
        const num = update[i];
        const relevantRules = rulesMap[num];
        if (relevantRules) {
            const rulesFailed = relevantRules.some(rule => {
                for (let j = i + 1; j < update.length; j++) {
                    if (update[j] === rule) {
                        return true;
                    }
                }
                return false;
            });
            if (rulesFailed) {
                return false;
            }
        }
    }
    return true;
}

export function solvePartOne(inputFileName: string) {
    const { updates, rulesMap } = parseInput(inputFileName);
    const filteredUpdates = updates.filter(update => isValid(update, rulesMap))
    const middleValues = filteredUpdates.map(update => update[Math.floor(update.length/2)]);

    return middleValues.reduce((acc, x) => acc + x);
}

export function solvePartTwo(inputFileName: string) {
    const { updates, rulesMap, reverseRulesMap } = parseInput(inputFileName);
    const filteredUpdates = updates.filter(update => !isValid(update, rulesMap))
    const fixed = filteredUpdates.map(update => update.toSorted((a, b) => {
        if (rulesMap[a] && rulesMap[a].includes(b)) {
            return 1;
        }
        if (reverseRulesMap[a] && reverseRulesMap[a].includes(b)) {
            return -1;
        }
        return 0;
    }));
    const middleValues = fixed.map(update => update[Math.floor(update.length/2)]);

    return middleValues.reduce((acc, x) => acc + x);
}



runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));