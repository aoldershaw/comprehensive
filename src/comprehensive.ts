// Matches 'for name1, name2, ... of' strings, and captures the variable name(s)
const FOR_REGEX = /^for\s+([A-Za-z_\$][A-Za-z0-9-_\$]*(\s*,\s*[A-Za-z_\$][A-Za-z0-9-_\$]*)*)\s+of/;
// Matches property chains (e.g. anObject.subObject.property)
const FIELD_REGEX = /^[A-Za-z_$][A-Za-z0-9-_$]*(?:\.[A-Za-z_$][A-Za-z0-9-_$]*)*/;

interface Reference {
    parts: string[];
    expr: string;
}

type Key = string | Reference;
type Value = string | number | boolean | Object | Array<any>;
type KeyProvider = (arg: any) => string;
type ValueProvider = (arg: any) => Value;
type KeyExpression = KeyProvider | Reference | string;
type ValueExpression = ValueProvider | Reference | Value

function handleReferenceFunction(ref: Reference, fieldNames: string[]): KeyProvider | ValueProvider {
    const index = fieldNames.indexOf(ref.parts[0]);
    if(index < 0) throw new Error(`Invalid field name ${ref.parts[0]}`);
    const hasMultipleFields = fieldNames.length > 1;
    return (entry) => {
        let cur = hasMultipleFields ? entry[index] : entry;
        for(let i = 1; i < ref.parts.length; i++) {
            cur = cur[ref.parts[i]];
            if(cur === undefined) return cur;
        }
        return cur;
    }
}

function ltrim(s: string, c: string) {
    return s.replace(new RegExp(`^${c}+`), '');
}

function isFunction(o: any) {
    return typeof o === 'function';
}

function obtainProvider(e: KeyExpression | ValueExpression, isReference: boolean, fieldNames: string[]): KeyProvider | ValueProvider {
    if(isReference) return handleReferenceFunction(<Reference> e, fieldNames);
    if(isFunction(e)) return <KeyProvider | ValueProvider> e;
    return () => <string | Value> e;
}

function parseRef(s: string): Reference {
    let match = FIELD_REGEX.exec(s);
    if(match == null) throw new Error("Invalid reference format");
    return {parts: match[0].split('.'), expr: match[0]};
}

function parseFieldNames(s: string): string[] {
    let match;
    if(s.substr(0, 4) === 'over') {
        return ['it'];
    } else if((match = FOR_REGEX.exec(s)) != null) {
        const names = match[1].split(',').map(s => s.trim());
        return names;
    } else {
        throw new Error("Invalid iteration operator. Expecting either 'for ... of' or 'over', provided " + s)
    }
}

export function toObj(strings: TemplateStringsArray, array: Array<any>): object;
export function toObj(strings: TemplateStringsArray, key: KeyExpression, array: Array<any>): object;
export function toObj(strings: TemplateStringsArray, value: ValueExpression, array: Array<any>): object;
export function toObj(strings: TemplateStringsArray, key: KeyExpression, value: ValueExpression, array: Array<any>): object;

export function toObj(strings: TemplateStringsArray, ...values: Array<any>): object {
    let s = ltrim(strings[0].trim(), '{').trim();
    let valueIndex = 0;
    let stringIndex = 1;
    const hasKeyExpression = s.length === 0;
    let key: Key;
    if(hasKeyExpression) {
        key = values[valueIndex++];
        if(key == null) throw new Error("Expecting a key");
        s = strings[stringIndex++].trim();
    } else {
        key = parseRef(s);
        s = s.substr(key.expr.length).trim();
    }
    if(s.charAt(0) !== ':') throw new Error("Missing ':'");
    s = s.substr(1).trim();
    const hasValueExpression = s.length === 0;
    let value: Value;
    if(hasValueExpression) {
        value = values[valueIndex++];
        if(!value) throw new Error("Expecting a value");
        s = strings[stringIndex++].trim();
    } else {
        value = parseRef(s);
        s = s.substr((<Reference> value).expr.length).trim();
    }
    const fieldNames = parseFieldNames(s);
    const keyFn = <KeyProvider> obtainProvider(key, !hasKeyExpression, fieldNames);
    const valueFn = <ValueProvider> obtainProvider(value, !hasValueExpression, fieldNames);
    const object = {};
    const list = values[valueIndex]
    if(list == null || !Array.isArray(list)) throw new Error(`An invalid array was passed (provided ${list})`);
    for(const entry of list) {
        const curKey = keyFn(entry);
        if(typeof curKey !== 'string' && typeof curKey !== 'number')
            throw new Error('Key must be either a string or a number, not a(n) ' + typeof curKey);
        object[curKey] = valueFn(entry);
    }
    return object;
}

export function toObjSafe(strings: TemplateStringsArray, array: Array<any>): object;
export function toObjSafe(strings: TemplateStringsArray, key: KeyExpression, array: Array<any>): object;
export function toObjSafe(strings: TemplateStringsArray, value: ValueExpression, array: Array<any>): object;
export function toObjSafe(strings: TemplateStringsArray, key: KeyExpression, value: ValueExpression, array: Array<any>): object;

export function toObjSafe(strings: TemplateStringsArray, ...values: Array<any>): object {
    try {
        // @ts-ignore
        return toObj(strings, ...values);
    } catch(err) {
        return null;
    }
}