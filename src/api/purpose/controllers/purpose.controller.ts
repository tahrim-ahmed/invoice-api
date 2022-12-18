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
import { PurposeService } from '../services/purpose.service';
import { ResponseService } from '../../../package/services/response.service';
import { RequestService } from '../../../package/services/request.service';
import { IntValidationPipe } from '../../../package/pipes/int-validation.pipe';
import { ResponseDto } from '../../../package/dto/response/response.dto';
import { DtoValidationPipe } from '../../../package/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../../package/pipes/uuid-validation.pipe';
import { PurposeDto } from '../../../package/dto/purpose/purpose.dto';

@ApiTags('Purpose')
@ApiBearerAuth()
@Controller('purpose')
export class PurposeController {
  constructor(
    private purposeService: PurposeService,
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
    const allPurpose = this.purposeService.search(page, limit, search);
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      null,
      page,
      limit,
      allPurpose,
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
    const allPurpose = this.purposeService.pagination(
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
      allPurpose,
    );
  }

  @ApiCreatedResponse({
    description: 'Purpose successfully added!!',
  })
  @ApiBody({ type: PurposeDto })
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    createPurposeDto: PurposeDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(createPurposeDto);
    const purpose = this.purposeService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'Purpose successfully added!!',
      purpose,
    );
  }

  @ApiOkResponse({
    description: 'Purpose successfully updated!!',
  })
  @ApiBody({ type: PurposeDto })
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
    createPurposeDto: PurposeDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(createPurposeDto);
    const purpose = this.purposeService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Purpose successfully updated!!',
      purpose,
    );
  }

  @ApiOkResponse({ description: 'Purpose successfully deleted!' })
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.purposeService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Purpose successfully deleted!',
      deleted,
    );
  }
}
