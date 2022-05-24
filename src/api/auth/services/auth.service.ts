import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { BcryptService } from '../../../package/services/bcrypt.service';
import { UserService } from '../../users/service/user.service';
import { LoginDto } from '../../../package/dto/user/login.dto';
import { UserResponseDto } from '../../../package/dto/response/user-response.dto';
import { UserDto } from '../../../package/dto/user/user.dto';
import { SystemException } from '../../../package/exceptions/system.exception';
import { UserRoleDto } from '../../../package/dto/user/user-role.dto';
import { CustomUserRoleDto } from '../../../package/dto/user/custom-user-role.dto';
import { RoleName } from '../../../package/enum/role-name.enum';
import { ChangePasswordDto } from '../../../package/dto/user/change-password.dto';
import * as fs from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly bcryptService: BcryptService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    try {
      const user = await this.validateUser(loginDto);

      if (user) {
        const userRoles = await this.userService.findRolesByUserId(user.id);
        const userResponseDto = await this.generatePayload(user, userRoles);

        delete user.password;

        const payload = { response: userResponseDto, user };

        return await this.generateToken(payload, loginDto.isRemembered);
      } else {
        throw new SystemException({
          message: 'User info or password is not valid',
        });
      }
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async validateUser(loginDto: LoginDto): Promise<UserDto> {
    try {
      let emailOrPhone = loginDto.phone;

      if (!emailOrPhone) {
        emailOrPhone = loginDto.email;
      }

      const user: UserDto = await this.userService.findOneByEmailOrPhone(
        emailOrPhone,
      );

      if (!user) {
        return null;
      }

      const isPasswordMatched = await this.bcryptService.comparePassword(
        loginDto.password,
        user?.password,
      );

      if (isPasswordMatched) {
        return { ...user };
      }
      return null;
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async generatePayload(
    userDto: UserDto,
    userRoles: UserRoleDto[],
  ): Promise<UserResponseDto> {
    let isAdmin = false;
    let isUser = false;

    const customUserRoleDtos = [];
    for (const userRole of userRoles) {
      const customUserRoleDto = new CustomUserRoleDto();
      customUserRoleDto.role = userRole.role?.role as RoleName;

      switch (userRole.role?.role as RoleName) {
        case RoleName.ADMIN_ROLE:
          isAdmin = true;
          break;
        case RoleName.USER_ROLE:
          isUser = true;
          break;
      }
      customUserRoleDtos.push(customUserRoleDto);
    }

    const userResponseDto = new UserResponseDto();
    userResponseDto.userID = userDto.id;
    userResponseDto.phone = userDto.phone;
    userResponseDto.userName =
      (userDto.firstName || '') + ' ' + (userDto.lastName || '');
    userResponseDto.roles = customUserRoleDtos;

    userResponseDto.isAdmin = isAdmin;
    userResponseDto.isUser = isUser;

    userResponseDto.paymentStatus = userDto.payment;

    return Promise.resolve(userResponseDto);
  }

  /************* relation setter ***************/

  async generateToken(payload: any, isRemembered = 1): Promise<string> {
    const privateKEY = fs.readFileSync('env/jwtRS256.key');

    let accessToken;

    if (isRemembered === 1) {
      accessToken = jwt.sign({ ...payload }, privateKEY, {
        expiresIn: '1d',
        algorithm: 'RS256',
      });
    } else {
      accessToken = jwt.sign({ ...payload }, privateKEY, {
        expiresIn: '1h',
        algorithm: 'RS256',
      });
    }
    return Promise.resolve(accessToken);
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<UserDto> {
    try {
      const user = await this.userService.updatePassword(changePasswordDto);
      if (user) {
        delete user.password;
        return Promise.resolve(user);
      } else {
        throw new SystemException({
          message: 'User phone or email is not correct',
        });
      }
    } catch (error) {
      throw new SystemException(error);
    }
  }
}
