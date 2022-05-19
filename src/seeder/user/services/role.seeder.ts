import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../../../packages/entities/user/role.entity';
import { rolesObject } from '../../../packages/json/user-role.json';
import { RoleDto } from '../../../packages/dto/user/role.dto';

@Injectable()
export class RoleSeeder {
  private readonly logger = new Logger(RoleSeeder.name);

  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async initRoles(): Promise<boolean> {
    await this.createRoles();
    return true;
  }

  async createRoles(): Promise<boolean> {
    try {
      for (const roleObject of rolesObject) {
        const roleDto = await this.generateRoleDto(roleObject);
        const role = this.roleRepository.create(roleDto);
        await this.roleRepository.save(role);
      }
    } catch (error) {
      this.logger.error(JSON.stringify(error));
    }
    return true;
  }

  async generateRoleDto(roleObject: any): Promise<RoleDto> {
    const roleDto = new RoleDto();
    roleDto.createdAt = new Date();
    roleDto.updatedAt = new Date();
    roleDto.role = roleObject.role;
    roleDto.description = roleObject.description;
    return roleDto;
  }
}
