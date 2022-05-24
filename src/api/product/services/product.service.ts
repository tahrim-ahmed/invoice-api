import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ExceptionService } from '../../../package/services/exception.service';
import { SystemException } from '../../../package/exceptions/system.exception';
import { DeleteDto } from '../../../package/dto/response/delete.dto';
import { ProductDto } from '../../../package/dto/product/product.dto';
import { ProductEntity } from '../../../package/entities/product/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly exceptionService: ExceptionService,
  ) {}

  search = async (
    page: number,
    limit: number,
    search: string,
  ): Promise<[ProductDto[], number]> => {
    try {
      const query = this.productRepository.createQueryBuilder('q');

      query.select(['q.id', 'q.name', 'q.packSize']);

      if (search) {
        query.andWhere('q.name LIKE  :search', { search: `%${search}%` });
      }

      query.orderBy(`q.name`, 'DESC');

      if (page && limit) {
        query.skip((page - 1) * limit).take(limit);
      }

      const data = await query.getManyAndCount();

      return [plainToClass(ProductDto, data[0]), data[1]];
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
  ): Promise<[ProductDto[], number]> => {
    try {
      const query = this.productRepository.createQueryBuilder('q');

      if (search) {
        query.andWhere(
          '((q.name LIKE  :search) OR (category.name LIKE  :search))',
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

      return [plainToInstance(ProductDto, data[0]), data[1]];
    } catch (error) {
      throw new SystemException(error);
    }
  };

  create = async (productDto: ProductDto): Promise<ProductDto> => {
    try {
      const product = this.productRepository.create(productDto);
      await this.productRepository.save(product);

      return this.getProduct(product.id);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  update = async (id: string, productDto: ProductDto): Promise<ProductDto> => {
    try {
      const savedProduct = await this.getProduct(id);

      await this.productRepository.save({
        ...savedProduct,
        ...productDto,
      });

      return this.getProduct(id);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  remove = async (id: string): Promise<DeleteDto> => {
    try {
      const deletedProduct = await this.productRepository.softDelete({
        id,
      });
      return Promise.resolve(new DeleteDto(!!deletedProduct.affected));
    } catch (error) {
      throw new SystemException(error);
    }
  };
  /********************** Start checking relations of post ********************/

  getProduct = async (id: string): Promise<ProductDto> => {
    const product = await this.productRepository
      .createQueryBuilder('q')
      .andWhere('q.id =:id', { id })
      .getOneOrFail();

    this.exceptionService.notFound(product, 'Product Not Found!!');
    return plainToClass(ProductDto, product);
  };
  /*********************** End checking relations of post *********************/
}
