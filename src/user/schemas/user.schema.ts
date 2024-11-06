import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from '../../common/enums/role.enum';
import { MembershipLevel } from '../../common/enums/member.enum';

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string; // 请确保密码加密存储

  @Prop()
  nickname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ type: Object }) // 存储第三方联合登陆信息
  thirdParty: Record<string, any>;

  @Prop({ enum: Role, default: Role.USER })
  role: Role;

  @Prop({ default: 0 })
  points: number;

  @Prop({ default: 0 })
  usageQuota: number;

  @Prop({ enum: MembershipLevel, default: MembershipLevel.NORMAL })
  membershipLevel: MembershipLevel;

  @Prop()
  membershipExpiry: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
