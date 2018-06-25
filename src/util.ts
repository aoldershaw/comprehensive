export function ltrim(s: string, c: string) {
    return s.replace(new RegExp(`^${c}+`), '');
}

export function isFunction(o: any) {
    return typeof o === 'function';
}

export function isArray(o: any) {
    return o != null && Array.isArray(o);
}