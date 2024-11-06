import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisClientType } from 'redis';

@Injectable()
export class CacheSetInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheSetInterceptor.name);
  private redisClient: RedisClientType | null = null;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.initializeRedisClient();
  }

  private async initializeRedisClient() {
    const store = (this.cacheManager as any).store;
    if (store && store.name === 'redis') {
      this.redisClient = this.getRedisClient(store);
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async (data) => {
        const request = context.switchToHttp().getRequest();
        const { cacheKey, cacheTTL } = request;

        if (cacheKey && cacheTTL) {
          await this.setCacheData(cacheKey, data, cacheTTL);
        }
      }),
    );
  }

  private async setCacheData(
    key: string,
    data: any,
    ttl: number,
  ): Promise<void> {
    try {
      const jsonData = JSON.stringify(data);
      if (this.redisClient) {
        await this.redisClient.setEx(key, ttl, jsonData);
        this.logger.log(`使用 Redis 缓存设置，key: ${key}, TTL: ${ttl}秒`);
      } else {
        await this.cacheManager.set(key, data, ttl);
        this.logger.log(`使用内存缓存设置，key: ${key}, TTL: ${ttl}秒`);
      }

      const actualTTL = await this.getTTL(key);
      this.logger.log(`缓存已设置，key: ${key}, 实际 TTL: ${actualTTL}秒`);
    } catch (err) {
      this.logger.error('设置缓存时发生错误:', err);
    }
  }

  private getRedisClient(store: any): RedisClientType | null {
    if (store.client && typeof store.client.setEx === 'function') {
      return store.client;
    }
    if (store.getClient && typeof store.getClient === 'function') {
      const client = store.getClient();
      if (client && typeof client.setEx === 'function') {
        return client;
      }
    }
    return null;
  }

  private async getTTL(key: string): Promise<number> {
    if (this.redisClient) {
      return await this.redisClient.ttl(key);
    }
    return -1;
  }
}
