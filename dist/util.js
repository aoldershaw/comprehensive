"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ltrim(s, c) {
    return s.replace(new RegExp("^" + c + "+"), '');
}
exports.ltrim = ltrim;
function isFunction(o) {
    return typeof o === 'function';
}
exports.isFunction = isFunction;
function isArray(o) {
    return o != null && Array.isArray(o);
}
exports.isArray = isArray;
//# sourceMappingURL=util.js.map