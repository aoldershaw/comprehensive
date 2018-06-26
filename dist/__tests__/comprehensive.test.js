"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var comprehensive_1 = require("../comprehensive");
var people = [
    { name: 'Aidan', age: 20 },
    { name: 'Becca', age: 21 },
    { name: 'Liam', age: 22 },
];
var ages = {
    Aidan: 20,
    Becca: 21,
    Liam: 22
};
describe('toObj', function () {
    it('should return an object', function () {
        expect(comprehensive_1.toObj(templateObject_1 || (templateObject_1 = __makeTemplateObject(["{it: it over ", "}"], ["{it: it over ", "}"])), [1, 2, 3])).toMatchObject({ 1: 1, 2: 2, 3: 3 });
    });
    it('should allow for both the "over" and "for ... of" syntax', function () {
        expect(comprehensive_1.toObj(templateObject_2 || (templateObject_2 = __makeTemplateObject(["{person.name: person.age for person of ", ""], ["{person.name: person.age for person of ", ""])), people)).toMatchObject(ages);
        expect(comprehensive_1.toObj(templateObject_3 || (templateObject_3 = __makeTemplateObject(["{it.name: it.age for it of ", ""], ["{it.name: it.age for it of ", ""])), people)).toMatchObject(ages);
        expect(comprehensive_1.toObj(templateObject_4 || (templateObject_4 = __makeTemplateObject(["{it.name: it.age over ", ""], ["{it.name: it.age over ", ""])), people)).toMatchObject(ages);
    });
    it('should support static values', function () {
        function withValue(v) {
            return {
                Aidan: v,
                Becca: v,
                Liam: v
            };
        }
        expect(comprehensive_1.toObj(templateObject_5 || (templateObject_5 = __makeTemplateObject(["{person.name: ", " for person of ", "}"], ["{person.name: ", " for person of ", "}"])), true, people)).toMatchObject(withValue(true));
        expect(comprehensive_1.toObj(templateObject_6 || (templateObject_6 = __makeTemplateObject(["{person.name: ", " for person of ", "}"], ["{person.name: ", " for person of ", "}"])), [1, 2, 3], people)).toMatchObject(withValue([1, 2, 3]));
        expect(comprehensive_1.toObj(templateObject_7 || (templateObject_7 = __makeTemplateObject(["{person.name: ", " for person of ", "}"], ["{person.name: ", " for person of ", "}"])), { a: 123, b: 456 }, people)).toMatchObject(withValue({ a: 123, b: 456 }));
        expect(comprehensive_1.toObj(templateObject_8 || (templateObject_8 = __makeTemplateObject(["{", ": ", " over ", ""], ["{", ": ", " over ", ""])), 'test', 123, people)).toMatchObject({ test: 123 });
    });
    it("shouldn't be fooled by static values looking like the internal Reference type", function () {
        var reference = { expr: 'FAKE...' };
        expect(comprehensive_1.toObj(templateObject_9 || (templateObject_9 = __makeTemplateObject(["{it.name: ", " over ", ""], ["{it.name: ", " over ", ""])), reference, people)).toMatchObject({
            Aidan: reference,
            Becca: reference,
            Liam: reference
        });
    });
    it("should yield undefined for invalid reference type", function () {
        expect(comprehensive_1.toObj(templateObject_10 || (templateObject_10 = __makeTemplateObject(["{it.name: it.fake.key over ", ""], ["{it.name: it.fake.key over ", ""])), people)).toMatchObject({
            Aidan: undefined,
            Becca: undefined,
            Liam: undefined
        });
    });
    it('should support functions', function () {
        expect(comprehensive_1.toObj(templateObject_11 || (templateObject_11 = __makeTemplateObject(["", ": p.age for p of ", ""], ["", ": p.age for p of ", ""])), function (p) { return p.name + "-san"; }, people)).toMatchObject({
            'Aidan-san': 20,
            'Becca-san': 21,
            'Liam-san': 22
        });
        expect(comprehensive_1.toObj(templateObject_12 || (templateObject_12 = __makeTemplateObject(["{it.name: ", " over ", "}"], ["{it.name: ", " over ", "}"])), function (p) { return p.age + 1; }, people)).toMatchObject({
            Aidan: 21,
            Becca: 22,
            Liam: 23
        });
    });
    it('should ignore (most) whitespace', function () {
        expect(comprehensive_1.toObj(templateObject_13 || (templateObject_13 = __makeTemplateObject(["{it.name: it over ", ""], ["{it.name: it over ", ""])), people)).toMatchObject(comprehensive_1.toObj(templateObject_14 || (templateObject_14 = __makeTemplateObject(["     {\n            it.name          :          it\n            over\n            ", "\n        }"], ["     {\n            it.name          :          it\n            over\n            ", "\n        }"])), people));
    });
    it("shouldn't require curly brackets", function () {
        expect(comprehensive_1.toObj(templateObject_15 || (templateObject_15 = __makeTemplateObject(["it.name : it over ", ""], ["it.name : it over ", ""])), people)).toMatchObject(comprehensive_1.toObj(templateObject_16 || (templateObject_16 = __makeTemplateObject(["{it.name : it over ", "}"], ["{it.name : it over ", "}"])), people));
    });
    it("shouldn't be strict about unclosed curly brackets", function () {
        var closed = comprehensive_1.toObj(templateObject_17 || (templateObject_17 = __makeTemplateObject(["{it.name: it over ", "}"], ["{it.name: it over ", "}"])), people);
        var unclosed = comprehensive_1.toObj(templateObject_18 || (templateObject_18 = __makeTemplateObject(["{it.name: it over ", ""], ["{it.name: it over ", ""])), people);
        expect(closed).toMatchObject(unclosed);
    });
    it("should throw if not provided a string or number key", function () {
        expect(function () { return comprehensive_1.toObj(templateObject_19 || (templateObject_19 = __makeTemplateObject(["{it: it over ", "}"], ["{it: it over ", "}"])), people); }).toThrow();
        expect(function () { return comprehensive_1.toObj(templateObject_20 || (templateObject_20 = __makeTemplateObject(["{", ": it over ", ""], ["{", ": it over ", ""])), { a: 123 }, people); }).toThrow();
        expect(function () { return comprehensive_1.toObj(templateObject_21 || (templateObject_21 = __makeTemplateObject(["{it.name: it over ", ""], ["{it.name: it over ", ""])), people); }).not.toThrow();
        expect(function () { return comprehensive_1.toObj(templateObject_22 || (templateObject_22 = __makeTemplateObject(["{it.age: it over ", ""], ["{it.age: it over ", ""])), people); }).not.toThrow();
    });
    it('should throw if missing any parts', function () {
        expect(function () { return comprehensive_1.toObj(templateObject_23 || (templateObject_23 = __makeTemplateObject(["{ : it over ", ""], ["{ : it over ", ""])), people); }).toThrow();
        expect(function () { return comprehensive_1.toObj(templateObject_24 || (templateObject_24 = __makeTemplateObject(["{it.name: over ", ""], ["{it.name: over ", ""])), people); }).toThrow();
        expect(function () { return comprehensive_1.toObj(templateObject_25 || (templateObject_25 = __makeTemplateObject(["{it.name: it ", ""], ["{it.name: it ", ""])), people); }).toThrow();
        expect(function () { return comprehensive_1.toObj(templateObject_26 || (templateObject_26 = __makeTemplateObject(["{it.name it over ", "}"], ["{it.name it over ", "}"])), people); }).toThrow();
    });
});
describe('toObjSafe', function () {
    it('should not throw', function () {
        expect(function () { return comprehensive_1.toObjSafe(templateObject_27 || (templateObject_27 = __makeTemplateObject(["{it: it over ", "}"], ["{it: it over ", "}"])), people); }).not.toThrow();
        expect(function () { return comprehensive_1.toObjSafe(templateObject_28 || (templateObject_28 = __makeTemplateObject(["{", ": it over ", ""], ["{", ": it over ", ""])), { a: 123 }, people); }).not.toThrow();
        expect(function () { return comprehensive_1.toObjSafe(templateObject_29 || (templateObject_29 = __makeTemplateObject(["{ : it over ", ""], ["{ : it over ", ""])), people); }).not.toThrow();
        expect(function () { return comprehensive_1.toObjSafe(templateObject_30 || (templateObject_30 = __makeTemplateObject(["{it.name: over ", ""], ["{it.name: over ", ""])), people); }).not.toThrow();
        expect(function () { return comprehensive_1.toObjSafe(templateObject_31 || (templateObject_31 = __makeTemplateObject(["{it.name: it ", ""], ["{it.name: it ", ""])), people); }).not.toThrow();
    });
    it('should return null on invalid input', function () {
        expect(comprehensive_1.toObjSafe(templateObject_32 || (templateObject_32 = __makeTemplateObject(["{", "}"], ["{", "}"])), [123])).toBeNull();
    });
    it('should not affect valid input', function () {
        expect(comprehensive_1.toObjSafe(templateObject_33 || (templateObject_33 = __makeTemplateObject(["{it.name: it over ", "}"], ["{it.name: it over ", "}"])), people)).toMatchObject(comprehensive_1.toObj(templateObject_34 || (templateObject_34 = __makeTemplateObject(["{it.name: it over ", "}"], ["{it.name: it over ", "}"])), people));
    });
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32, templateObject_33, templateObject_34;
//# sourceMappingURL=comprehensive.test.js.map