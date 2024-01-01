import { HttpStatus } from "@nestjs/common";

export default interface ResponseType {
    status: HttpStatus,
    message?: string,
    results?: {}
}