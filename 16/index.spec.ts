import { describe, expect, it } from '@jest/globals';
import { solvePartOne, solvePartTwo } from './index';

describe('solvePartOne', () => {
    it('should return expected', () => {
        const expected = 7036;
        expect(solvePartOne('input_example.txt')).toBe(expected);
    })
})

describe('solvePartTwo', () => {
    it('should return expected', () => {
        const expected = 45;
        expect(solvePartTwo('input_example.txt')).toBe(expected);
    })
})