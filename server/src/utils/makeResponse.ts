import { HttpStatus } from "@nestjs/common";

export default (results: {}, status: HttpStatus) => ({ status,  results })