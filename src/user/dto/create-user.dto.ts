import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsEmail()
  readonly email: string; // 确保这是必需的

  @IsString()
  @IsNotEmpty()
  readonly nickname?: string;

  @IsString()
  @IsNotEmpty()
  readonly phone?: string;
}
