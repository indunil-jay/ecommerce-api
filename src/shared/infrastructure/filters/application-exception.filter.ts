import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { ApplicationException } from "src/shared/domain/application.exception";
import { ApplicationExceptionCode } from "src/shared/domain/enums/application-exception-code";



const CODE_TO_HTTP_STATUS: Record<ApplicationExceptionCode, HttpStatus> = {
    [ApplicationExceptionCode.CONFLICT]: HttpStatus.CONFLICT,
    [ApplicationExceptionCode.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [ApplicationExceptionCode.VALIDATION_ERROR]: HttpStatus.BAD_REQUEST,
}


@Catch(ApplicationException)
export  class ApplicationExceptionFilter implements ExceptionFilter {
    
    catch(exception: ApplicationException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = CODE_TO_HTTP_STATUS[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
            statusCode: status,
            message: exception.message,
        });

    }

}