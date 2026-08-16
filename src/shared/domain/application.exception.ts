import { ApplicationExceptionCode } from "./enums/application-exception-code";


export class ApplicationException extends Error {
    constructor(
        message: string ,
        public readonly code: ApplicationExceptionCode =ApplicationExceptionCode.VALIDATION_ERROR,
    ) {
        super(message);
        this.name = ApplicationException.name;
    }
}