import { HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiResponse } from '../types/response.types';

export class BaseController {
  protected handleSuccess<T>(
    data: T,
    message: string = '操作成功',
  ): ApiResponse<T> {
    return { success: true, data, message };
  }

  protected handleError(error: any): Observable<never> {
    const message = error.response?.msg || error.message || '请求失败';
    const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    throw new HttpException({ success: false, message, data: null }, status);
  }
}
