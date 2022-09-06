import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ExceptionService } from '../../../package/services/exception.service';
import { SystemException } from '../../../package/exceptions/system.exception';
import { DeleteDto } from '../../../package/dto/response/delete.dto';
import { PurposeEntity } from '../../../package/entities/purpose/purpose.entity';
import { PurposeDto } from '../../../package/dto/purpose/purpose.dto';

@Injectable()
export class PurposeService {
  constructor(
    @InjectRepository(PurposeEntity)
    private readonly purposeRepository: Repository<PurposeEntity>,
    private readonly exceptionService: ExceptionService,
  ) {}

  search = async (
    page: number,
    limit: number,
    search: string,
  ): Promise<[PurposeDto[], number]> => {
    try {
      const query = this.purposeRepository.createQueryBuilder('q');

      query.select(['q.id', 'q.name']);

      if (search) {
        query.andWhere('q.name LIKE  :search', { search: `%${search}%` });
      }

      query.orderBy(`q.name`, 'DESC');

      if (page && limit) {
        query.skip((page - 1) * limit).take(limit);
      }

      const data = await query.getManyAndCount();

      return [plainToInstance(PurposeDto, data[0]), data[1]];
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
  ): Promise<[PurposeDto[], number]> => {
    try {
      const query = this.purposeRepository.createQueryBuilder('q');

      if (search) {
        query.andWhere('((q.name LIKE  :search))', { search: `%${search}%` });
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

      return [plainToInstance(PurposeDto, data[0]), data[1]];
    } catch (error) {
      throw new SystemException(error);
    }
  };

  create = async (purposeDto: PurposeDto): Promise<PurposeDto> => {
    try {
      const purpose = this.purposeRepository.create(purposeDto);
      await this.purposeRepository.save(purpose);

      return this.getPurpose(purpose.id);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  update = async (id: string, purposeDto: PurposeDto): Promise<PurposeDto> => {
    try {
      const savedPurpose = await this.getPurpose(id);

      await this.purposeRepository.save({
        ...savedPurpose,
        ...purposeDto,
      });

      return this.getPurpose(id);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  remove = async (id: string): Promise<DeleteDto> => {
    try {
      const deletedPurpose = await this.purposeRepository.softDelete({
        id,
      });
      return Promise.resolve(new DeleteDto(!!deletedPurpose.affected));
    } catch (error) {
      throw new SystemException(error);
    }
  };
  /********************** Start checking relations of post ********************/

  getPurpose = async (id: string): Promise<PurposeDto> => {
    const purpose = await this.purposeRepository
      .createQueryBuilder('q')
      .andWhere('q.id =:id', { id })
      .getOneOrFail();

    this.exceptionService.notFound(purpose, 'Purpose Not Found!!');
    return plainToClass(PurposeDto, purpose);
  };
  /*********************** End checking relations of post *********************/
}
