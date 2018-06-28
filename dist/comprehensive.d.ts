interface Reference {
    expr: string;
}
declare type Value = string | number | boolean | Object | Array<any>;
declare type KeyFunction = (arg: any) => string;
declare type ValueFunction = (arg: any) => Value;
declare type KeyExpression = KeyFunction | Reference | string;
declare type ValueExpression = ValueFunction | Reference | Value;
export declare function toObj(strings: TemplateStringsArray, array: Array<any>): object;
export declare function toObj(strings: TemplateStringsArray, key: KeyExpression, array: Array<any>): object;
export declare function toObj(strings: TemplateStringsArray, value: ValueExpression, array: Array<any>): object;
export declare function toObj(strings: TemplateStringsArray, key: KeyExpression, value: ValueExpression, array: Array<any>): object;
export declare function toObjSafe(strings: TemplateStringsArray, array: Array<any>): object;
export declare function toObjSafe(strings: TemplateStringsArray, key: KeyExpression, array: Array<any>): object;
export declare function toObjSafe(strings: TemplateStringsArray, value: ValueExpression, array: Array<any>): object;
export declare function toObjSafe(strings: TemplateStringsArray, key: KeyExpression, value: ValueExpression, array: Array<any>): object;
export {};
