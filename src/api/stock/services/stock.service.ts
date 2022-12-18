import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ProductEntity } from '../../../package/entities/product/product.entity';
import { ExceptionService } from '../../../package/services/exception.service';
import { SystemException } from '../../../package/exceptions/system.exception';
import { PurchaseDto } from '../../../package/dto/purchase/purchase.dto';
import { DeleteDto } from '../../../package/dto/response/delete.dto';
import { StockEntity } from '../../../package/entities/stock/stock.entity';
import { CreateStockDto } from '../../../package/dto/create/create-stock.dto';
import { StockDto } from '../../../package/dto/stock/stock.dto';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly exceptionService: ExceptionService,
  ) {}

  search = async (
    page: number,
    limit: number,
    search: string,
  ): Promise<[PurchaseDto[], number]> => {
    try {
      const query = this.stockRepository.createQueryBuilder('q');

      query.select(['q.id', 'q.purchaseID', 'q.totalPrice']);

      if (search) {
        query.andWhere('((q.purchaseID LIKE  :search))', {
          search: `%${search}%`,
        });
      }

      query.orderBy(`q.date`, 'DESC');

      if (page && limit) {
        query.skip((page - 1) * limit).take(limit);
      }

      const data = await query.getManyAndCount();

      return [plainToInstance(PurchaseDto, data[0]), data[1]];
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
    startDate: string,
    endDate: string,
  ): Promise<[PurchaseDto[], number]> => {
    try {
      const query = this.stockRepository.createQueryBuilder('q');

      if (startDate && endDate) {
        startDate = new Date(startDate).toISOString().slice(0, 10);
        endDate = new Date(endDate).toISOString().slice(0, 10);

        query.andWhere('DATE(q.date)  between :startDate and :endDate', {
          startDate,
          endDate,
        });
      }

      query
        .innerJoin('q.product', 'product')
        .addSelect(['product.name', 'product.packSize']);

      if (search) {
        query.andWhere('((q.quantity LIKE  :search))', {
          search: `%${search}%`,
        });
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

      return [plainToInstance(PurchaseDto, data[0]), data[1]];
    } catch (error) {
      throw new SystemException(error);
    }
  };

  @OnEvent('stock.create', { async: true })
  async handleStockCreateEvent(stockDto: CreateStockDto) {
    await this.create(stockDto);
  }

  create = async (stockDto: CreateStockDto): Promise<StockDto> => {
    try {
      const productAvailable = await this.checkProductAvailable(
        stockDto.productID,
      );

      let stock;

      if (productAvailable) {
        const savedStock = await this.getStockByProduct(stockDto.productID);

        savedStock.quantity += stockDto.quantity;

        stock = {
          ...savedStock,
          ...stockDto,
        };
      } else {
        stock = this.stockRepository.create(stockDto);
      }

      stock.product = await this.productRepository.find({
        id: stockDto.productID,
      });
      console.log(stock);
      await this.stockRepository.save(stock);

      return this.getStock(stock.id);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  /* update = async (
    id: string,
    invoiceDto: CreateInvoiceDto,
  ): Promise<PurchaseDto> => {
    try {
      const savedInvoice = await this.getInvoice(id);

      if (invoiceDto.clientID) {
        invoiceDto.client = await this.clientService.getClient(
          invoiceDto.clientID,
        );
      }

      if (invoiceDto.createInvoiceDetailsDto.length) {
        let totalAmount = 0;
        const invoiceDetails: PurchaseDetailsEntity[] = [];

        for (const details of invoiceDto.createInvoiceDetailsDto) {
          const oldInvoiceDetail = await this.getInvoiceDetailByInvoiceID(id);

          await this.removeInvoiceDetails(id);

          let invDetails = new PurchaseDetailsEntity();
          invDetails.quantity = Number(details.quantity);
          invDetails.unitPrice = Number(details.unitPrice);
          invDetails.product = await this.getProduct(details.productID);

          totalAmount += invDetails.quantity * invDetails.unitPrice;

          // preserve the previous date
          invDetails.createdBy = oldInvoiceDetail.createdBy;
          invDetails.createAt = oldInvoiceDetail.createAt;

          invDetails =
            this.requestService.forUpdate<PurchaseDetailsEntity>(invDetails);

          const created = this.invoiceDetailsRepository.create(invDetails);
          invoiceDetails.push(
            await this.invoiceDetailsRepository.save(created),
          );
        }

        invoiceDto.invoiceDetails = plainToInstance(
          PurchaseDetailsDto,
          invoiceDetails,
        );
        invoiceDto.totalAmount = totalAmount;
      }

      await this.invoiceRepository.save({
        ...savedInvoice,
        ...invoiceDto,
      });

      return this.getInvoice(id);
    } catch (error) {
      throw new SystemException(error);
    }
  };*/

  remove = async (id: string): Promise<DeleteDto> => {
    try {
      const deletedInvoice = await this.stockRepository.softDelete({
        id,
      });

      return Promise.resolve(new DeleteDto(!!deletedInvoice.affected));
    } catch (error) {
      throw new SystemException(error);
    }
  };

  findById = async (id: string): Promise<StockDto> => {
    try {
      return await this.getStock(id);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  /********************** Start checking relations of post ********************/
  getStock = async (id: string): Promise<StockDto> => {
    const stock = await this.stockRepository
      .createQueryBuilder('q')
      .where('q.id = :id', { id })
      .getOne();
    this.exceptionService.notFound(stock, 'Stock Not Found!!');

    return plainToInstance(StockDto, stock);
  };

  getStockByProduct = async (id: string): Promise<StockDto> => {
    const stock = await this.productRepository
      .createQueryBuilder('q')
      .where('q.product_id =:id', { id })
      .getOne();
    this.exceptionService.notFound(stock, 'Stock Not Found!!');

    return plainToInstance(StockDto, stock);
  };

  checkProductAvailable = async (productID: string): Promise<boolean> => {
    const alreadyAvailable = await this.stockRepository
      .createQueryBuilder('q')
      .where('q.product_id =:productID', { productID: productID })
      .getCount();
    return Promise.resolve(!!alreadyAvailable);
  };
  /*********************** End checking relations of post *********************/
}
