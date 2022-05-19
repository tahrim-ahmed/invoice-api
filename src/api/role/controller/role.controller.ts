import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleService } from '../service/role.service';
import { ResponseService } from '../../../packages/services/response.service';
import { ResponseDto } from '../../../packages/dto/response/response.dto';
import { RoleDto } from '../../../packages/dto/user/role.dto';

@ApiTags('Role')
@ApiBearerAuth()
@Controller('roles')
export class RoleController {
  constructor(
    private roleService: RoleService,
    private readonly responseService: ResponseService,
  ) {}

  /*@ApiImplicitQuery({
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
    const allRole = this.roleService.search(page, limit, search);
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      null,
      page,
      limit,
      allRole,
    );
  }*/

  /*@Get()
  findAll(): Promise<ResponseDto> {
    const roleDto = this.roleService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, roleDto);
  }*/

  /*@Get(':id')
  findById(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const roleDto = this.roleService.findById(id);
    return this.responseService.toDtoResponse(HttpStatus.OK, null, roleDto);
  }*/

  /*@Post('find')
  findOne(@Body() dto: RoleDto): Promise<ResponseDto> {
    const roleDto = this.roleService.findByObject(dto);
    return this.responseService.toDtosResponse(
      HttpStatus.OK,
      null,
      <any>roleDto,
    );
  }*/

  @Post()
  create(@Body() dto: RoleDto): Promise<ResponseDto> {
    const roleDto = this.roleService.create(dto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'Role created Successfully',
      roleDto,
    );
  }

  /*@Put(':id')
  update(@Param('id') id: string, @Body() dto: RoleDto): Promise<ResponseDto> {
    const roleDto = this.roleService.update(id, dto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Role updated successfully',
      roleDto,
    );
  }*/

  /*@Post()
  createRole(
    @Body(new DtoValidationPipe()) roleDto: RoleDto,
  ): Promise<RoleDto> {
    return this.roleService.create(roleDto);
  }*/

  /*@Delete(':id')
  remove(@Param('id') id: string): Promise<ResponseDto> {
    const roleDto = this.roleService.remove(id);
    return this.responseService.toResponse(
      <number>HttpStatus.OK,
      'Role deleted successfully',
      roleDto,
    );
  }*/
}
