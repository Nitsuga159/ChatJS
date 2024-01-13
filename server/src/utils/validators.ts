import { Transform } from "class-transformer"
import { IsOptional, IsString, Matches } from "class-validator"
import { Types } from "mongoose"
import { transformObjectId } from "./fieldsTransform"

export class QueryParameters {
  @IsOptional()
  @Transform(transformObjectId)
  lastId: Types.ObjectId

  @IsOptional()
  @IsString()
  @Matches(/before|after/)
  time: 'before' | 'after'

  @IsOptional()
  @IsString()
  @Matches(/first-one|last-one/)
  start: 'first-one' | 'last-one'
}