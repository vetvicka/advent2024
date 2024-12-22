import { describe, expect, it } from '@jest/globals';
import { solvePartOne, solvePartTwo } from './index';

describe('solvePartOne', () => {
    it('should return expected', () => {
        const expected = 3749;
        expect(solvePartOne('input_example.txt')).toBe(expected);
    })
})

describe('solvePartTwo', () => {
    it('should return expected', () => {
        const expected = 11387;
        expect(solvePartTwo('input_example.txt')).toBe(expected);
    })
})