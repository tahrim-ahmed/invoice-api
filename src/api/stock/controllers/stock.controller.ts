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
import { StockService } from '../services/stock.service';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ResponseService } from '../../../package/services/response.service';
import { RequestService } from '../../../package/services/request.service';
import { IntValidationPipe } from '../../../package/pipes/int-validation.pipe';
import { ResponseDto } from '../../../package/dto/response/response.dto';
import { DtoValidationPipe } from '../../../package/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../../package/pipes/uuid-validation.pipe';
import { CreateStockDto } from '../../../package/dto/create/create-stock.dto';

@ApiTags('Stock')
@ApiBearerAuth()
@Controller('stock')
export class StockController {
  constructor(
    private stockService: StockService,
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
    const stock = this.stockService.search(page, limit, search);
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      null,
      page,
      limit,
      stock,
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
    const stock = this.stockService.pagination(
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
      stock,
    );
  }

  @ApiCreatedResponse({
    description: 'Stock successfully added!!',
  })
  @ApiBody({ type: CreateStockDto })
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    stockDto: CreateStockDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(stockDto);
    const stock = this.stockService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'Stock successfully added!!',
      stock,
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

  @ApiOkResponse({ description: 'Stock successfully deleted!' })
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.stockService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Stock successfully deleted!',
      deleted,
    );
  }

  @Get(':id')
  findById(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const stock = this.stockService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, stock);
  }
}
