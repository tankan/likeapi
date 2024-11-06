# Like API

一个提供各种有趣 API 的服务平台，基于 NestJS 开发。

## 功能特点

- 用户系统
  - 用户注册/登录
  - JWT 认证
  - 会员等级
  - 积分系统
  - 使用配额

- API 服务
  - 彩虹屁
  - 景点信息
  - 土味情话
  - 星座运势
  - 垃圾分类
  - 晚安心语
  - 早安心语
  - 健康小提示
  - 生活小窍门
  - 二十四节气
  - 中草药查询
  - 药品信息
  - 历史上的今天
  - 本草纲目
  - 十万个为什么

- 系统特性
  - Redis 缓存
  - Swagger API 文档
  - 统一响应格式
  - 全局异常处理
  - 请求参数验证
  - 定时任务处理

## 技术栈

- NestJS
- MongoDB
- Redis
- TypeScript
- RxJS
- JWT
- Swagger

## 环境要求

- Node.js >= 16
- MongoDB >= 4.0
- Redis >= 6.0
- pnpm >= 8.0

## 安装部署

1. 克隆项目

```bash
git clone <repository-url>
cd likeapi
```

2. 安装依赖

```bash
pnpm install
```

3. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置以下环境变量
PORT=3000
MONGODB_URI=mongodb://localhost:27017/likeapi
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_NAME=likeredis
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=20h
API_KEY=your-api-key
```

4. 启动 MongoDB 和 Redis

```bash
# 使用 Docker 启动服务
pnpm docker:up
```

5. 启动 API 服务

```bash
# 开发环境
pnpm start:dev
# 生产环境
pnpm build
pnpm start:prod
```

## API 文档

启动服务后访问：`http://localhost:3000/api` 查看 Swagger API 文档

## 缓存策略

| API 类型 | 缓存时间 | 说明 |
|---------|---------|------|
| 景点信息 | 1小时 | 景点数据变化不频繁 |
| 星座运势 | 1分钟 | 运势数据需要及时更新 |
| 垃圾分类 | 1小时 | 分类信息相对稳定 |
| 节气信息 | 24小时 | 节气数据固定 |
| 药品信息 | 24小时 | 药品数据稳定 |
| 历史上的今天 | 24小时 | 历史数据固定 |

## 项目结构

src/
├── apis/ # API 相关模块
├── auth/ # 认证模块
├── common/ # 公共模块
│ ├── decorators/ # 自定义装饰器
│ ├── filters/ # 异常过滤器
│ ├── guards/ # 守卫
│ ├── interceptors/ # 拦截器
│ └── enums/ # 枚举定义
├── types/ # 类型定义
├── user/ # 用户模块
└── main.ts # 应用入口

## 开发指南

### 添加新的 API 端点

```typescript
@Get('new-endpoint')
@UseGuards(CacheGuard)
@Cache(3600)
@ApiOperation({ summary: 'New API Endpoint' })
@SwaggerApiResponse({ status: 200, description: 'Success', type: ApiResponseDto })
getNewEndpoint(): Observable<ApiResponse<any>> {
		return this.apiService.getNewEndpoint().pipe(
				map(response => this.handleSuccess(response.result)),
				catchError(error => this.handleError(error))
		);
}
```

### 添加新的缓存装饰器

```typescript
@SetMetadata('cache-ttl', 3600)
export function Cache(ttl: number) {
	return applyDecorators(
		SetMetadata('cache-ttl', ttl),
		UseInterceptors(CacheInterceptor)
	);
}
```

### 添加新的守卫

```typescript
@Injectable()
export class NewGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		// 实现守卫逻辑
		return true;
	}
}
```

## 测试

```bash
# 单元测试
pnpm test
# e2e 测试
pnpm test:e2e
# 测试覆盖率
pnpm test:cov
```

## Docker 部署

1. 构建镜像和运行容器

```bash
docker-compose up -d
```

## 常见问题

1. Redis 连接失败
   - 检查 Redis 服务是否正常运行
   - 确认环境变量配置是否正确

2. MongoDB 连接失败
   - 检查 MongoDB 服务是否正常运行
   - 确认数据库连接字符串是否正确

3. API 调用失败
   - 检查 API_KEY 是否正确配置
   - 确认请求参数是否符合要求

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

[MIT](LICENSE)

## 联系方式

- 作者：[曾星旗](https://canicode.cn)
- 邮箱：me@zengxingqi.com

## 致谢

- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)
- [天行数据](https://www.tianapi.com/)
