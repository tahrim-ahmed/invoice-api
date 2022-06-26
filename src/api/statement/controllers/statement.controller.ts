import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { StatementService } from '../services/statement.service';
import { ResponseService } from '../../../package/services/response.service';
import { RequestService } from '../../../package/services/request.service';
import { IntValidationPipe } from '../../../package/pipes/int-validation.pipe';
import { ResponseDto } from '../../../package/dto/response/response.dto';
import { DtoValidationPipe } from '../../../package/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../../package/pipes/uuid-validation.pipe';
import { StatementDto } from '../../../package/dto/statement/statement.dto';

@ApiTags('Statement')
@ApiBearerAuth()
@Controller('statement')
export class StatementController {
  constructor(
    private statementService: StatementService,
    private readonly responseService: ResponseService,
    private readonly requestService: RequestService,
  ) {}

  @ApiImplicitQuery({
    name: 'page',
    required: false,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'limit',
    required: false,
    type: String,
  })
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
    const allStatements = this.statementService.search(page, limit, search);
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      null,
      page,
      limit,
      allStatements,
    );
  }

  @ApiImplicitQuery({
    name: 'page',
    required: true,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'limit',
    required: true,
    type: String,
  })
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
  @Get('pagination')
  pagination(
    @Query('page', new IntValidationPipe()) page: number,
    @Query('limit', new IntValidationPipe()) limit: number,
    @Query('sort') sort: string,
    @Query('order') order: string,
    @Query('search') search: string,
  ): Promise<ResponseDto> {
    const allStatement = this.statementService.pagination(
      page,
      limit,
      sort,
      order,
      search,
    );
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      null,
      page,
      limit,
      allStatement,
    );
  }

  @ApiCreatedResponse({
    description: 'Statement successfully added!!',
  })
  @ApiBody({ type: StatementDto })
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    statementDto: StatementDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(statementDto);
    const statement = this.statementService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'Statement successfully added!!',
      statement,
    );
  }

  @ApiOkResponse({
    description: 'Statement successfully updated!!',
  })
  @ApiBody({ type: StatementDto })
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
    statementDto: StatementDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(statementDto);
    const statement = this.statementService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Statement successfully updated!!',
      statement,
    );
  }

  @ApiOkResponse({ description: 'Statement successfully deleted!' })
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.statementService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Statement successfully deleted!',
      deleted,
    );
  }
}
