"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
describe('ltrim', function () {
    it('should trim the provided character from the left', function () {
        expect(util_1.ltrim('{{{test}}}', '{')).toBe('test}}}');
        expect(util_1.ltrim('test}}}', 't')).toBe('est}}}');
    });
    it("shouldn't affect strings without the provided character on the left", function () {
        expect(util_1.ltrim('{{{test}}}', 't')).toBe('{{{test}}}');
    });
});
describe('isFunction', function () {
    it('should return true for functions', function () {
        expect(util_1.isFunction(function () { return 123; })).toBe(true);
        expect(util_1.isFunction(util_1.isFunction)).toBe(true);
    });
    it('should return false for null', function () {
        expect(util_1.isFunction(null)).toBe(false);
    });
    it('should return false for non-functions', function () {
        expect(util_1.isFunction({})).toBe(false);
        expect(util_1.isFunction([])).toBe(false);
    });
});
describe('isArray', function () {
    it('should return true for arrays', function () {
        expect(util_1.isArray([])).toBe(true);
        expect(util_1.isArray([[1, 2, 3], [4, 5, 6], [7, 8, 9]])).toBe(true);
    });
    it('should return false for null', function () {
        expect(util_1.isArray(null)).toBe(false);
    });
    it('should return false for non-arrays', function () {
        expect(util_1.isArray({})).toBe(false);
        expect(util_1.isArray(666)).toBe(false);
    });
});
//# sourceMappingURL=util.test.js.map