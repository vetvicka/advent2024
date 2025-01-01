import { describe, expect, it } from '@jest/globals';
import { solvePartOne, solvePartTwo, findMatchingTowels } from './index';

describe('findMatchingTowels', () => {
    it('should return expected', () => {
        const towels = ['abc', 'ab', 'a', 'abd', 'abcxd']
        const expected = ['abc', 'ab', 'a'];
        expect(findMatchingTowels(towels, 'abcx')).toEqual(expected);
    })
})


describe('solvePartOne', () => {
    it('should return expected', () => {
        const expected = 6;
        expect(solvePartOne('input_example.txt')).toBe(expected);
    })
})

describe('solvePartTwo', () => {
    it('should return expected', () => {
        const expected = 16;
        expect(solvePartTwo('input_example.txt')).toBe(expected);
    })
})