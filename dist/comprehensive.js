"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Matches 'for name1, name2, ... of' strings, and captures the variable name(s)
var FOR_REGEX = /^for\s+([A-Za-z_\$][A-Za-z0-9-_\$]*(\s*,\s*[A-Za-z_\$][A-Za-z0-9-_\$]*)*)\s+of/;
// Matches property chains (e.g. anObject.subObject.property)
var FIELD_REGEX = /^[A-Za-z_$][A-Za-z0-9-_$]*(?:\.[A-Za-z_$][A-Za-z0-9-_$]*)*/;
function handleReferenceFunction(ref, fieldNames) {
    var index = fieldNames.indexOf(ref.parts[0]);
    if (index < 0)
        throw new Error("Invalid field name " + ref.parts[0]);
    var hasMultipleFields = fieldNames.length > 1;
    return function (entry) {
        var cur = hasMultipleFields ? entry[index] : entry;
        for (var i = 1; i < ref.parts.length; i++) {
            cur = cur[ref.parts[i]];
            if (cur === undefined)
                return cur;
        }
        return cur;
    };
}
function ltrim(s, c) {
    return s.replace(new RegExp("^" + c + "+"), '');
}
function isFunction(o) {
    return typeof o === 'function';
}
function obtainProvider(e, isReference, fieldNames) {
    if (isReference)
        return handleReferenceFunction(e, fieldNames);
    if (isFunction(e))
        return e;
    return function () { return e; };
}
function parseRef(s) {
    var match = FIELD_REGEX.exec(s);
    if (match == null)
        throw new Error("Invalid reference format");
    return { parts: match[0].split('.'), expr: match[0] };
}
function parseFieldNames(s) {
    var match;
    if (s.substr(0, 4) === 'over') {
        return ['it'];
    }
    else if ((match = FOR_REGEX.exec(s)) != null) {
        var names = match[1].split(',').map(function (s) { return s.trim(); });
        return names;
    }
    else {
        throw new Error("Invalid iteration operator. Expecting either 'for ... of' or 'over', provided " + s);
    }
}
function toObj(strings) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    var s = ltrim(strings[0].trim(), '{').trim();
    var valueIndex = 0;
    var stringIndex = 1;
    var hasKeyExpression = s.length === 0;
    var key;
    if (hasKeyExpression) {
        key = values[valueIndex++];
        if (key == null)
            throw new Error("Expecting a key");
        s = strings[stringIndex++].trim();
    }
    else {
        key = parseRef(s);
        s = s.substr(key.expr.length).trim();
    }
    if (s.charAt(0) !== ':')
        throw new Error("Missing ':'");
    s = s.substr(1).trim();
    var hasValueExpression = s.length === 0;
    var value;
    if (hasValueExpression) {
        value = values[valueIndex++];
        if (!value)
            throw new Error("Expecting a value");
        s = strings[stringIndex++].trim();
    }
    else {
        value = parseRef(s);
        s = s.substr(value.expr.length).trim();
    }
    var fieldNames = parseFieldNames(s);
    var keyFn = obtainProvider(key, !hasKeyExpression, fieldNames);
    var valueFn = obtainProvider(value, !hasValueExpression, fieldNames);
    var object = {};
    var list = values[valueIndex];
    if (list == null || !Array.isArray(list))
        throw new Error("An invalid array was passed (provided " + list + ")");
    for (var _a = 0, list_1 = list; _a < list_1.length; _a++) {
        var entry = list_1[_a];
        var curKey = keyFn(entry);
        if (typeof curKey !== 'string' && typeof curKey !== 'number')
            throw new Error('Key must be either a string or a number, not a(n) ' + typeof curKey);
        object[curKey] = valueFn(entry);
    }
    return object;
}
exports.toObj = toObj;
function toObjSafe(strings) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    try {
        // @ts-ignore
        return toObj.apply(void 0, [strings].concat(values));
    }
    catch (err) {
        return null;
    }
}
exports.toObjSafe = toObjSafe;
//# sourceMappingURL=comprehensive.js.map