export interface DataValidation { key: string, value?: RegExp, message?: string }

export interface DataValidationProps {
    headers?: DataValidation[],
    query?: DataValidation[]
}