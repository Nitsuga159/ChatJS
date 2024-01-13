import { IsNumber, IsOptional, IsString, Matches } from "class-validator";

export class CodeVerification {
    @IsString()
    @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    mail: string
}

export class CodeVerificationVerify {
    @IsString()
    @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    mail: string

    @IsNumber()
    code: number
}