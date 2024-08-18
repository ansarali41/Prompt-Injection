import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './base/DTO/create-user.dto';
import { UserService } from './user.service';
import { UserLoginDto } from './base/DTO/user-login.dto';

@Controller()
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async userSingUp(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.signUp(createUserDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<any> {
    try {
      const user = await this.userService.login(userLoginDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'User logged in successfully',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }
}
