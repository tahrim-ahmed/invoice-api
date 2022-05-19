import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CustomBaseEntity } from '../entities/core/custom-base.entity';

@Injectable()
export class ExceptionService {
  private readonly logger = new Logger(ExceptionService.name);

  notFound<T extends CustomBaseEntity>(entity: T, message: string) {
    if (!entity) {
      throw new NotFoundException(message);
    }
  }
}
