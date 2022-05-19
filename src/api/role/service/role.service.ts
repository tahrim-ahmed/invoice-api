import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { RoleEntity } from '../../../packages/entities/user/role.entity';
import { ExceptionService } from '../../../packages/services/exception.service';
import { RoleDto } from '../../../packages/dto/user/role.dto';
import { SystemException } from '../../../packages/exceptions/system.exception';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    private exceptionService: ExceptionService,
  ) {}

  /*search = async (
    page: number,
    limit: number,
    search: string,
  ): Promise<[RoleDto[], number]> => {
    try {
      const query = this.roleRepository
        .createQueryBuilder('q')
        .where('q.isActive =:isActive', {
          ...isActive,
        })
        .select(['q.id', 'q.role']);

      if (search) {
        query.andWhere('q.role ILIKE  :search', { search: `%${search}%` });
      }

      query.orderBy(`q.role`, 'DESC', 'NULLS LAST');

      if (page && limit) {
        query.skip((page - 1) * limit).take(limit);
      }

      const data = await query.getManyAndCount();

      return [plainToInstance(RoleDto, data[0]), data[1]];
    } catch (error) {
      throw new SystemException(error);
    }
  };*/

  /*findAll = async (): Promise<RoleDto[]> => {
    const roles = await this.roleRepository.find({ where: { ...isActive } });
    return plainToInstance(RoleDto, roles);
  };*/

  /*findById = async (id: string): Promise<RoleDto> => {
    const role = await this.roleRepository.findOne(id);
    this.exceptionService.notFound(role, 'Role not found!!');
    return plainToClass(RoleDto, role);
  };*/

  /*findByObject = async (dto: RoleDto): Promise<RoleDto | RoleDto[]> => {
    const roles = await this.roleRepository.find({
      ...dto,
    });
    if (roles.length > 1) {
      return plainToClass(RoleDto, roles);
    } else {
      return plainToClass(RoleDto, roles[0]);
    }
  };*/

  create = async (roleDto: RoleDto): Promise<RoleDto> => {
    try {
      const role = this.roleRepository.create(roleDto);
      await this.roleRepository.save(role);

      return plainToClass(RoleDto, role);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  /*update = async (id: string, dto: RoleDto): Promise<RoleDto> => {
    const role = await this.roleRepository.findOne({ id });
    this.exceptionService.notFound(role, 'Role not found!!');
    return this.roleRepository.save({ ...role, ...dto });
  };*/

  /*remove = async (id: string): Promise<DeleteDto> => {
    const role = await this.roleRepository.findOne({ id });
    this.exceptionService.notFound(role, 'Role not found!!');
    const deleted = await this.roleRepository.delete({ id });
    return Promise.resolve(new DeleteDto(!!deleted.affected));
  };*/
}
