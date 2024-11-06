import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Role } from '../common/enums/role.enum';
import { MembershipLevel } from '../common/enums/member.enum';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from '../types/api.types';
import * as bcrypt from 'bcrypt';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(createUserDto: CreateUserDto): Observable<UserDocument> {
    return this.checkExistingUser(createUserDto.username).pipe(
      switchMap(() => from(this.hashPassword(createUserDto.password))),
      switchMap((hashedPassword) => {
        const createdUser = new this.userModel({
          ...createUserDto,
          password: hashedPassword,
        });
        return from(createdUser.save());
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  findOne(id: string): Observable<UserDocument | null> {
    return from(this.userModel.findById(id).exec());
  }

  update(id: string, updateUserDto: UpdateUserDto): Observable<UserDocument> {
    return from(
      this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }),
    ).pipe(
      map((user) => {
        if (!user) {
          throw new NotFoundException('用户不存在');
        }
        return user;
      }),
    );
  }

  addPoints(userId: string, points: number): Observable<UserDocument> {
    return this.updateUserPoints(userId, points);
  }

  deductPoints(userId: string, points: number): Observable<UserDocument> {
    return this.updateUserPoints(userId, -points);
  }

  addUsageQuota(userId: string, quota: number): Observable<UserDocument> {
    return this.findUserById(userId).pipe(
      map((user) => {
        user.usageQuota += quota;
        return user.save();
      }),
      switchMap((user) => from(user)),
    );
  }

  checkMembership(user: UserDocument): Observable<boolean> {
    return from(
      Promise.resolve(
        user.role === Role.ADMIN ||
          (!!user.membershipExpiry && user.membershipExpiry > new Date()),
      ),
    );
  }

  handleDailyLogin(userId: string): Observable<void> {
    return this.addPoints(userId, 10).pipe(map(() => {}));
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron() {
    from(this.userModel.find({ membershipExpiry: { $lte: new Date() } }).exec())
      .pipe(
        switchMap((users) => from(users)),
        map((user) => {
          user.membershipLevel = MembershipLevel.NORMAL;
          user.membershipExpiry = null;
          return user.save();
        }),
        switchMap((user) => from(user)),
        map((user) => {
          this.logger.log(
            `用户 ${user.username} 的会员已过期，已降级为普通用户`,
          );
        }),
      )
      .subscribe();
  }

  findByUsername(username: string): Observable<UserDocument | null> {
    return from(this.userModel.findOne({ username }).exec());
  }

  private checkExistingUser(username: string): Observable<void> {
    return from(this.userModel.findOne({ username }).exec()).pipe(
      map((existing) => {
        if (existing) {
          throw new ConflictException('用户名已存在');
        }
      }),
    );
  }

  private hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 10));
  }

  private findUserById(userId: string): Observable<UserDocument> {
    return from(this.userModel.findById(userId).exec()).pipe(
      map((user) => {
        if (!user) throw new NotFoundException('用户未找到');
        return user;
      }),
    );
  }

  private updateUserPoints(
    userId: string,
    points: number,
  ): Observable<UserDocument> {
    return this.findUserById(userId).pipe(
      map((user) => {
        if (points < 0 && user.points < Math.abs(points)) {
          throw new UnauthorizedException('积分不足');
        }
        user.points += points;
        return user.save();
      }),
      switchMap((user) => from(user)),
    );
  }
}
