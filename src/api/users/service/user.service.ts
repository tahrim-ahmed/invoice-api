import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserEntity } from '../../../packages/entities/user/user.entity';
import { RoleEntity } from '../../../packages/entities/user/role.entity';
import { UserRoleEntity } from '../../../packages/entities/user/user-role.entity';
import { ResponseService } from '../../../packages/services/response.service';
import { ExceptionService } from '../../../packages/services/exception.service';
import { BcryptService } from '../../../packages/services/bcrypt.service';
import { RequestService } from '../../../packages/services/request.service';
import { UserResponseDto } from '../../../packages/dto/response/user-response.dto';
import { UserDto } from '../../../packages/dto/user/user.dto';
import { SystemException } from '../../../packages/exceptions/system.exception';
import { RoleName } from '../../../packages/enum/role-name.enum';
import { ChangePasswordDto } from '../../../packages/dto/user/change-password.dto';
import { DeleteDto } from '../../../packages/dto/response/delete.dto';
import { UserRoleDto } from '../../../packages/dto/user/user-role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
    private readonly configService: ConfigService,
    private readonly responseService: ResponseService,
    private readonly exceptionService: ExceptionService,
    private readonly bcryptService: BcryptService,
    private readonly requestService: RequestService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  getLoggedUser = (): UserResponseDto => {
    return this.request['_user'] as UserResponseDto;
  };

  findAll = async (): Promise<UserDto[]> => {
    try {
      const users = await this.userRepository.find();
      return plainToInstance(UserDto, users);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  findOne = async (dto: UserDto): Promise<UserDto> => {
    try {
      const user = await this.userRepository.findOne({
        ...dto,
      });
      this.exceptionService.notFound(user, 'User is not found');
      return plainToClass(UserDto, user);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  findOneByEmailOrPhone = async (
    emailOrPhone: string,
    mustReturn = false,
  ): Promise<UserDto> => {
    try {
      const query = this.userRepository.createQueryBuilder('user');

      const user = await query
        .where('(user.phone = :phone OR user.email = :email)', {
          phone: emailOrPhone,
          email: emailOrPhone,
        })
        .getOne();

      if (!mustReturn) {
        this.exceptionService.notFound(
          user,
          'User is not found by phone or email',
        );
      }

      return plainToClass(UserDto, user);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  registration = async (userDto: UserDto): Promise<UserDto> => {
    try {
      const user = await this.createUser(userDto);

      return plainToClass(UserDto, user);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  create = async (userDto: UserDto): Promise<UserDto> => {
    try {
      const user = await this.createNewUser(userDto);

      return plainToClass(UserDto, user);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  createUser = async (userDto: UserDto): Promise<UserEntity> => {
    userDto.password = await this.bcryptService.hashPassword(userDto.password);

    userDto = this.requestService.forCreate(userDto);
    const user = this.userRepository.create(userDto);

    const savedUser = await this.userRepository.save(user);

    this.createUserTypeRole(savedUser);
    return savedUser;
  };

  createNewUser = async (userDto: UserDto): Promise<UserEntity> => {
    userDto.password = await this.bcryptService.hashPassword(userDto.password);

    userDto = this.requestService.forCreate(userDto);
    const user = this.userRepository.create(userDto);

    const savedUser = await this.userRepository.save(user);

    this.createNewUserTypeRole(savedUser);
    return savedUser;
  };

  createUserTypeRole = async (user: UserEntity): Promise<boolean> => {
    let userRole = new UserRoleEntity();
    userRole.user = user;
    userRole.role = await this.getUserRole();
    userRole = this.requestService.forCreate(userRole);
    return Promise.resolve(!!(await this.userRoleRepository.save(userRole)));
  };

  createNewUserTypeRole = async (user: UserEntity): Promise<boolean> => {
    let userRole = new UserRoleEntity();
    userRole.user = user;
    userRole.role = await this.getAdminUserRole();
    userRole = this.requestService.forCreate(userRole);
    return Promise.resolve(!!(await this.userRoleRepository.save(userRole)));
  };

  update = async (id: string, userDto: UserDto): Promise<UserDto> => {
    try {
      if (userDto.password) {
        userDto.password = await this.bcryptService.hashPassword(
          userDto.password,
        );
      }

      const savedUser = await this.getUser(id);

      userDto = this.requestService.forUpdate(userDto);

      const updatedUser = await this.userRepository.save({
        ...savedUser,
        ...userDto,
      });

      return plainToClass(UserDto, updatedUser);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  updatePassword = async (
    changePasswordDto: ChangePasswordDto,
  ): Promise<UserDto> => {
    try {
      const savedUser = await this.getUser(changePasswordDto.userID);

      savedUser.password = await this.bcryptService.hashPassword(
        changePasswordDto.newPassword,
      );
      const updatedUser = await this.userRepository.save({
        ...savedUser,
        // save password reset time
        lastPasswdGen: new Date(),
      });

      return plainToClass(UserDto, updatedUser);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  remove = async (id: string): Promise<DeleteDto> => {
    try {
      const deletedUser = await this.userRepository.softDelete({
        id,
      });
      return Promise.resolve(new DeleteDto(!!deletedUser.affected));
    } catch (error) {
      throw new SystemException(error);
    }
  };

  pagination = async (
    page: number,
    limit: number,
    sort: string,
    order: string,
    search: string,
  ): Promise<[UserDto[], number]> => {
    try {
      const query = this.userRepository.createQueryBuilder('q');

      if (search) {
        query.andWhere(
          '((q.firstName LIKE  :search) OR (q.lastName LIKE  :search) OR (q.phone LIKE  :search) OR (q.email LIKE  :search))',
          { search: `%${search}%` },
        );
      }

      if (sort && sort !== 'undefined') {
        if (order && order !== 'undefined') {
          let direction: 'DESC' | 'ASC' = 'DESC';
          if (['DESC', 'ASC'].includes(order.toUpperCase())) {
            direction = order.toUpperCase() as 'DESC' | 'ASC';
            query.orderBy(`q.${sort}`, direction);
          } else {
            query.orderBy(`q.${sort}`, direction);
          }
        } else {
          query.orderBy(`q.${sort}`, 'DESC');
        }
      } else {
        query.orderBy(`q.updatedAt`, 'DESC');
      }

      if (page && limit) {
        query.skip((page - 1) * limit).take(limit);
      }

      const data = await query.getManyAndCount();

      return [plainToInstance(UserDto, data[0]), data[1]];
    } catch (error) {
      throw new SystemException(error);
    }
  };

  findById = async (id: string, relation = true): Promise<UserDto> => {
    try {
      const user = await this.userRepository.findOne(
        { id },
        {
          relations: relation ? ['roles'] : [],
        },
      );
      this.exceptionService.notFound(user, 'User is not found');
      user.password = undefined;
      return plainToClass(UserDto, user);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  /************************ relation *******************/
  getUser = async (id: string): Promise<UserEntity> => {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    this.exceptionService.notFound(user, 'User not found!!');
    return user;
  };

  getRole = async (id: string): Promise<RoleEntity> => {
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
    });
    this.exceptionService.notFound(role, 'Role not found!!');
    return role;
  };

  getUserRole = async (): Promise<RoleEntity> => {
    return await this.roleRepository.findOne({
      where: {
        role: RoleName.USER_ROLE,
      },
    });
  };

  getAdminUserRole = async (): Promise<RoleEntity> => {
    return await this.roleRepository.findOne({
      where: {
        role: RoleName.ADMIN_ROLE,
      },
    });
  };

  /************************ for login *******************/

  findRolesByUserId = async (id: string): Promise<UserRoleDto[]> => {
    try {
      const query = this.userRoleRepository.createQueryBuilder('userRole');
      const userRoles = await query
        .innerJoin('userRole.user', 'user', 'user.id=:id', { id })
        .innerJoinAndSelect('userRole.role', 'role')
        .getMany();
      return plainToClass(UserRoleDto, userRoles);
    } catch (error) {
      throw new SystemException(error);
    }
  };
}
