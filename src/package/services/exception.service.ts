import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomBaseEntity } from '../entities/core/custom-base.entity';

@Injectable()
export class ExceptionService {
  notFound<T extends CustomBaseEntity>(entity: T, message: string) {
    if (!entity) {
      throw new NotFoundException(message);
    }
  }
}
