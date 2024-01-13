import { Transform } from "class-transformer";
import { IsOptional, IsString, Matches, MaxLength, MinLength, } from "class-validator";
import { fieldsTransform, transformObjectId } from "src/utils/fieldsTransform";
import { Types } from "mongoose";

const PASSWORD_VALIDATION = /(?=.*[a-z]){2,}(?=.*[A-Z]){1,}(?=.*\d){1,}(?=.*[^a-zA-Z\d]){1,}/

export class BodyMapUserDefault {
    @IsString()
    @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    mail: string

    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @Matches(PASSWORD_VALIDATION)
    password: string
}

export class BodyMapUser extends BodyMapUserDefault {
    @IsString()
    @IsOptional()
    photo: string

    @IsString()
    @Matches(/^[\w\d]+$/)
    @MinLength(5)
    @MaxLength(20)
    username: string
}

export class BodyMapUserPasswordChange {
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @Matches(PASSWORD_VALIDATION)
    password: string
    
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @Matches(PASSWORD_VALIDATION)
    newPassword: string
}

export class BodyMapUserChanges {
    @IsString()
    @IsOptional()
    @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    mail: string

    @IsString()
    @MaxLength(2500)
    description: string

    @IsOptional()
    @IsString()
    photo: string

    @IsOptional()
    @IsString()
    @Matches(/^#[a-zA-Z\d]{3}([a-zA-Z\d]{3})?$/)
    color: string
}

export class UserFields {
    @IsOptional()
    @Transform(
        fieldsTransform(
            ['_id', 'mail', 'username', 'userType', 'description', 'photo', 'color'],
            ['__v', 'password', 'habilited']
        )
    )
    fields: Record<string, number> = { __v: 0, password: 0, habilited: 0 };
}



export class UserFieldsLastId extends UserFields {
    @IsOptional()
    @Transform(transformObjectId)
    lastId: Types.ObjectId

    @IsOptional()
    @IsString()
    @Matches(/before|after/)
    time: Types.ObjectId
}

export class UserParam {
    @IsOptional()
    @Transform(transformObjectId)
    _id: Types.ObjectId
}