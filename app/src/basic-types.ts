export interface StringMap {
    [key: string]: string
}

export interface NumberMap {
    [key: string]: number
}

export interface BooleanMap {
    [key: string]: boolean
}

export interface ArrayMap<T> {
    [key: string]: T[]
}

export interface ObjectMap<T> {
    [key: string]: T
}

export interface AnyMap {
    [key: string]: any
}