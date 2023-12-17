import { Headers, HttpException, HttpStatus, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { DataValidation, DataValidationProps } from "./dataValidation.interface";

export default ({ headers = [], query = [] }: DataValidationProps) => class dataValidationMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: (error?: any) => void) {
        const results: any = {}

        if(headers.length) {
            const validation = this.validate(headers, 'headers', req)
            if(validation.length) { results.headers = validation }
        }

        if(query.length) {
            const validation = this.validate(query, 'query', req)
            if(validation.length) { results.query = validation }
        }

        if(results.headers || results.query) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                results
            })
        }

        next()
    }

    validate(dataValidation: DataValidation[], type: 'headers' | 'query', req: Request): string[] {
        const results = []

        dataValidation.forEach(({ key, value, message }) => {
            if(!req[type][key]) {
                results.push(`'${key}' must not be null`)
            } else if(value) {
                !value.test(req[type][key] as string) && results.push(`'${key}' ${message}`)
            }
        })

        return results
    }
}