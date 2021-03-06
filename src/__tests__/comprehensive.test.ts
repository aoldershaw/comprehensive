import toObj, { toObjSafe } from "../comprehensive";

const people = [
    {name: 'Aidan', age: 20},
    {name: 'Becca', age: 21},
    {name: 'Liam', age: 22},
];

const ages = {
    Aidan: 20,
    Becca: 21,
    Liam: 22
}

describe('toObj', () => {
    it('should return an object', () => {
        expect(toObj`{it: it over ${[1, 2, 3]}}`).toMatchObject({1: 1, 2: 2, 3: 3});
    })

    it('should allow for both the "over" and "for ... of" syntax', () => {
        expect(toObj`{person.name: person.age for person of ${people}`).toMatchObject(ages);
        expect(toObj`{it.name: it.age for it of ${people}`).toMatchObject(ages);
        expect(toObj`{it.name: it.age over ${people}`).toMatchObject(ages);
    });

    it('should support static values', () => {
        function withValue(v) {
            return {
                Aidan: v,
                Becca: v,
                Liam: v
            }
        }

        expect(toObj`{person.name: ${true} for person of ${people}}`).toMatchObject(withValue(true));
        expect(toObj`{it.name: ${false} over ${people}`).toMatchObject(withValue(false));
        expect(toObj`{it.name: ${null} over ${people}`).toMatchObject(withValue(null));
        expect(toObj`{person.name: ${[1, 2, 3]} for person of ${people}}`).toMatchObject(withValue([1, 2, 3]));
        expect(toObj`{person.name: ${{a: 123, b: 456}} for person of ${people}}`).toMatchObject(withValue({a: 123, b: 456}));
        expect(toObj`{${'test'}: ${123} over ${people}`).toMatchObject({test: 123});
    })

    it(`shouldn't be fooled by static values looking like the internal Reference type`, () => {
        const reference = {expr: 'FAKE...'};
        expect(toObj`{it.name: ${reference} over ${people}`).toMatchObject({
            Aidan: reference,
            Becca: reference,
            Liam: reference
        })
    })

    it(`should yield undefined for invalid reference type`, () => {
        expect(toObj`{it.name: it.fake.key over ${people}`).toMatchObject({
            Aidan: undefined,
            Becca: undefined,
            Liam: undefined
        })
    });

    it('should support functions', () => {
        expect(toObj`${p => `${p.name}-san`}: p.age for p of ${people}`).toMatchObject({
            'Aidan-san': 20,
            'Becca-san': 21,
            'Liam-san': 22
        });
        expect(toObj`{it.name: ${p => p.age + 1} over ${people}}`).toMatchObject({
            Aidan: 21,
            Becca: 22,
            Liam: 23
        });
    });

    it('should allow for value spreading', () => {
        expect(toObj`key: value.c for key, value of ${Object.entries({a: {c: 123}, b: {c: 456}})}`).toMatchObject({
            a: 123,
            b: 456
        });
        const list = [['a', 1, 2, 3], 
                      ['b', 4, 5, 6]];
        expect(toObj`key: ${([_, a, b, c]) => a + b + c} for key,a , b, c of ${list}`).toMatchObject({
            'a': 1 + 2 + 3,
            'b': 4 + 5 + 6
        })
    })

    it('should not throw if invalid value spread length', () => {
        const list = [[1, 2], [3, 4, 5], [6]];
        expect(toObj`{a: b for a, b of ${list}}`).toMatchObject({
            1: 2,
            3: 4,
            6: undefined,
        });
        expect(toObj`{${([a, b]) => a + b}: ${([a, b]) => a * b} for a, b of ${list}}`).toMatchObject({
            3: 2,
            7: 12,
            'NaN': NaN
        })
    });

    it('should throw if trying to unpack a non-array', () => {
        expect(() => toObj`${([a, ]) => a}: ${([, b]) => b} over ${[1, 2, 3]}`).toThrow();
    });

    it('should support iterating over keys with the "in" operator', () => {
        expect(toObj`name: ${name => ages[name]} for name in ${ages}`).toMatchObject(ages);
        expect(toObj`i: i for i in ${['a', 'b', 'c']}`).toMatchObject({0: '0', 1: '1', 2: '2'});
    });

    it('should throw if trying to spread multiple names using the "in" operator', () => {
        expect(() => toObj`i: j for i, j in ${[[1, 2], [3, 4]]}`).toThrow();
    });

    it('should throw if trying to traverse a key (from the "in" operator)', () => {
        expect(() => toObj`i: i.illegal for i in ${{a: 1, b: 2}}`).toThrow();
    });

    it('should throw if trying to reference an invalid field name', () => {
        expect(() => toObj`fake: fake for i in ${[1, 2]}`).toThrow();
    });

    it('should ignore (most) whitespace', () => {
        expect(toObj`{it.name: it over ${people}}`).toMatchObject(toObj`     {
            it.name          :          it
            over
                        ${people}
        }`)
    });

    it(`shouldn't require curly brackets`, () => {
        expect(toObj`it.name : it over ${people}`).toMatchObject(toObj`{it.name : it over ${people}}`)
    });

    it(`shouldn't be strict about unclosed curly brackets`, () => {
        const closed   = toObj`{it.name: it over ${people}}`;
        const unclosed = toObj`{it.name: it over ${people}`;
        expect(closed).toMatchObject(unclosed);
    })

    it(`should throw if not provided a string or number key`, () => {
        expect(() => toObj`{it: it over ${people}}`).toThrow();
        expect(() => toObj`{${{a: 123}}: it over ${people}`).toThrow();
        expect(() => toObj`{it.name: it over ${people}`).not.toThrow();
        expect(() => toObj`{it.age: it over ${people}`).not.toThrow();
    })

    it('should throw if missing any parts', () => {
        expect(() => toObj`{ : it over ${people}`).toThrow();
        expect(() => toObj`{it.name: over ${people}`).toThrow();
        expect(() => toObj`{it.name: it ${people}`).toThrow();
        expect(() => toObj`{it.name it over ${people}}`).toThrow();
    });
})

describe('toObjSafe', () => {
    it('should not throw', () => {
        expect(() => toObjSafe`{it: it over ${people}}`).not.toThrow();
        expect(() => toObjSafe`{${{a: 123}}: it over ${people}`).not.toThrow();

        expect(() => toObjSafe`{ : it over ${people}`).not.toThrow();
        expect(() => toObjSafe`{it.name: over ${people}`).not.toThrow();
        expect(() => toObjSafe`{it.name: it ${people}`).not.toThrow();


    })

    it('should return null on invalid input', () => {
        expect(toObjSafe`{${[123]}}`).toBeNull();
    })

    it('should not affect valid input', () => {
        expect(toObjSafe`{it.name: it over ${people}}`).toMatchObject(toObj`{it.name: it over ${people}}`);
    })
})