import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dtos/login.dto';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  //   Register User!
  async register(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 5);
    let userInfo = { ...createUserDto, password: hashedPassword };
    return this.usersService.createUser(userInfo);
  }

  //   Login!

  async login(loginDto: LoginDto) {
    const isUserExists = this.usersService.getUserByEmail(loginDto.email);
    if (!isUserExists)
      throw new NotFoundException(
        `User with email: ${loginDto.email} doesn't exists!`,
      );

    const isValidUser = await bcrypt.compare(
      loginDto.password,
      isUserExists.password,
    );

    if (!isValidUser) {
      throw new HttpException('Password doesnt match', 401);
    }
    const access_Token = this.jwtService.sign(
      {
        userId: isUserExists.id,
        email: loginDto.email,
      },
      { expiresIn: '15m' },
    );

    const refresh_Token = this.jwtService.sign(
      {
        userId: isUserExists.id,
        email: loginDto.email,
      },
      { expiresIn: '7d' },
    );
    return {
      refresh_Token,
      access_Token,
    };
  }
}
