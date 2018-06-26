"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Matches 'for name of' strings
var FOR_REGEX = /^for\s+([A-Za-z_\$][A-Za-z0-9-_\$]*)\s+of/;
// Matches property chains (e.g. anObject.subObject.property)
var FIELD_REGEX = /^[A-Za-z_$][A-Za-z0-9-_$]*(?:\.[A-Za-z_$][A-Za-z0-9-_$]*)*/;
function handleReference(ref, context) {
    var parts = ref.expr.split('.');
    var cur = context;
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        cur = cur[part];
        if (cur === undefined)
            return cur;
    }
    return cur;
}
function ltrim(s, c) {
    return s.replace(new RegExp("^" + c + "+"), '');
}
function isFunction(o) {
    return typeof o === 'function';
}
function evaluateKeyExpression(ke, entry, context, isReference) {
    if (isReference)
        return handleReference(ke, context);
    if (isFunction(ke))
        return ke(entry);
    return ke;
}
function evaluateValueExpression(ve, entry, context, isReference) {
    if (isReference)
        return handleReference(ve, context);
    if (isFunction(ve))
        return ve(entry);
    return ve;
}
function parseRef(s) {
    var match = FIELD_REGEX.exec(s);
    if (match == null)
        throw new Error("Invalid reference format");
    return { expr: match[0] };
}
function parseFieldName(s) {
    var match;
    if (s.substr(0, 4) === 'over') {
        return 'it';
    }
    else if ((match = FOR_REGEX.exec(s)) != null) {
        return match[1];
    }
    else {
        throw new Error("Invalid iteration operator. Expecting either 'for ... of' or 'over'");
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
    var fieldName = parseFieldName(s);
    var object = {};
    var context = {};
    var list = values[valueIndex];
    if (list == null || !Array.isArray(list))
        throw new Error("An invalid array was passed (provided " + list + ")");
    for (var _a = 0, list_1 = list; _a < list_1.length; _a++) {
        var entry = list_1[_a];
        context[fieldName] = entry;
        var curKey = evaluateKeyExpression(key, entry, context, !hasKeyExpression);
        if (typeof curKey !== 'string' && typeof curKey !== 'number')
            throw new Error('Key must be either a string or a number, not a(n) ' + typeof curKey);
        object[curKey] = evaluateValueExpression(value, entry, context, !hasValueExpression);
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
        return toObj.apply(void 0, [strings].concat(values));
    }
    catch (err) {
        return null;
    }
}
exports.toObjSafe = toObjSafe;
//# sourceMappingURL=comprehensive.js.map