import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ExceptionService } from '../../../package/services/exception.service';
import { SystemException } from '../../../package/exceptions/system.exception';
import { DeleteDto } from '../../../package/dto/response/delete.dto';
import { StatementEntity } from '../../../package/entities/statement/statement.entity';
import { StatementDto } from '../../../package/dto/statement/statement.dto';
import { PurposeDto } from '../../../package/dto/purpose/purpose.dto';
import { PurposeEntity } from '../../../package/entities/purpose/purpose.entity';

@Injectable()
export class StatementService {
  constructor(
    @InjectRepository(StatementEntity)
    private readonly statementRepository: Repository<StatementEntity>,
    @InjectRepository(PurposeEntity)
    private readonly purposeRepository: Repository<PurposeEntity>,
    private readonly exceptionService: ExceptionService,
  ) {}

  search = async (
    page: number,
    limit: number,
    search: string,
  ): Promise<[StatementDto[], number]> => {
    try {
      const query = this.statementRepository.createQueryBuilder('q');

      query.select(['q.id', 'q.purpose', 'q.amount', 'q.referenceID']);

      if (search) {
        query.andWhere(
          '((q.purpose LIKE :search) OR (q.amount LIKE :search))',
          {
            search: `%${search}%`,
          },
        );
      }

      query.orderBy(`q.purpose`, 'DESC');

      if (page && limit) {
        query.skip((page - 1) * limit).take(limit);
      }

      const data = await query.getManyAndCount();

      return [plainToInstance(StatementDto, data[0]), data[1]];
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
  ): Promise<[StatementDto[], number]> => {
    try {
      const query = this.statementRepository.createQueryBuilder('q');

      if (search) {
        query.andWhere(
          '((q.purpose LIKE  :search) OR (q.amount LIKE :search))',
          {
            search: `%${search}%`,
          },
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

      return [plainToInstance(StatementDto, data[0]), data[1]];
    } catch (error) {
      throw new SystemException(error);
    }
  };

  create = async (statementDto: StatementDto): Promise<StatementDto> => {
    try {
      const statement = this.statementRepository.create(statementDto);
      await this.statementRepository.save(statement);

      return this.getStatement(statement.id);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  update = async (
    id: string,
    statementDto: StatementDto,
  ): Promise<StatementDto> => {
    try {
      const savedStatement = await this.getStatement(id);

      await this.statementRepository.save({
        ...savedStatement,
        ...statementDto,
      });

      return this.getStatement(id);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  remove = async (id: string): Promise<DeleteDto> => {
    try {
      const deletedStatement = await this.statementRepository.softDelete({
        id,
      });
      return Promise.resolve(new DeleteDto(!!deletedStatement.affected));
    } catch (error) {
      throw new SystemException(error);
    }
  };

  removeByReference = async (referenceID: string): Promise<DeleteDto> => {
    try {
      const deletedStatement = await this.statementRepository.softDelete({
        referenceID: referenceID,
      });
      return Promise.resolve(new DeleteDto(!!deletedStatement.affected));
    } catch (error) {
      throw new SystemException(error);
    }
  };

  statementSummary = async () => {
    const report: { amount: number; purpose: PurposeDto }[] = [];

    const query = this.statementRepository
      .createQueryBuilder('q')
      .distinctOn(['q.purpose'])
      .select('q.purpose')
      .addSelect('SUM(q.amount)', 'amount')
      .groupBy('q.purpose');

    const data = await query.getRawMany();
    const purposes = await this.getPurposes();

    for (const purpose of purposes) {
      const found = data.find((f) => f.q_purpose === purpose.name);
      report.push({
        amount: found ? Number(found.amount) : 0,
        purpose,
      });
    }

    return report;
  };
  /********************** Start checking relations of post ********************/

  getStatement = async (id: string): Promise<StatementDto> => {
    const statement = await this.statementRepository
      .createQueryBuilder('q')
      .andWhere('q.id =:id', { id })
      .getOneOrFail();

    this.exceptionService.notFound(statement, 'Statement Not Found!!');
    return plainToClass(StatementDto, statement);
  };

  getPurposes = async (): Promise<PurposeDto[]> => {
    const purposes = await this.purposeRepository
      .createQueryBuilder('q')
      .select(['q.id', 'q.name'])
      .getMany();

    return plainToInstance<PurposeDto, PurposeEntity>(PurposeDto, purposes);
  };

  getStatementByReference = async (
    referenceID: string,
  ): Promise<StatementDto> => {
    const statement = await this.statementRepository
      .createQueryBuilder('q')
      .andWhere('q.reference_id =:id', { referenceID: referenceID })
      .getOneOrFail();

    this.exceptionService.notFound(statement, 'Statement Not Found!!');
    return plainToClass(StatementDto, statement);
  };
  /*********************** End checking relations of post *********************/
}
