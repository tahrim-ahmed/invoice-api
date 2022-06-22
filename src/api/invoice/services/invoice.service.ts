import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { InvoiceEntity } from '../../../package/entities/invoice/invoice.entity';
import { InvoiceDetailsEntity } from '../../../package/entities/invoice/invoice-details.entity';
import { ProductEntity } from '../../../package/entities/product/product.entity';
import { ExceptionService } from '../../../package/services/exception.service';
import { ClientService } from '../../client/services/client.service';
import { PermissionService } from '../../../package/services/permission.service';
import { RequestService } from '../../../package/services/request.service';
import { InvoiceDto } from '../../../package/dto/invoice/invoice.dto';
import { SystemException } from '../../../package/exceptions/system.exception';
import { CreateInvoiceDto } from '../../../package/dto/create/create-invoice.dto';
import { InvoiceDetailsDto } from '../../../package/dto/invoice/invoice-details.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(InvoiceDetailsEntity)
    private readonly invoiceDetailsRepository: Repository<InvoiceDetailsEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly exceptionService: ExceptionService,
    private readonly clientService: ClientService,
    private readonly permissionService: PermissionService,
    private readonly requestService: RequestService,
  ) {}

  search = async (
    page: number,
    limit: number,
    search: string,
  ): Promise<[InvoiceDto[], number]> => {
    try {
      const query = this.invoiceRepository.createQueryBuilder('q');

      query.select([
        'q.id',
        'q.invoiceID',
        'q.totalTP',
        'q.totalMRP',
        'q.totalCommission',
        'q.others',
        'q.totalProfit',
        'q.client',
        'q.platform',
      ]);

      if (search) {
        query.andWhere(
          '((q.invoiceID LIKE  :search) OR (q.client LIKE  :search))',
          { search: `%${search}%` },
        );
      }

      query.orderBy(`q.date`, 'DESC');

      if (page && limit) {
        query.skip((page - 1) * limit).take(limit);
      }

      query
        .innerJoin('q.client', 'client')
        .addSelect([
          'client.name',
          'client.code',
          'client.cell',
          'client.email',
          'client.billing',
          'client.shipping',
        ]);

      const data = await query.getManyAndCount();

      return [plainToInstance(InvoiceDto, data[0]), data[1]];
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
  ): Promise<[InvoiceDto[], number]> => {
    try {
      const query = this.invoiceRepository.createQueryBuilder('q');

      if (startDate && endDate) {
        startDate = new Date(startDate).toISOString().slice(0, 10);
        endDate = new Date(endDate).toISOString().slice(0, 10);

        query.andWhere('DATE(q.orderDate)  between :startDate and :endDate', {
          startDate,
          endDate,
        });
      }

      query
        .innerJoin('q.client', 'client')
        .addSelect([
          'client.code',
          'client.name',
          'client.cell',
          'client.email',
          'client.billing',
          'client.shipping',
        ])
        .leftJoinAndSelect('q.invoiceDetails', 'invoiceDetails')
        .leftJoinAndSelect('invoiceDetails.product', 'product');

      if (search) {
        query.andWhere(
          '((client.name LIKE  :search) OR (client.code LIKE  :search))',
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

      return [plainToInstance(InvoiceDto, data[0]), data[1]];
    } catch (error) {
      throw new SystemException(error);
    }
  };

  create = async (invoiceDto: CreateInvoiceDto): Promise<InvoiceDto> => {
    try {
      invoiceDto.client = await this.clientService.getClient(
        invoiceDto.clientID,
      );

      const invoice = this.invoiceRepository.create(invoiceDto);
      await this.invoiceRepository.save(invoice);

      for (const details of invoiceDto.createInvoiceDetailsDto) {
        let invDetails = new InvoiceDetailsEntity();
        invDetails.product = await this.getProduct(details.productID);
        invDetails.quantity = details.quantity;
        invDetails.unitTP = details.unitTP;
        invDetails.unitMRP = details.unitMRP;
        invDetails.discount = details.discount;
        invDetails.invoice = invoice;

        invDetails =
          this.requestService.forCreate<InvoiceDetailsEntity>(invDetails);

        const created = this.invoiceDetailsRepository.create(invDetails);
        await this.invoiceDetailsRepository.save(created);
      }

      return this.getInvoice(invoice.id);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  paid = async (id: string): Promise<boolean> => {
    try {
      const savedInvoice = await this.getInvoice(id);
      if (savedInvoice.payment === 'Paid') {
        throw new SystemException({
          status: HttpStatus.FORBIDDEN,
          message: 'Already paid',
        });
      }

      savedInvoice.payment = 'Paid';
      savedInvoice.creditPeriod = null;

      await this.invoiceRepository.save({
        ...savedInvoice,
      });

      return Promise.resolve(true);
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

  /*remove = async (id: string): Promise<DeleteDto> => {
    try {
      const savedInvoice = await this.getInvoice(id);

      await this.softRemoveInvoiceDetails(id);

      await this.invoiceRepository.save({
        ...savedInvoice,
        ...isInActive,
      });

      return Promise.resolve(new DeleteDto(true));
    } catch (error) {
      throw new SystemException(error);
    }
  };*/

  findById = async (id: string): Promise<InvoiceDto> => {
    try {
      return await this.getInvoice(id);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  /********************** Start checking relations of post ********************/
  getInvoice = async (id: string): Promise<InvoiceDto> => {
    const invoice = await this.invoiceRepository
      .createQueryBuilder('q')
      .where('q.id = :id', { id })
      .innerJoin('q.client', 'client')
      .addSelect([
        'client.name',
        'client.code',
        'client.cell',
        'client.email',
        'client.billing',
        'client.shipping',
      ])
      .getOne();
    this.exceptionService.notFound(invoice, 'Invoice Not Found!!');

    return plainToInstance(InvoiceDto, invoice);
  };

  getInvoiceDetailByInvoiceID = async (
    invoiceID: string,
  ): Promise<InvoiceDetailsDto> => {
    const invoiceDetail = await this.invoiceDetailsRepository
      .createQueryBuilder('q')
      .where('q.invoice_id =:invID', { invID: invoiceID })
      .getOne();
    this.exceptionService.notFound(
      invoiceDetail,
      'Invoice Details Not Found!!',
    );

    return plainToInstance(InvoiceDetailsDto, invoiceDetail);
  };

  async removeInvoiceDetails(invoiceID: string): Promise<boolean> {
    return !!(await this.invoiceDetailsRepository
      .createQueryBuilder('q')
      .where('q.invoice_id =:invID', {
        invID: invoiceID,
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
