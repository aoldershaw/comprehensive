// Matches 'for name1, name2, ... of' strings, and captures the variable name(s)
const FOR_REGEX = /^for\s+([A-Za-z_\$][A-Za-z0-9-_\$]*(\s*,\s*[A-Za-z_\$][A-Za-z0-9-_\$]*)*)\s+of/;
// Matches property chains (e.g. anObject.subObject.property)
const FIELD_REGEX = /^[A-Za-z_$][A-Za-z0-9-_$]*(?:\.[A-Za-z_$][A-Za-z0-9-_$]*)*/

interface Context {
    [name: string]: any;
}

interface Reference {
    expr: string;
}

type Key = string | Reference;
type Value = string | number | boolean | Object | Array<any>;
type KeyFunction = (arg: any) => string;
type ValueFunction = (arg: any) => Value;
type KeyExpression = KeyFunction | Reference | string;
type ValueExpression = ValueFunction | Reference | Value

function handleReference(ref: Reference, context: Context): any {
    const parts = ref.expr.split('.');
    let cur = context;
    for(const part of parts) {
        cur = cur[part];
        if(cur === undefined) return cur;
    }
    return cur;
}

function ltrim(s: string, c: string) {
    return s.replace(new RegExp(`^${c}+`), '');
}

function isFunction(o: any) {
    return typeof o === 'function';
}

function evaluateKeyExpression(ke: KeyExpression, entry: any, context: Context, isReference: boolean): string {
    if(isReference) return handleReference(<Reference> ke, context);
    if(isFunction(ke)) return (<KeyFunction> ke)(entry);
    return <string> ke;
}

function evaluateValueExpression(ve: ValueExpression, entry: any, context: Context, isReference: boolean): Value {
    if(isReference) return handleReference(<Reference> ve, context);
    if(isFunction(ve)) return (<ValueFunction> ve)(entry);
    return <Value> ve;
}

function parseRef(s: string): Reference {
    let match = FIELD_REGEX.exec(s);
    if(match == null) throw new Error("Invalid reference format");
    return {expr: match[0]};
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
    const hasMultipleFields = fieldNames.length > 1;
    const object = {};
    const context: Context = {};
    const list = values[valueIndex]
    if(list == null || !Array.isArray(list)) throw new Error(`An invalid array was passed (provided ${list})`);
    for(const entry of list) {
        if(hasMultipleFields) {
            if(entry == null || !Array.isArray(entry) || entry.length !== fieldNames.length)
                throw new Error(`Cannot spread value ${entry} into fields [${fieldNames.join(', ')}]`)
            for(let i = 0; i < fieldNames.length; i++)
                context[fieldNames[i]] = entry[i];
        } else {
            context[fieldNames[0]] = entry;
        }
        const curKey = evaluateKeyExpression(key, entry, context, !hasKeyExpression);
        if(typeof curKey !== 'string' && typeof curKey !== 'number')
            throw new Error('Key must be either a string or a number, not a(n) ' + typeof curKey);
        object[curKey] = evaluateValueExpression(value, entry, context, !hasValueExpression);
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