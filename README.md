# comprehensive
Lightweight (1KB gzipped) Python-inspired object (dictionary) comprehension for JavaScript via template literals.

## Overview
`comprehensive` provides a syntax for object comprehension in Javascript similar to Python's dictionary comprehension.

```
import { toObj } from 'comprehensive';
const people = [{name: 'Aidan', age: 20}, {name: 'Becca', age: 21}];

const ages = toObj`{person.name: person.age for person of ${people}}`;
// {Aidan: 20, Becca: 21}
```

or

```
const ages = toObj`{it.name: it.age over ${people}}`;
```

or

```
// Arbitrary transformations can be applied to the keys and/or values
const ages = toObj`${p => p.name}: ${p => p.age} over ${people}`
```

You can automatically unpack values from fixed-size nested arrays, which is particularly useful for iterating over another object.

```
const people = {
    ABC: {name: 'Aidan', age: 20},
    DEF: {name: 'Becca', age: 21}
}

const idMap = toObj`{id: person.name for id, person of ${Object.entries(people)}}`
// { ABC: 'Aidan', DEF: 'Becca' }
```

Or, you can iterate over the keys of an object using the `for key in` construct.

```
const places = {
    Toronto: {population: 2809000}, 
    Montreal: {population: 1714000}
}
toObj`{city: ${city => places[city].population} for city in ${places}`
// {Toronto: 2809000, Montreal: 1714000}
```

This is a shorthand for `for city of ${Object.keys(places)}`.

## Installation
```
$ npm install comprehensive
```

You can also include [dist/comprehensive.min.js](https://github.com/aoldershaw/comprehensive/blob/master/dist/comprehensive.min.js) in your project.

## Usage
Basic syntax is as follows:
```
toObj`{k: v for var1, (var2, ...) of ${someArray}}`
toObj`{k: v over ${someArray}}`
toObj`{k: v for key in ${someObject}}`
```

where `k` and `v` can either be a property path (e.g. `a.b.c`), a function (e.g. `${a => a.b.c.toLowerCase()}`), or a static value (e.g. `${123}`). The key must either be a `string` or a `number`, otherwise `toObj` will throw. It will also throw if the syntax is invalid.

If you want to ensure the call never throws, you can use `toObjSafe`, which will return `null` on invalid input.

Note that `toObj` does not require curly brackets, and extra whitespace is allowed.

### Examples
#### Basic Example
```
import { toObj } from 'comprehensive';
const people = [{name: 'Aidan', age: 20}, {name: 'Becca', age: 21}];

const personLookup = toObj`{p.name: p for p of ${people}}`;
// {Aidan: {name: Aidan, age: 20}, Becca: {name: 'Becca', age: 21}}
```

#### `over` syntax
```
const squares = toObj`{it: ${it => it ** 2} over ${[1, 2, 3, 4, 5]}}`;
// { '1': 1, '2': 4, '3': 9, '4': 16, '5': 25 }
```

#### Static Values
```
const obj = toObj`it: ${{hello: 'world'}} over ${'A,B,C'.split(',')}`;
// {A: {hello: 'world'}, B: {hello: 'world'}, C: {hello: 'world'}}
```

#### Mapped Key
```
const people = [{name: 'Daniel', hobby: 'Karate'}];

toObj`${p => `${p.name}-san`}: p for p of ${people}`;
// {'Daniel-san': {name: 'Daniel', hobby: 'Karate'}}
```

#### Iterate Over Object
```
const movie2Id = {'Shrek': 'tt0126029', 'Shrek 2': 'tt0298148'};
const id2Movie = toObj`{id: title for title, id of ${Object.entries(movie2Id)}}`;
// {tt0126029: 'Shrek', tt0298148: 'Shrek 2'}
```

or

```
const id2Movie = toObj`{${title => movie2Id[title]}: title for title in ${movie2Id}}}`;
// {tt0126029: 'Shrek', tt0298148: 'Shrek 2'}
```

or

```
const id2Movie = toObj`{${title => movie2Id[title]}: title for title of ${Object.keys(movie2Id)}}}`;
// {tt0126029: 'Shrek', tt0298148: 'Shrek 2'}
```

#### Nested Object Comprehensions
```
const provinces = [
    {
        province: 'Ontario',
        cities: [{city: 'Toronto', population: 2809000}]
    },
    {
        province: 'Quebec',
        cities: [{city: 'Montreal', population: 1714000}]
    }
];

const populations = toObj`{
    p.province : ${p => toObj`{c.city: c.population for c of ${p.cities}}`} for p of ${provinces}
}`;
// { Ontario: { Toronto: 2809000 }, Quebec: { Montreal: 1714000 }
```