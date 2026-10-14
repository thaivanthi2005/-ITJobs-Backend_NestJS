import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const res = exception.getResponse() as any;

    let message = 'Dữ liệu không hợp lệ!';
    if (res && Array.isArray(res.message) && res.message.length > 0) {
      message = res.message[0];
    } else if (res && typeof res.message === 'string') {
      message = res.message;
    }

    response.status(200).json({
      code: 'error',
      message: message,
    });
  }
}
