import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { BaseController } from '../common/base.controller';
import { Observable, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ApiResponse } from '../types/response.types';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
    super();
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): Observable<ApiResponse<{ token: string }>> {
    return from(this.authService.login(req.user)).pipe(
      switchMap((token) =>
        from(this.userService.handleDailyLogin(req.user.userId)).pipe(
          map(() => token),
        ),
      ),
      map((token) => {
        if (typeof token === 'string') {
          return this.handleSuccess({ token }, '登录成功');
        } else if (token && typeof token.access_token === 'string') {
          return this.handleSuccess({ token: token.access_token }, '登录成功');
        } else {
          throw new Error('无效的 token 格式');
        }
      }),
      catchError((error) => this.handleError(error)),
    );
  }
}
