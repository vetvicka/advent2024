import fs from 'fs';
import { runMeasureLog } from '../utils/runMeasureLog';
import exp from 'constants';

type Program = number[];
type Registers = Record<string, number>;

function parseInput(inputFileName: string) {
    const input = fs.readFileSync( `${__dirname}/${inputFileName}`, {encoding: 'utf8'});
    const registers: Record<string, number> = {}
    const program: number[] = [];
    input.split('\n')
        .filter(Boolean)
        .forEach(line => {
            if (line.startsWith('Register ')) {
                const key = line.substring(9, 10);
                const value = parseInt(line.substring(12));
                registers[key] = value;
                return;
            } 
            if (line.startsWith('Program:')) {
                program.push(...line.substring(9).split(',').map(Number));
                return;
            }
            throw new Error('Invalid line');
        })
    return { registers, program };
}

let output: number[] = [];

function readComboOperand(operand: number, registers: Registers) {
    if (operand >= 0 && operand <= 3) {
        return operand;
    }
    if (operand === 4) {
        return registers.A;
    }
    if (operand === 5) {
        return registers.B;
    }
    if (operand === 6) {
        return registers.C;
    }
    throw new Error('Invalid combo operand: ' + operand)
}
function safeXOR(a: number, b: number) {
    return Number(BigInt(a) ^ BigInt(b));
}
/**
 * The adv instruction (opcode 0) performs division. The numerator is the value in the A register. 
 * The denominator is found by raising 2 to the power of the instruction's combo operand. 
 * (So, an operand of 2 would divide A by 4 (2^2); an operand of 5 would divide A by 2^B.) 
 * The result of the division operation is truncated to an integer and then written to the A register.
 */
function adv(operand: number, registers: Registers) {
    const combo = readComboOperand(operand, registers);
    const denominator = 2**combo;
    const numerator = registers.A;
    registers.A = Math.trunc(numerator / denominator);
}

/**
 * calculates the bitwise XOR of register B and the instruction's literal operand, then stores the result in register B.
 */
function bxl(operand: number, registers: Registers) {
    registers.B = safeXOR(registers.B, operand)
}

/**
 * calculates the value of its combo operand modulo 8 (thereby keeping only its lowest 3 bits), 
 * then writes that value to the B register.
 */
function bst(operand: number, registers: Registers) {
    registers.B = readComboOperand(operand, registers) % 8;
}

/**
 * does nothing if the A register is 0. However, if the A register is not zero, 
 * it jumps by setting the instruction pointer to the value of its literal operand; 
 * if this instruction jumps, the instruction pointer is not increased by 2 after this instruction. 
 */
function jnz(operand: number, registers: Registers) {
    if (registers.A === 0) {
        return;
    }
    return operand;
}

/**
 * calculates the bitwise XOR of register B and register C, then stores the result in register B. 
 * (For legacy reasons, this instruction reads an operand but ignores it.) 
 */
function bxc(operand: number, registers: Registers) {
    registers.B = safeXOR(registers.B, registers.C);
}

/**
 * calculates the value of its combo operand modulo 8, then outputs that value. 
 * (If a program outputs multiple values, they are separated by commas.)
 */
function out(operand: number, registers: Registers) {
    
    output.push(readComboOperand(operand, registers) % 8)
}

/**
 * works exactly like the adv instruction except that the result is stored in the B register. 
 * (The numerator is still read from the A register.)
 */
function bdv(operand: number, registers: Registers) {
    const combo = readComboOperand(operand, registers);
    const denominator = 2**combo;
    const numerator = registers.A;
    registers.B = Math.trunc(numerator / denominator);
}

/**
 * works exactly like the adv instruction except that the result is stored in the C register. 
 * (The numerator is still read from the A register.)
 */
function cdv(operand: number, registers: Registers) {
    const combo = readComboOperand(operand, registers);
    const denominator = 2**combo;
    const numerator = registers.A;
    registers.C = Math.trunc(numerator / denominator);
}

type Instruction = (operand: number, registers: Registers) => void | number

const instructions: Instruction[] = [adv, bxl, bst, jnz, bxc, out, bdv, cdv];

function exec(program: Program, registers: Registers, expected?: string) {
    let pointer = 0;
    while(pointer < program.length) {
        const opcode = program[pointer];
        const data = program[pointer + 1];
        const instruction = instructions[opcode];
        const jump = instruction(data, registers);
        if (expected && opcode === 5) {
            if (!expected.startsWith(output.join(','))) {
                return;
            }
        }
        // console.log('opcode', opcode, 'data', data, 'jump', jump);
        if (jump != null) {
            pointer = jump;
        } else {
            pointer += 2;
        }
    }
}

export function solvePartOne(inputFileName: string) {
    const { program, registers } = parseInput(inputFileName)
    output = [];
    exec(program, registers);
    return output.join(',');

}

export function solvePartTwo(inputFileName: string) {
    const { program, registers } = parseInput(inputFileName)
    const expected = program.join(',');
    let actual = '';
    // let cnt = 4105497000000; // known minimum
    // let cnt = 30644328857839; // known minimum //20654497595631
    // let cnt = 39440684548335; // known minimum //20654497595631
    let cnt = 39440684548335; // known minimum //20654497595631
    // let cnt = 0;
    // console.log('expected', expected)
    let lengthReached = false;

    output = [];
    exec(program, {A: 1, B: 0, C: 0});
    actual = output.join(',');
    // console.log(cnt, actual.length, expected.length, 'actual: ', actual, 'expected:', expected);
    // let prev = ((2 * 8 + 4)*8 + 5)*8
    let prev = 0;
    // const next = [2, 4, 5, 3, 2, 5, 3, 4, 3, 5, 4, 0, 0, 3, 5, 2];
    // const next = [2, 4, 5, 3, 2, 5, 3, 4, 3, 5, 4, 0, 0, 3, 5, 1];
    let next: number[] = [];
    // next.forEach((v) => prev = (prev + v) * 8);
    // next.forEach((v) => prev = Number(((BigInt(prev)) + BigInt(v)) << 3n));
    // console.log(prev.toString(2));
    // for (let omg = 0; omg < 8; omg++) {
    //     output = [];
    //     exec(program, {A: Number(prev + omg), B: 0, C: 0});
    //     actual = output.join(',');
    //     // console.log('looking for:', program[program.length - (output.length)], 'and got: ', output[0], next)
    //     console.log(prev, actual.length, expected.length, 'actual: ', actual, 'expected:', expected, 'omg', omg);
    //     // if (program[program.length - (output.length)] === output[0]) {
    //     //     next.push(omg);
    //     //     break;
    //     // }
    //     // [1, 2, 3] vs [1, 2, 3]
    //     // console.log(prev, actual.length, expected.length, 'actual: ', actual, 'expected:', expected, 'omg', omg);
    // }
    // return;


    // return Number(prev);
    let fck = 0;
    const candidates: number[][] = [];
    while (actual.length < expected.length) {
        prev = 0;
        next.forEach((v) => prev = (prev + v) * 8);
        // console.log(prev, actual.length, expected.length, 'actual: ', actual, 'expected:', expected);
        for (let omg = 0; omg < 8; omg++) {
            output = [];
            exec(program, {A: Number(prev + omg), B: 0, C: 0});
            actual = output.join(',');
            // console.log('looking for:', program[program.length - (output.length)], 'and got: ', output[0], next)
            // console.log(prev, actual.length, expected.length, 'actual: ', actual, 'expected:', expected, 'omg', omg);
            if (actual === expected) {
                // console.log('JASKJFHFSAJLHF', next, omg, Number(prev + omg))
                return Number(prev + omg);
            }
            if (program[program.length - (output.length)] === output[0]) {
                candidates[next.length] = candidates[next.length] || []
                candidates[next.length].push(omg);
                // next.push(omg);
                // break;
            }
            // [1, 2, 3] vs [1, 2, 3]
            // console.log(prev, actual.length, expected.length, 'actual: ', actual, 'expected:', expected, 'omg', omg);
        }
        if (!candidates[next.length]) {
            // console.log('FUCK', fck++, next);
            // console.log('wtf', candidates.length)
            for (let i = candidates.length - 1; i > 0; i--) {
                // console.log('wtf', candidates, i, candidates[i], 'len', candidates.length)
                const arr = candidates[i];
                if (arr.length > 1) {
                    candidates.splice(i + 1);
                    next.splice(i);
                    arr.shift();
                    next.push(arr[0]);
                    break;
                }
            }
        } else {
            next.push(candidates[candidates.length - 1][0])
        }
        // console.log('state of next:', next)
        if (fck > 15) {
            return;

        }
        
    }
    prev = 0;
    next = [2, 4, 5, 3, 2, 5, 3, 4, 3, 5, 4, 0, 0, 3, 5]
    next.forEach((v) => prev = (prev + v) * 8);
    output = [];
    exec(program, {A: Number(prev), B: 0, C: 0});
    actual = output.join(',');
    // console.log('next', next.join(','), 'prev', prev, 'actual', actual)





    return;
    while(actual !== expected) {
        output = [];
        exec(program, {A: cnt, B: 0, C: 0});
        // exec(program, {A: cnt, B: 0, C: 0}, expected);
        // if (lengthReached) {
        //     exec(program, {A: cnt, B: 0, C: 0});
        // } else {
        //     exec(program, {A: cnt, B: 0, C: 0});
        // }
        actual = output.join(',');
        if (actual.startsWith('2,4,1,6')) { // && actual.endsWith('4,5,5,0,3,3,0')
            console.log(cnt, actual.length, expected.length, 'actual: ', actual, 'expected:', expected);
        }
        if (actual.endsWith('4,5,5,0,3,3,0')) { // && actual.endsWith('4,5,5,0,3,3,0')
            console.log(cnt, actual.length, expected.length, 'actual: ', actual, 'expected:', expected);
        }
        // if (actual.length === expected.length && actual.startsWith('2,4,1')) { // && actual.endsWith('4,5,5,0,3,3,0')
        //     console.log(cnt, actual.length, expected.length, 'actual: ', actual, 'expected:', expected);
        // }
        
        // if (actual.startsWith('2,4,1,6,7,5')) {
        //     console.log(cnt, actual.length, expected.length, 'actual: ', actual)
        // }
        // if (!actual.endsWith('0,3,3,0')) {
        //     cnt += 1_000_000;
        // } else if (!actual.endsWith('5,5,0,3,3,0')) {
        //     cnt += 1_000;
        // } else if (!actual.endsWith('1,4,5,5,0,3,3,0')) {
        //     cnt += 100;
        // }
            //2,4,1,6,7,5,4,6,1,4,5,5,0,3,3,0
        // cnt += 512 * 32;
        cnt += 1;

        // if (!lengthReached && actual.length < expected.length) {
        // if (actual.length < expected.length) {
        //     cnt += 1_000_000;
        // } else {
        //     lengthReached = true;
        // }
        if (cnt % 1000000 === 0) {
            console.log('Working hard....', actual.length, expected.length, cnt);
        }

    }
    return cnt;
}



runMeasureLog(() => solvePartOne('input.txt'), () => solvePartTwo('input.txt'));