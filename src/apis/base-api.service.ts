import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../types/api.types';

@Injectable()
export class BaseApiService {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {}

  protected getApiKey(keyName: string): string {
    return this.configService.get<string>(keyName);
  }

  protected makeRequest<T>(
    url: string,
    params: Record<string, any> = {},
  ): Observable<ApiResponse<T>> {
    const apiKey = this.getApiKey('APIKEY_TIAN');
    const queryParams = new URLSearchParams({ key: apiKey, ...params });

    return this.httpService.get<ApiResponse<T>>(`${url}?${queryParams}`).pipe(
      map((response) => response.data),
      catchError((error) => {
        this.logger.error(`API调用失败: ${error.message}`);
        if (error.response) {
          const { code, msg } = error.response.data;
          return throwError(
            () => new Error(`错误码: ${code}, 错误信息: ${msg}`),
          );
        }
        return throwError(() => new Error('API调用失败'));
      }),
    );
  }
}
