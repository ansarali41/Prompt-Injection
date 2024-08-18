import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './base/DTO/create-user.dto';
import { UserLoginDto } from './base/DTO/user-login.dto';
import { User } from './base/schemas/user-schemas';
import bcrypt = require('bcryptjs');

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    try {
      // check if user already exists
      const existingUser = await this.userModel.findOne({
        username: createUserDto.username,
      });

      if (existingUser) {
        throw new NotFoundException('User already exists with this username.');
      }

      const hashed = await bcrypt.hash(createUserDto.password, 12);

      const userObj = new this.userModel({
        ...createUserDto,
        password: hashed,
      });
      const userDocs = await userObj.save();
      const user = userDocs.toObject();
      delete user.password;

      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(userLoginDto: UserLoginDto): Promise<any> {
    try {
      const user = await this.findOneUser({ username: userLoginDto.username });

      const isPasswordMatched = await bcrypt.compare(
        userLoginDto.password,
        user.password,
      );

      if (!isPasswordMatched) {
        throw new NotFoundException('Invalid credentials');
      }

      delete user.password;

      const jwtToken = await this.jwtService.signAsync({
        _id: user._id,
        username: user.username,
      });

      return { access_token: jwtToken };
    } catch (error) {
      throw error;
    }
  }

  async findOneUser(option: any): Promise<any> {
    try {
      const user = await this.userModel.findOne(option);

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user.toObject();
    } catch (error) {
      throw error;
    }
  }
}
