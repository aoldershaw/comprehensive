"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Matches 'for name1, name2, ... of/in' strings, and captures the variable name(s)
var FOR_REGEX = /^for\s+([A-Za-z_\$][A-Za-z0-9-_\$]*(\s*,\s*[A-Za-z_\$][A-Za-z0-9-_\$]*)*)\s+(in|of)/;
// Matches property chains (e.g. anObject.subObject.property)
var FIELD_REGEX = /^[A-Za-z_$][A-Za-z0-9-_$]*(?:\.[A-Za-z_$][A-Za-z0-9-_$]*)*/;
var FieldType;
(function (FieldType) {
    FieldType["OF"] = "of";
    FieldType["IN"] = "in";
})(FieldType || (FieldType = {}));
function handleReferenceFunction(ref, fields) {
    if (fields.type === 'in' && ref.parts.length > 1)
        throw new Error("You cannot traverse the key " + ref.parts[0]);
    var index = fields.names.indexOf(ref.parts[0]);
    if (index < 0)
        throw new Error("Invalid field name " + ref.parts[0]);
    var hasMultipleFields = fields.names.length > 1;
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
    var i = 0;
    var strLen = s.length;
    while (i < strLen && s.charAt(i) === c) {
        i++;
    }
    return s.substr(i);
}
function isFunction(o) {
    return typeof o === 'function';
}
function obtainProvider(e, isReference, fields) {
    if (isReference)
        return handleReferenceFunction(e, fields);
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
function parseFields(s) {
    var match;
    if (s.substr(0, 4) === 'over') {
        return { names: ['it'], type: FieldType.OF };
    }
    else if ((match = FOR_REGEX.exec(s)) != null) {
        var names = match[1].split(',').map(function (s) { return s.trim(); });
        var type = match[3];
        if (type === FieldType.IN && names.length > 1)
            throw new Error("Cannot spread multiple fields with the 'in' operator");
        return { names: names, type: type };
    }
    else {
        throw new Error("Invalid iteration operator. Expecting either 'for ... of', 'for ... in', or 'over'");
    }
}
function parseExpression(strings) {
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
    var fields = parseFields(s);
    var keyFn = obtainProvider(key, !hasKeyExpression, fields);
    var valueFn = obtainProvider(value, !hasValueExpression, fields);
    var list = fields.type === FieldType.OF ? values[valueIndex] : Object.keys(values[valueIndex]);
    if (list == null || !Array.isArray(list))
        throw new Error("An invalid array was passed (provided " + list + ")");
    return {
        keyFn: keyFn,
        valueFn: valueFn,
        list: list,
    };
}
function toObj(strings) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    var object = {};
    var _a = parseExpression.apply(void 0, [strings].concat(values)), keyFn = _a.keyFn, valueFn = _a.valueFn, list = _a.list;
    for (var _b = 0, list_1 = list; _b < list_1.length; _b++) {
        var entry = list_1[_b];
        var curKey = keyFn(entry);
        if (typeof curKey !== 'string' && typeof curKey !== 'number')
            throw new Error('Key must be either a string or a number, not a(n) ' + typeof curKey);
        object[curKey] = valueFn(entry);
    }
    return object;
}
exports.default = toObj;
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