import { describe, expect, it } from '@jest/globals';
import { solvePartOne, solvePartTwo } from './index';

describe('solvePartOne', () => {
    it('should return 11', () => {
        expect(solvePartOne('input_example.txt')).toBe(11);
    })
})

describe('solvePartTwo', () => {
    it('should return 31', () => {
        expect(solvePartTwo('input_example.txt')).toBe(31);
    })
})