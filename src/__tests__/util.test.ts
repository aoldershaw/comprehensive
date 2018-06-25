import { ltrim, isFunction, isArray } from "../util";

describe('ltrim', () => {
    it('should trim the provided character from the left', () => {
        expect(ltrim('{{{test}}}', '{')).toBe('test}}}')
        expect(ltrim('test}}}', 't')).toBe('est}}}')
    })
    
    it(`shouldn't affect strings without the provided character on the left`, () => {
        expect(ltrim('{{{test}}}', 't')).toBe('{{{test}}}')
    })
})

describe('isFunction', () => {
    it('should return true for functions', () => {
        expect(isFunction(() => 123)).toBe(true);
        expect(isFunction(isFunction)).toBe(true);
    })

    it('should return false for null', () => {
        expect(isFunction(null)).toBe(false);
    })

    it('should return false for non-functions', () => {
        expect(isFunction({})).toBe(false);
        expect(isFunction([])).toBe(false);
    })
})

describe('isArray', () => {
    it('should return true for arrays', () => {
        expect(isArray([])).toBe(true);
        expect(isArray([[1, 2, 3], [4, 5, 6], [7, 8, 9]])).toBe(true);
    })

    it('should return false for null', () => {
        expect(isArray(null)).toBe(false);
    })

    it('should return false for non-arrays', () => {
        expect(isArray({})).toBe(false);
        expect(isArray(666)).toBe(false);
    })
})