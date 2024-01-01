import { Types } from "mongoose";

export type CallbackValidator = (value: any) => { name: string, valid: boolean }

export const CB_NAMES = {
    NOT_EQUAL: "NOT_EQUAL",
    NOT_FALSY: "NOT_FALSY",
    IS_EQUAL: "IS_EQUAL",
    IS_TYPEOF: "IS_TYPEOF",
    IS_OBJECT: "IS_OBJECT",
    IS_ARRAY: "IS_ARRAY",
    IS_STRING: "IS_STRING",
    IS_NUMBER: "IS_NUMBER",
    IS_BOOLEAN: "IS_BOOLEAN",
    IS_NULL: "IS_NULL",
    EQUAL_LENGTH: "EQUAL_LENGTH",
    EQUAL_LENGTH_OBJ: "EQUAL_LENGTH_OBJ",
    LESS_LENGTH: "LESS_LENGTH",
    LESS_LENGTH_OBJ: "LESS_LENGTH_OBJ",
    GREATER_LENGTH: "GREATER_LENGTH",
    GREATER_LENGTH_OBJ: "GREATER_LENGTH_OBJ",
    REGEXP: "REGEXP",
    JUST_THIS_PROPERTIES: "JUST_THIS_PROPERTIES",
    IS_OBJECT_ID: "IS_OBJECT_ID",
  };

  export const NOT_FALSY: CallbackValidator = (value: any) => ({ name: CB_NAMES.NOT_FALSY, valid: !!value });

  export const NOT_EQUAL = (valueToCompare: any): CallbackValidator => (value: any) => ({ name: CB_NAMES.NOT_EQUAL, valid: valueToCompare !== value });
  
  export const IS_EQUAL = (valueToCompare: any): CallbackValidator => (value: any) => ({ name: CB_NAMES.IS_EQUAL, valid: valueToCompare === value });
  
  export const IS_TYPEOF = (valueToCompare: string): CallbackValidator => (value: any) => ({ name: CB_NAMES.IS_TYPEOF, valid: typeof value === valueToCompare });
  
  export const IS_OBJECT: CallbackValidator = (value: any) => ({ name: CB_NAMES.IS_OBJECT, valid: typeof value === 'object' && !Array.isArray(value) });
  
  export const IS_ARRAY: CallbackValidator = (value: any) => ({ name: CB_NAMES.IS_ARRAY, valid: Array.isArray(value) });
  
  export const IS_STRING: CallbackValidator = (value: any) => ({ name: CB_NAMES.IS_STRING, valid: typeof value === 'string' });
  
  export const IS_NUMBER: CallbackValidator = (value: any) => ({ name: CB_NAMES.IS_NUMBER, valid: typeof value === 'number' });
  
  export const IS_BOOLEAN: CallbackValidator = (value: any) => ({ name: CB_NAMES.IS_BOOLEAN, valid: typeof value === 'boolean' });
  
  export const IS_NULL: CallbackValidator = (value: any) => ({ name: CB_NAMES.IS_NULL, valid: value === null });
  
  export const EQUAL_LENGTH_OBJ = (length: number): CallbackValidator => (value: Object) => ({ name: CB_NAMES.EQUAL_LENGTH_OBJ, valid: Object.keys(value).length === length });
  
  export const EQUAL_LENGTH = (length: number): CallbackValidator => (value: any) => ({ name: CB_NAMES.EQUAL_LENGTH, valid: value.length === length });
  
  export const LESS_LENGTH_OBJ = (length: number): CallbackValidator => (value: Object) => ({ name: CB_NAMES.LESS_LENGTH_OBJ, valid: Object.keys(value).length < length });
  
  export const LESS_LENGTH = (length: number): CallbackValidator => (value: any) => ({ name: CB_NAMES.LESS_LENGTH, valid: value.length < length });
  
  export const GREATER_LENGTH_OBJ = (length: number): CallbackValidator => (value: Object) => ({ name: CB_NAMES.GREATER_LENGTH_OBJ, valid: Object.keys(value).length > length });
  
  export const GREATER_LENGTH = (length: number): CallbackValidator => (value: any) => ({ name: CB_NAMES.GREATER_LENGTH, valid: value.length > length });

  export const REGEXP = (regex: RegExp): CallbackValidator => (value: string) => ({ name: CB_NAMES.REGEXP, valid: regex.test(value) });
  
  export const JUST_THIS_PROPERTIES = (...properties: string[]): CallbackValidator => (value: Object) => {
    const keys = Object.keys(value)
    let valid = true

    for(let key of keys) {
      if(!properties.includes(key)) {
        valid = false
        break
      }
    }

    return { name: CB_NAMES.JUST_THIS_PROPERTIES, valid }
  };

  export const IS_OBJECT_ID: CallbackValidator = (value: string) => ({ name: CB_NAMES.IS_OBJECT_ID, valid: Types.ObjectId.isValid(value) });

export const VALIDATOR_ERRORS = {
    [CB_NAMES.NOT_EQUAL]: "is not a valid value",
    [CB_NAMES.NOT_FALSY]: "must not be a falsy value",
    [CB_NAMES.IS_EQUAL]: "is not equal to a specific value",
    [CB_NAMES.IS_TYPEOF]: "is not the specific type",
    [CB_NAMES.IS_OBJECT]: "is not an object",
    [CB_NAMES.IS_ARRAY]: "is not an array",
    [CB_NAMES.IS_STRING]: "is not a string",
    [CB_NAMES.IS_NUMBER]: "is not a number",
    [CB_NAMES.IS_BOOLEAN]: "is not a boolean",
    [CB_NAMES.IS_NULL]: "is not a null value",
    [CB_NAMES.EQUAL_LENGTH]: "must be have same length",
    [CB_NAMES.EQUAL_LENGTH_OBJ]: "must be have same length object",
    [CB_NAMES.LESS_LENGTH]: "must be have less length",
    [CB_NAMES.LESS_LENGTH_OBJ]: "must be have less length object",
    [CB_NAMES.GREATER_LENGTH]: "must be have greater length",
    [CB_NAMES.GREATER_LENGTH_OBJ]: "must be have greater length object",
    [CB_NAMES.REGEXP]: "Doesn't have a valid format",
    [CB_NAMES.JUST_THIS_PROPERTIES]: "must have just the necessary properties",
    [CB_NAMES.IS_OBJECT_ID]: "must have a valid ObjectId"
  };
  