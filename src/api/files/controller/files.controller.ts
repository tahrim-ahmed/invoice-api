import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilesService } from '../service/files.service';
import { ResponseService } from '../../../package/services/response.service';
import { ResponseDto } from '../../../package/dto/response/response.dto';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
  constructor(
    private fileService: FilesService,
    private readonly responseService: ResponseService,
  ) {}

  @Get()
  findAll(): Promise<ResponseDto> {
    const files = this.fileService.findAll();
    return this.responseService.toDtosResponse(HttpStatus.OK, null, files);
  }
}
