import {
  Inject,
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_TTL } from '../decorators/cache.decorator';
import { Cache } from 'cache-manager';
import { createHash } from 'crypto';

@Injectable()
export class CacheGuard implements CanActivate {
  private readonly logger = new Logger(CacheGuard.name);
  private static readonly MAX_QUERY_PARAMS = 10; // 最大查询参数数量
  private static readonly MAX_PARAM_LENGTH = 100; // 每个参数的最大长度

  constructor(
    private reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const cacheTTL = this.reflector.getAllAndOverride<number>(CACHE_TTL, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!cacheTTL) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const cacheKey = this.generateCacheKey(request);
    const cachedResponse = await this.cacheManager.get(cacheKey);

    if (cachedResponse) {
      this.logger.log(`缓存命中，key: ${cacheKey}, cacheTTL: ${cacheTTL}秒`);
      const response = context.switchToHttp().getResponse();
      response.status(200).json(cachedResponse);
      return false;
    }

    request.cacheKey = cacheKey;
    request.cacheTTL = cacheTTL;

    return true;
  }

  private generateCacheKey(request: any): string {
    const { method, originalUrl, query } = request;
    const simplifiedUrl = originalUrl.split('?')[0];

    let queryPart = '';
    if (Object.keys(query).length > 0) {
      const limitedQuery = this.limitQueryParams(query);
      const sortedQuery = Object.keys(limitedQuery)
        .sort()
        .reduce((result, key) => {
          result[key] = limitedQuery[key];
          return result;
        }, {});
      queryPart = this.getQueryHash(JSON.stringify(sortedQuery));
    }

    return `${method}:${simplifiedUrl}:${queryPart}`;
  }

  private limitQueryParams(query: Record<string, any>): Record<string, any> {
    const limitedQuery: Record<string, any> = {};
    const keys = Object.keys(query).slice(0, CacheGuard.MAX_QUERY_PARAMS);

    for (const key of keys) {
      if (typeof query[key] === 'string') {
        limitedQuery[key] = query[key].slice(0, CacheGuard.MAX_PARAM_LENGTH);
      } else {
        limitedQuery[key] = query[key];
      }
    }

    return limitedQuery;
  }

  private getQueryHash(queryString: string): string {
    return createHash('md5').update(queryString).digest('hex').slice(0, 8);
  }
}
