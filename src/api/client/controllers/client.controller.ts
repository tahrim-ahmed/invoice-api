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
import { ClientService } from '../services/client.service';
import { ResponseService } from '../../../packages/services/response.service';
import { RequestService } from '../../../packages/services/request.service';
import { IntValidationPipe } from '../../../packages/pipes/int-validation.pipe';
import { ResponseDto } from '../../../packages/dto/response/response.dto';
import { DtoValidationPipe } from '../../../packages/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../../packages/pipes/uuid-validation.pipe';
import { ClientDto } from '../../../packages/dto/client/client.dto';

@ApiTags('Client')
@ApiBearerAuth()
@Controller('client')
export class ClientController {
  constructor(
    private clientService: ClientService,
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
    const allClient = this.clientService.search(page, limit, search);
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      null,
      page,
      limit,
      allClient,
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
    const allClient = this.clientService.pagination(
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
      allClient,
    );
  }

  @ApiCreatedResponse({
    description: 'Client successfully added!!',
  })
  @ApiBody({ type: ClientDto })
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    createClientDto: ClientDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(createClientDto);
    const region = this.clientService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'Client successfully added!!',
      region,
    );
  }

  @ApiOkResponse({
    description: 'Client successfully updated!!',
  })
  @ApiBody({ type: ClientDto })
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
    createClientDto: ClientDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(createClientDto);
    const region = this.clientService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Client successfully updated!!',
      region,
    );
  }

  @ApiOkResponse({ description: 'Client successfully deleted!' })
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.clientService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Client successfully deleted!',
      deleted,
    );
  }
}
