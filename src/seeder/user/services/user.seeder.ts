import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../packages/entities/user/user.entity';
import { RoleEntity } from '../../../packages/entities/user/role.entity';
import { UserRoleEntity } from '../../../packages/entities/user/user-role.entity';
import { BcryptService } from '../../../packages/services/bcrypt.service';
import { usersObject } from '../../../packages/json/users.json';
import { RoleName } from '../../../packages/enum/role-name.enum';
import { UserDto } from '../../../packages/dto/user/user.dto';

@Injectable()
export class UserSeeder {
  private readonly logger = new Logger(UserSeeder.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
    private bcryptService: BcryptService,
  ) {}

  async initUsers(): Promise<boolean> {
    await this.createUsers();
    return true;
  }

  async createUsers(): Promise<boolean> {
    try {
      for (const userObject of usersObject) {
        await this.createUser(userObject);
      }
    } catch (error) {
      this.logger.error(JSON.stringify(error));
    }
    return true;
  }

  async createUser(userObject: any): Promise<boolean> {
    try {
      const userDto = await this.generateUserDto(userObject);
      const user = this.userRepository.create(userDto);

      await this.userRepository.save(user);

      const userRole = new UserRoleEntity();
      userRole.user = user;
      userRole.role = await this.roleRepository.findOne({
        role: userObject.role as RoleName,
      });
      userRole.createdAt = new Date();
      userRole.updatedAt = new Date();
      await this.userRoleRepository.save(userRole);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
    }
    return true;
  }

  async generateUserDto(userObject: any): Promise<UserDto> {
    const userDto = new UserDto();
    userDto.createdAt = new Date();
    userDto.updatedAt = new Date();
    userDto.firstName = userObject.firstName;
    userDto.lastName = userObject.lastName;
    userDto.email = userObject.email;
    userDto.phone = userObject.phone;
    userDto.password = await this.bcryptService.hashPassword(
      userObject.password,
    );
    userDto.payment = userObject.payment;
    return userDto;
  }

  count = async (): Promise<number> => {
    return await this.userRepository.count();
  };
}
