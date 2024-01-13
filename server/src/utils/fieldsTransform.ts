import { BadRequestException } from "@nestjs/common";
import { Types } from "mongoose";

export const fieldsTransform = (fields: string[], omitFields: string[] = []) => {
    const unit = fields.join("|")

    const regexp = new RegExp(`^(${unit})(,(${unit}))*$`)

    return ({ value }) => {
        if (!value || typeof value !== 'string' || !regexp.test(value)) {
            throw new BadRequestException({ status: 400, message: 'fields must have a valid format' })
        }

        const obj = Object.fromEntries(fields.map(key => [key, 0]));

        value.split(',').forEach(key => delete obj[key])

        omitFields.forEach(key => obj[key] = 0)

        return obj
    }
}

export const transformObjectId = ({ value, key }) => {
    if(!value || !Types.ObjectId.isValid(value)) {
        throw new BadRequestException({ status: 400, message: `${key} must be a valid ObjectId` })
    }

    return new Types.ObjectId(value)
}