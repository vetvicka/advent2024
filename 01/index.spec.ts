import { describe, expect, it } from '@jest/globals';
import { init } from './index';

describe('initdescribe', () => {
    it('should return true', () => {
        expect(init()).toBe(true);
    })
})