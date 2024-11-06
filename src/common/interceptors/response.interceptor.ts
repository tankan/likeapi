import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../types/response.types';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse> {
    return next.handle().pipe(map((data) => this.formatResponse(data)));
  }

  private formatResponse(data: any): ApiResponse {
    if (data && typeof data === 'object' && 'success' in data) {
      return data as ApiResponse;
    }
    return {
      success: true,
      data,
      message: '操作成功',
    };
  }
}
