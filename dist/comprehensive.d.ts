interface Reference {
    parts: string[];
    expr: string;
}
declare type Value = string | number | boolean | Object | Array<any>;
declare type KeyProvider = (arg: any) => string;
declare type ValueProvider = (arg: any) => Value;
declare type KeyExpression = KeyProvider | Reference | string;
declare type ValueExpression = ValueProvider | Reference | Value;
export declare function toObj(strings: TemplateStringsArray, object: object): object;
export declare function toObj(strings: TemplateStringsArray, key: KeyExpression, object: object): object;
export declare function toObj(strings: TemplateStringsArray, value: ValueExpression, object: object): object;
export declare function toObj(strings: TemplateStringsArray, key: KeyExpression, value: ValueExpression, object: object): object;
export declare function toObjSafe(strings: TemplateStringsArray, object: object): object;
export declare function toObjSafe(strings: TemplateStringsArray, key: KeyExpression, object: object): object;
export declare function toObjSafe(strings: TemplateStringsArray, value: ValueExpression, object: object): object;
export declare function toObjSafe(strings: TemplateStringsArray, key: KeyExpression, value: ValueExpression, object: object): object;
export {};
