import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
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
import { PurchaseService } from '../services/purchase.service';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ResponseService } from '../../../package/services/response.service';
import { RequestService } from '../../../package/services/request.service';
import { IntValidationPipe } from '../../../package/pipes/int-validation.pipe';
import { ResponseDto } from '../../../package/dto/response/response.dto';
import { DtoValidationPipe } from '../../../package/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../../package/pipes/uuid-validation.pipe';
import { CreatePurchaseDto } from '../../../package/dto/create/create-purchase.dto';

@ApiTags('Purchase')
@ApiBearerAuth()
@Controller('purchase')
export class PurchaseController {
  constructor(
    private purchaseService: PurchaseService,
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
    const purchases = this.purchaseService.search(page, limit, search);
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      null,
      page,
      limit,
      purchases,
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
    @Query('search') search: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<ResponseDto> {
    const purchases = this.purchaseService.pagination(
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
      purchases,
    );
  }

  @ApiCreatedResponse({
    description: 'Purchase successfully added!!',
  })
  @ApiBody({ type: CreatePurchaseDto })
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    purchaseDto: CreatePurchaseDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(purchaseDto);
    const purchase = this.purchaseService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'Purchase successfully added!!',
      purchase,
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

  @ApiOkResponse({ description: 'Purchase successfully deleted!' })
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.purchaseService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Purchase successfully deleted!',
      deleted,
    );
  }

  @Get(':id')
  findById(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const purchases = this.purchaseService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, purchases);
  }
}
