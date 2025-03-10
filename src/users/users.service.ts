import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtAuthService } from './jwt.service';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Role, RoleDocument } from './entities/role.entity';
import { LoginTypeEnum, RoleEnum } from 'src/common/enum/role.enum';
import { RegisterGuestDto } from './dto/register-guest.dto';
import { RegisterFbDto } from './dto/register-fb.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    private jwtAuthService: JwtAuthService,
  ) {}

  async register(userData: CreateUserDto): Promise<{
    user: Omit<UserDocument, 'roles' | 'password'> & { roles: string[] };
    token: string;
  }> {
    const { email, username } = userData;
    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new BadRequestException(
        existingUser.email === email
          ? 'Email already exists'
          : 'Username already exists',
      );
    }
    const userRole = await this.getRoleForNewUser();
    const user = new this.userModel({
      ...userData,
      roles: [userRole._id],
    });
    await user.save();
    const newUser = await this.getUserLoginData(user._id);
    const token = await this.generateNewTokenForUser(
      user._id,
      user.email,
      newUser.roles,
    );
    return { user: newUser, token };
  }

  private async generateNewTokenForUser(
    userId: Types.ObjectId,
    email: string,
    roles: string[],
  ) {
    return await this.jwtAuthService.generateToken({
      userId: userId.toString(),
      email,
      roles,
    });
  }

  private async getRoleForNewUser() {
    let userRole = await this.roleModel.findOne({ title: RoleEnum.USER });
    if (!userRole) {
      userRole = await this.roleModel.create({ title: RoleEnum.USER });
    }
    return userRole;
  }

  async getUserProfile(
    userId: string,
  ): Promise<Omit<UserDocument, 'password' | 'roles'> & { roles: string[] }> {
    try {
      const userid = new Types.ObjectId(userId);
      const populatedUser = await this.getUserLoginData(userid);
      if (!populatedUser) {
        throw new NotFoundException('User not found');
      }

      return populatedUser;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async getUserLoginData(
    userId: Types.ObjectId,
  ): Promise<Omit<UserDocument, 'roles' | 'password'> & { roles: string[] }> {
    const populatedUser = await this.userModel
      .findById(userId)
      .populate({ path: 'roles', model: Role.name })
      .lean()
      .exec();

    if (!populatedUser) {
      throw new Error('User not found');
    }

    const roleTitles = populatedUser.roles.map((role) => role.title);
    const { password, roles, ...userWithoutPassword } = populatedUser;

    return { ...userWithoutPassword, roles: roleTitles };
  }

  async login(
    userData: LoginDto,
  ): Promise<{ user: UserDocument; token: string }> {
    const { email, password } = userData;
    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .populate({ path: 'roles', model: Role.name });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const roleTitles: string[] = user.roles.map((role: any) => role.title);
    const token = await this.generateNewTokenForUser(
      user._id,
      user.email,
      roleTitles,
    );
    return { user, token };
  }

  async handleFacebookAuth(fbData: RegisterFbDto): Promise<{
    user: Omit<UserDocument, 'roles' | 'password'> & { roles: string[] };
    token: string;
    msg: string;
  }> {
    const { providerId, email, firstName, lastName, deviceId } = fbData;
    if (!providerId || !deviceId) {
      throw new BadRequestException(
        'Provider ID and Device ID are required for social login',
      );
    }
    let user = await this.userModel.findOne({
      $or: [{ providerId: providerId }, { email }],
    });
    let msg = 'User loggedin successfully ';
    if (!user) {
      const userRole = await this.getRoleForNewUser();
      user = new this.userModel({
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        provider: LoginTypeEnum.FACEBOOK,
        providerId: providerId,
        roles: [userRole._id],
        device: deviceId ? { deviceId } : undefined,
      });
      await user.save();
      msg = 'User registered successfully ';
    }

    const newUser = await this.getUserLoginData(user._id);
    const token = await this.generateNewTokenForUser(
      user._id,
      user.email,
      newUser.roles,
    );
    return { msg, user: newUser, token };
  }

  async handleGuestAuth(guestData: RegisterGuestDto): Promise<{
    user: Omit<UserDocument, 'roles' | 'password'> & { roles: string[] };
    token: string;
    msg: string;
  }> {
    const { deviceId } = guestData;
    if (!deviceId) {
      throw new BadRequestException('Device ID is required for Guest user');
    }
    let user = await this.userModel.findOne({
      'device.deviceId': deviceId,
      provider: LoginTypeEnum.GUEST,
    });
    let msg = 'User loggedin successfully ';
    if (!user) {
      const userRole = await this.getRoleForNewUser();
      user = new this.userModel({
        provider: LoginTypeEnum.GUEST,
        providerId: uuidv4(),
        roles: [userRole._id],
        device: deviceId ? { deviceId } : undefined,
      });
      await user.save();
      msg = 'User registered successfully ';
    }

    const newUser = await this.getUserLoginData(user._id);
    const token = await this.generateNewTokenForUser(
      user._id,
      user.email,
      newUser.roles,
    );
    return { msg, user: newUser, token };
  }
}
