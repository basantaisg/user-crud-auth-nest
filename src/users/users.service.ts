import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { Users } from './interfaces/users.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  private userData = [
    {
      id: v4(),
      name: 'basanta',
      email: 'basanta@gmail.com',
      password: 'basanta@1$',
    },
  ];

  getAllUsers(): Users[] {
    return this.userData;
  }

  getUserById(id: string): Users {
    const user = this.userData.find((u) => u.id == id);

    if (!user) throw new HttpException('User Not found!', 404);

    return user;
  }

  getUserByEmail(email: string): Users {
    const user = this.userData.find((u) => u.email === email);
    if (!user)
      throw new NotFoundException('User with this email doesnt exists');
    return user;
  }

  createUser(createUserdto: CreateUserDto) {
    let id = v4();
    const newUser = { id, ...createUserdto };
    return {
      message: 'User created successfully!',
      newUser,
    };
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = this.userData.find((u) => u.id === id);
    if (!user) throw new HttpException('User not found', 404);
    return { user, ...updateUserDto };
  }

  deleteUser(id: string) {
    const findIndex = this.userData.findIndex((u) => u.id == id);
    if (findIndex == -1) throw new NotFoundException('Not found!');
    let deletedUser = this.userData.splice(findIndex, 1);
    return { message: 'User deleted successfully!', deletedUser };
  }
}
