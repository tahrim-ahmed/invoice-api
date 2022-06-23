import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InvoiceService } from '../services/invoice.service';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ResponseService } from '../../../package/services/response.service';
import { RequestService } from '../../../package/services/request.service';
import { IntValidationPipe } from '../../../package/pipes/int-validation.pipe';
import { ResponseDto } from '../../../package/dto/response/response.dto';
import { CreateInvoiceDto } from '../../../package/dto/create/create-invoice.dto';
import { DtoValidationPipe } from '../../../package/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../../package/pipes/uuid-validation.pipe';
import { PartialPaymentDto } from '../../../package/dto/invoice/partial-payment.dto';

@ApiTags('Invoice')
@ApiBearerAuth()
@Controller('invoice')
export class InvoiceController {
  constructor(
    private invoiceService: InvoiceService,
    private readonly responseService: ResponseService,
    private readonly requestService: RequestService,
  ) {}

  @ApiImplicitQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @Get('search')
  search(
    @Query('page', new IntValidationPipe()) page: number,
    @Query('limit', new IntValidationPipe()) limit: number,
    @Query('search') search: string,
  ): Promise<ResponseDto> {
    const invoices = this.invoiceService.search(page, limit, search);
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      null,
      page,
      limit,
      invoices,
    );
  }

  @ApiImplicitQuery({
    name: 'sort',
    required: false,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'order',
    required: false,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'client',
    required: false,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'startDate',
    required: false,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'endDate',
    required: false,
    type: String,
  })
  @Get('pagination')
  pagination(
    @Query('page', new IntValidationPipe()) page: number,
    @Query('limit', new IntValidationPipe()) limit: number,
    @Query('sort') sort: string,
    @Query('order') order: string,
    @Query('client') client: string,
    @Query('search') search: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<ResponseDto> {
    const invoices = this.invoiceService.pagination(
      page,
      limit,
      sort,
      order,
      search,
      startDate,
      endDate,
    );
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      null,
      page,
      limit,
      invoices,
    );
  }

  @ApiCreatedResponse({
    description: 'Invoice successfully added!!',
  })
  @ApiBody({ type: CreateInvoiceDto })
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    invoiceDto: CreateInvoiceDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(invoiceDto);
    const invoice = this.invoiceService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'Invoice successfully added!!',
      invoice,
    );
  }

  @ApiOkResponse({ description: 'Invoice successfully marked as paid!' })
  @Patch('paid/:id')
  paid(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const paid = this.invoiceService.paid(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Invoice successfully marked as paid!',
      paid,
    );
  }

  @ApiOkResponse({ description: 'Successfully submitted partial payment!' })
  @Patch('partial-pay')
  partialPayment(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    partialPayment: PartialPaymentDto,
  ): Promise<ResponseDto> {
    const partialPay = this.invoiceService.partialPayment(partialPayment);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Successfully submitted partial payment!',
      partialPay,
    );
  }

  /*@ApiOkResponse({
    description: 'Invoice successfully updated!!',
  })
  @ApiBody({ type: CreateInvoiceDto })
  @Put(':id')
  update(
    @Param('id', new UuidValidationPipe()) id: string,
    @Body(
      new DtoValidationPipe({
        skipMissingProperties: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    invoiceDto: CreateInvoiceDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(invoiceDto);
    const invoice = this.invoiceService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Invoice successfully updated!!',
      invoice,
    );
  }*/

  /* @ApiOkResponse({ description: 'Invoice successfully deleted!' })
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.invoiceService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Invoice successfully deleted!',
      deleted,
    );
  }*/

  @Get(':id')
  findById(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const invoices = this.invoiceService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, invoices);
  }
}
