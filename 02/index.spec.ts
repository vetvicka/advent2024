import { describe, expect, it } from '@jest/globals';
import { solvePartOne, solvePartTwo, isValid, isValidWithProblemDampener } from './index';

describe('Day 2', () => {
    describe('solvePartOne', () => {
        it('should return 2', () => {
            expect(solvePartOne('input_example.txt')).toBe(2);
        })
    })
    
    describe('isValid', () => {
        it('should return true', () => {
            expect(isValid([1, 2, 3, 4])).toBeTruthy();
        })
    
        it('should return false', () => {
            expect(isValid([1, 2, 9, 10])).toBeFalsy();
        })

        it('should return false', () => {
            expect(isValid([1, 2, 7, 8, 9])).toBeFalsy();
        })
        it('should return false', () => {
            expect(isValid([9, 7, 6, 2, 1])).toBeFalsy();
        })
        it('should return false', () => {
            expect(isValid([1, 3, 2, 4, 5])).toBeFalsy();
        })
        it('should return false', () => {
            expect(isValid([8, 6, 4, 4, 1])).toBeFalsy();
        })
    })
    
    
    describe('solvePartTwo', () => {
        it('should return 4', () => {
            expect(solvePartTwo('input_example.txt')).toBe(4);
        })
    })

    describe('isValidWithProblemDampener', () => {
        it('should return 4', () => {
            expect(isValidWithProblemDampener([1, 2, 7, 8, 9])).toBeFalsy();
        })
    })
})
