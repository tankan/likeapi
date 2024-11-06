import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Put,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
  ApiResponse,
  ApiResponseDto,
} from '../types/api.types';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { Cache } from '../common/decorators/cache.decorator';
import { CacheGuard } from '../common/guards/cache.guard';
import { Fee } from '../common/decorators/fee.decorator';
import { FeesGuard } from '../common/guards/fees.guard';
import { UserDocument } from './schemas/user.schema';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseController } from '../common/base.controller';

@ApiTags('Users')
@Controller('users')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get('getHello')
  @UseGuards(CacheGuard)
  @Cache(3600)
  @SwaggerApiResponse({
    status: 200,
    description: 'Success',
    type: ApiResponseDto,
  })
  getHello(): Observable<ApiResponse<string>> {
    return of('hello world').pipe(
      map((data) => this.handleSuccess(data)),
    ) as Observable<ApiResponse<string>>;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @SwaggerApiResponse({
    status: 201,
    description: 'User created successfully',
    type: ApiResponseDto,
  })
  register(
    @Body() createUserDto: CreateUserDto,
  ): Observable<ApiResponse<Partial<UserDocument>>> {
    return this.userService.create(createUserDto).pipe(
      map((user) => this.handleSuccess(user, '注册成功')),
      catchError((error) => this.handleError(error)),
    ) as Observable<ApiResponse<Partial<UserDocument>>>;
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @SwaggerApiResponse({ status: 200, description: 'Login successful' })
  login(
    @Body() loginUserDto: LoginUserDto,
  ): Observable<ApiResponse<Partial<UserDocument>>> {
    return this.userService
      .findByUsername(loginUserDto.username)
      .pipe(
        map((user) =>
          this.handleSuccess(user, user ? '登录成功' : '用户不存在'),
        ),
      ) as Observable<ApiResponse<Partial<UserDocument>>>;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Observable<ApiResponse<Partial<UserDocument>>> {
    return this.userService.update(id, updateUserDto).pipe(
      map((user) => this.handleSuccess(user, '更新成功')),
      catchError((error) => this.handleError(error)),
    ) as Observable<ApiResponse<Partial<UserDocument>>>;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id') id: string,
  ): Observable<ApiResponse<Partial<UserDocument>>> {
    return this.userService
      .findOne(id)
      .pipe(
        map((user) =>
          this.handleSuccess(user, user ? '获取成功' : '用户不存在'),
        ),
      ) as Observable<ApiResponse<Partial<UserDocument>>>;
  }

  @Get('admin-data')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, CacheGuard)
  @Cache(3600)
  getAdminData(): Observable<ApiResponse<string>> {
    return of('这是管理员专属数据').pipe(
      map((data) => this.handleSuccess(data, '获取成功')),
    ) as Observable<ApiResponse<string>>;
  }

  @Get('paid-data')
  @Fee(50)
  @UseGuards(JwtAuthGuard, FeesGuard, CacheGuard)
  @Cache(3600)
  getPaidData(): Observable<ApiResponse<string>> {
    return of('这是付费用户的数据').pipe(
      map((data) => this.handleSuccess(data, '获取成功')),
    ) as Observable<ApiResponse<string>>;
  }
}
