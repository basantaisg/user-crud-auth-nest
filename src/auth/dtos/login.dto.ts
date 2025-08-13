import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @MinLength(4)
  @MaxLength(16)
  @IsNotEmpty()
  password: string;
}
