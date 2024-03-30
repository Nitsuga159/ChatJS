import { Transform } from "class-transformer"
import { IsOptional, IsString, Matches } from "class-validator"
import { Types } from "mongoose"
import { transformObjectId } from "./fieldsTransform"

export class QueryParameters {
  @IsOptional()
  @Transform(transformObjectId)
  lastId: Types.ObjectId

  @IsString()
  @IsOptional()
  @Matches(/^before$|^after$/)
  time: 'before' | 'after'

  @IsString()
  @IsOptional()
  @Matches(/^down$|^up$/)
  to: 'down' | 'up'
}