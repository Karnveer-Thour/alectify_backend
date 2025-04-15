import { sentryLog } from '@core/sentry/sentry.init';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly environment: string) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const environment = this.environment;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status;
    let message;
    let stack;
    let error;
    console.log(` all exceptions  URL => ${request.url}`, exception);
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionDetails: any = exception.getResponse().valueOf();
      message = exceptionDetails.message;
      if (exceptionDetails?.statusCode === 444) {
        // For out of stock exception only.
        status = exceptionDetails.statusCode;
      }
      if (Array.isArray(message)) {
        message = message.length
          ? message[0]
          : HttpStatus.INTERNAL_SERVER_ERROR;
      }
      error = exceptionDetails.error;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      const exceptionDetails: any = exception;
      message = exceptionDetails.message;
      stack = exceptionDetails.stack;
      error = 'Unhandled Rejection';

      if (environment !== 'DEV') {
        // Additional Exceptiona logs for 500 only in prod.
        console.log(
          `Additional Exception log  URL => ${request.url} with Stack & error =>`,
          stack,
          error,
        );
        stack = undefined;
        message = 'Internal server error';
        error = undefined;
      }
    }
    sentryLog({ operation: request.url, name: exception, error: exception });
    response.status(status).json({
      status: false,
      statusCode: status,
      message,
      error,
      stack,
    });
  }
}
