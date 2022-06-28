import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ProductEntity } from '../../../package/entities/product/product.entity';
import { ExceptionService } from '../../../package/services/exception.service';
import { PermissionService } from '../../../package/services/permission.service';
import { RequestService } from '../../../package/services/request.service';
import { SystemException } from '../../../package/exceptions/system.exception';
import { PurchaseEntity } from '../../../package/entities/purchase/purchase.entity';
import { PurchaseDetailsEntity } from '../../../package/entities/purchase/purchase-details.entity';
import { PurchaseDto } from '../../../package/dto/purchase/purchase.dto';
import { CreatePurchaseDto } from '../../../package/dto/create/create-purchase.dto';
import { PurchaseDetailsDto } from '../../../package/dto/purchase/purchase-details.dto';
import { StatementService } from '../../statement/services/statement.service';
import { StatementEntity } from '../../../package/entities/statement/statement.entity';
import { DeleteDto } from '../../../package/dto/response/delete.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateStockDto } from '../../../package/dto/create/create-stock.dto';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(PurchaseEntity)
    private readonly purchaseRepository: Repository<PurchaseEntity>,
    @InjectRepository(PurchaseDetailsEntity)
    private readonly purchaseDetailsRepository: Repository<PurchaseDetailsEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly statementService: StatementService,
    private readonly eventEmitter: EventEmitter2,
    private readonly exceptionService: ExceptionService,
    private readonly permissionService: PermissionService,
    private readonly requestService: RequestService,
  ) {}

  search = async (
    page: number,
    limit: number,
    search: string,
  ): Promise<[PurchaseDto[], number]> => {
    try {
      const query = this.purchaseRepository.createQueryBuilder('q');

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
      const query = this.purchaseRepository.createQueryBuilder('q');

      if (startDate && endDate) {
        startDate = new Date(startDate).toISOString().slice(0, 10);
        endDate = new Date(endDate).toISOString().slice(0, 10);

        query.andWhere('DATE(q.date)  between :startDate and :endDate', {
          startDate,
          endDate,
        });
      }

      query
        .leftJoinAndSelect('q.purchaseDetails', 'purchaseDetails')
        .leftJoinAndSelect('purchaseDetails.product', 'product');

      if (search) {
        query.andWhere('((q.purchaseID LIKE  :search))', {
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

  create = async (purchaseDto: CreatePurchaseDto): Promise<PurchaseDto> => {
    try {
      const purchase = this.purchaseRepository.create(purchaseDto);
      await this.purchaseRepository.save(purchase);

      for (const details of purchaseDto.createPurchaseDetailsDto) {
        let purDetails = new PurchaseDetailsEntity();
        purDetails.product = await this.getProduct(details.productID);
        purDetails.quantity = details.quantity;
        purDetails.unitPrice = details.unitPrice;
        purDetails.purchase = purchase;

        purDetails =
          this.requestService.forCreate<PurchaseDetailsEntity>(purDetails);

        const created = this.purchaseDetailsRepository.create(purDetails);
        await this.purchaseDetailsRepository.save(created);

        let createStockDto = new CreateStockDto();
        createStockDto = this.requestService.forCreate(createStockDto);
        createStockDto.productID = details.productID;
        createStockDto.quantity = details.quantity;

        this.eventEmitter.emit('stock.create', createStockDto);
      }

      let statements = new StatementEntity();

      statements.referenceID = purchase.id;
      purchase.type === 'Cash'
        ? (statements.purpose = 'Purchased on Cash')
        : (statements.purpose = 'BAYER Receivable');
      statements.amount = Number(purchase.totalPrice);

      statements = this.requestService.forCreate<StatementEntity>(statements);

      await this.statementService.create(statements);

      return this.getPurchase(purchase.id);
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
      const deletedInvoice = await this.purchaseRepository.softDelete({
        id,
      });

      await this.statementService.removeByReference(id);

      return Promise.resolve(new DeleteDto(!!deletedInvoice.affected));
    } catch (error) {
      throw new SystemException(error);
    }
  };

  findById = async (id: string): Promise<PurchaseDto> => {
    try {
      return await this.getPurchase(id);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  /********************** Start checking relations of post ********************/
  getPurchase = async (id: string): Promise<PurchaseDto> => {
    const purchase = await this.purchaseRepository
      .createQueryBuilder('q')
      .where('q.id = :id', { id })
      .getOne();
    this.exceptionService.notFound(purchase, 'Purchase Not Found!!');

    return plainToInstance(PurchaseDto, purchase);
  };

  getPurchaseDetailByPurchaseID = async (
    purchaseID: string,
  ): Promise<PurchaseDetailsDto> => {
    const purchaseDetail = await this.purchaseDetailsRepository
      .createQueryBuilder('q')
      .where('q.purchase_id =:purID', { purID: purchaseID })
      .getOne();
    this.exceptionService.notFound(
      purchaseDetail,
      'Purchase Details Not Found!!',
    );

    return plainToInstance(PurchaseDetailsDto, purchaseDetail);
  };

  async removePurchaseDetails(purchaseID: string): Promise<boolean> {
    return !!(await this.purchaseDetailsRepository
      .createQueryBuilder('q')
      .where('q.purchase_id =:purID', {
        purID: purchaseID,
      })
      .delete());
  }

  getProduct = async (id: string): Promise<ProductEntity> => {
    const product = await this.productRepository
      .createQueryBuilder('q')
      .where('q.id =:id', { id })
      .getOne();
    this.exceptionService.notFound(product, 'Product Not Found!!');

    return product;
  };
  /*********************** End checking relations of post *********************/
}
