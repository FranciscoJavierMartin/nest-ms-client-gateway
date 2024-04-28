import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const rpcError = exception.getError();

    return typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
      ? response.status(rpcError.status).json(rpcError)
      : response
          .status(400)
          .json({ status: HttpStatus.BAD_REQUEST, message: rpcError });
  }
}
