import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/user.service';
import { Role } from '../enums/role.enum';

@Injectable()
export class FeesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFee = this.reflector.get<number>('fee', context.getHandler());
    if (!requiredFee) return true; // 如果没有费用要求，允许访问

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // 检查 user 是否存在
    if (!user) {
      throw new UnauthorizedException('用户未认证');
    }

    // 检查 user.role 是否存在
    if (!user.role) {
      throw new ForbiddenException('用户角色未定义');
    }
    if (user.role === Role.ADMIN) return true;

    const hasMembership = await this.userService.checkMembership(user);

    if (hasMembership && user.role === Role.MEMBER) return true;

    // 检查用户积分是否足够
    if (user.points >= requiredFee) {
      // 扣除积分
      await this.userService.deductPoints(user.userId, requiredFee);
      return true;
    } else {
      throw new ForbiddenException('积分不足，无法访问此接口');
    }
  }
}
