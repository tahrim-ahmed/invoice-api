import { Module } from '@nestjs/common';
import { FilesService } from './service/files.service';
import { FilesController } from './controller/files.controller';
import { ResponseService } from '../../packages/services/response.service';

@Module({
  imports: [],
  exports: [FilesService],
  providers: [FilesService, ResponseService],
  controllers: [FilesController],
})
export class FilesModule {}
