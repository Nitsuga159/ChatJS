import {
    Injectable,
    NestMiddleware,
} from '@nestjs/common';

export default ({ allFields, fieldsToOmitDefault }: { allFields: string[], fieldsToOmitDefault: string[] }) => {
    @Injectable()
    class FieldsQuery implements NestMiddleware {
    use(req: any, res: any, next: (error?: any) => void) {
        const fields = req.query._fields
        const filterFields = {}     

        if (fields) {
            const currentFields = fields.split(',')
            for (let field of allFields) {
                if (!currentFields.includes(field)) {
                    filterFields[field] = 0
                }
            }
        }

        for (let field of fieldsToOmitDefault) {
            filterFields[field] = 0
        }

        req._fields = filterFields

        next()
    }
}

    return FieldsQuery
}
