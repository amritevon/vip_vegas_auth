import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Request } from 'express';
import { RegisterFbDto } from './dto/register-fb.dto';
import { RegisterGuestDto } from './dto/register-guest.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('registerOrLogin/fb')
  async registerOrLoginFB(@Body() body: RegisterFbDto) {
    try {
      return this.userService.handleFacebookAuth(body);
    } catch (error) {
      throw error;
    }
  }

  @Post('registerOrLogin/guest')
  async registerOrLoginGuest(@Body() body: RegisterGuestDto) {
    try {
      return this.userService.handleGuestAuth(body);
    } catch (error) {
      throw error;
    }
  }

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    try {
      return this.userService.register(body);
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.userService.login(body);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: RequestWithUser) {
    try {
      return this.userService.getUserProfile(req.user.userId);
    } catch (error) {
      throw error;
    }
  }
}
