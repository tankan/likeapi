import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { CacheSetInterceptor } from './common/interceptors/cache-set.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('Like API')
    .setDescription(
      `
      一个提供各种有趣API的服务
      
      ## 功能特点
      - 支持多种API调用
      - 缓存机制
      - 用户认证
      - 权限控制
      
      ## 使用说明
      1. 注册账号
      2. 登录获取token
      3. 使用token调用API
    `,
    )
    .setVersion('1.0')
    .addTag('apis', 'API相关接口 - 包含各种有趣的API调用')
    .addTag('users', '用户相关接口 - 包含注册、登录等功能')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: '输入JWT token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 设置 Swagger UI 的访问路径
  SwaggerModule.setup('api', app, document);

  const cacheSetInterceptor = app.get(CacheSetInterceptor);
  app.useGlobalInterceptors(cacheSetInterceptor);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT);
  console.log(`Like API服务启动成功：http://localhost:${process.env.PORT}`);
  console.log(`Swagger API文档地址: http://localhost:${process.env.PORT}/api`);
}
bootstrap();
