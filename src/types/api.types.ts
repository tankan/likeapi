import { ApiProperty } from '@nestjs/swagger';

// 接口响应
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  code?: number;
  result?: T;
  msg?: string;
}

// Swagger 文档用的 DTO
export class ApiResponseDto<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data: T;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  code?: number;

  @ApiProperty({ required: false })
  result?: T;

  @ApiProperty({ required: false })
  msg?: string;
}

// 用户
export class User {
  @ApiProperty()
  _id: string; // 用户ID
  @ApiProperty()
  username: string; // 用户名
  @ApiProperty()
  password: string; // 密码
  @ApiProperty()
  role: string; // 角色
  @ApiProperty()
  points: number; // 积分
  @ApiProperty()
  membershipLevel: string; // 会员等级
  @ApiProperty({ type: Date, nullable: true })
  membershipExpiry: Date | null; // 会员到期时间
  @ApiProperty()
  usageQuota: number; // 使用配额
  save?: () => Promise<User>; // 保存用户
}

// 创建用户参数
export interface CreateUserDto {
  username: string; // 用户名
  email: string; // 邮箱
  password: string; // 密码
}

// 登录用户参数
export interface LoginUserDto {
  username: string; // 用户名
  password: string; // 密码
}

// 更新用户参数
export interface UpdateUserDto {
  email?: string; // 邮箱
  password?: string; // 密码
}

// 彩红屁结果
export class CaiHongPiResult {
  @ApiProperty()
  content: string;
}

// 景点结果
export class ScenicResult {
  @ApiProperty()
  word: string;

  @ApiProperty({ required: false })
  num?: number;

  @ApiProperty({ required: false })
  page?: string;

  @ApiProperty({ required: false })
  province?: string;

  @ApiProperty({ required: false })
  city?: string;
}

// 景点参数
export interface ScenicParams {
  // 定义景点参数的具体字段
  name: string; // 景点名称
  content: string; // 内容
  province: string; // 省份
  city: string; // 城市
}

// 土味情话
export class SayLoveResult {
  @ApiProperty()
  content: string;
}

// 星座运势结果
export class StarFortuneResult {
  @ApiProperty()
  type: string;

  @ApiProperty()
  content: string;
}

// 星座运势参数
export interface StarFortuneParams {
  astro: string; // 星座
  date?: string; // 日期
}

// 垃圾分类参数
export interface TrashClassificationParams {
  word: string; // 关键词
  mode?: number; // 模式
  num?: number; // 数量
  page?: number; // 页码
}

// 垃圾分类结果
export class TrashClassificationResult {
  @ApiProperty()
  name: string;

  @ApiProperty()
  type: number;

  @ApiProperty()
  aipre: number;

  @ApiProperty()
  explain: string;

  @ApiProperty()
  contain: string;

  @ApiProperty()
  tip: string;
}

// 晚安心语结果
export class GoodNightResult {
  @ApiProperty()
  content: string;
}

// 早安心语结果
export class GoodMorningResult {
  @ApiProperty()
  content: string;
}

// 健康小提示结果
export class HealthTipResult {
  @ApiProperty()
  content: string;
}

// 生活小窍门结果
export class LifeTipResult {
  @ApiProperty()
  content: string;
}

// 二十四节气查询参数
export interface SolarTermParams {
  word: string; // 24节气名称
  year?: string; // 指定年份（可选）
}

// 二十四节气查询结果
export class SolarTermResult {
  @ApiProperty()
  name: string;

  @ApiProperty()
  nameimg: string;

  @ApiProperty()
  day: string;

  @ApiProperty({ required: false })
  date?: {
    gregdate: string;
    lunardate: string;
    cnyear: string;
    cnmonth: string;
    cnday: string;
    cnzodiac: string;
  };

  @ApiProperty()
  yuanyin: string;

  @ApiProperty()
  shiju: string;

  @ApiProperty()
  jieshao: string;

  @ApiProperty()
  xishu: string;

  @ApiProperty()
  meishi: string;

  @ApiProperty()
  yiji: string;
}

// 中草药查询参数
export interface ChineseHerbParams {
  word: string; // 草药名称
  num?: number; // 默认数量
  page?: number; // 翻页
}

// 中草药查询结果
export class ChineseHerbResult {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;
}

// 药品查询参数
export interface MedicineParams {
  word: string; // 药品名称
  num?: number; // 默认数量
  page?: number; // 翻页
}

// 药品查询结果
export class MedicineResult {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;
}

// 历史上的今天查询参数
export interface HistoryTodayParams {
  date: string; // 日期，格式为MMDD
}

// 历史上的今天查询结果
export class HistoryTodayResult {
  @ApiProperty()
  title: string;

  @ApiProperty()
  lsdate: string;
}

// 本草纲目查询参数
export interface BenCaoGangMuParams {
  name: string; // 药品名称
  num?: number; // 返回数量，取值1-10
  page?: number; // 翻页
}

// 本草纲目查询结果
export class BenCaoGangMuResult {
  @ApiProperty()
  name: string;

  @ApiProperty()
  content: string;
}

// 十万个为什么查询参数
export interface TenWhyParams {
  word?: string; // 搜索内容标题
  typeid?: number; // 指定类型
  num?: number; // 返回数量，范围1-10
  page?: number; // 翻页
}

// 十万个为什么查询结果
export class TenWhyResult {
  @ApiProperty()
  typeid: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;
}

export class SomeClass {
  @ApiProperty()
  someProperty: string;

  // ... 其他属性 ...
}
