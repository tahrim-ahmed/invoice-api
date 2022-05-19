import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BaseDto } from '../dto/core/base.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class RequestService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  forCreate<T extends BaseDto>(dto: T): T {
    if (dto) {
      dto.createdBy = this.request['_user']?.userID || null;

      dto.updatedBy = dto.createdBy;

      return dto;
    } else {
      throw new NotFoundException('No data specified!');
    }
  }

  forUpdate<T extends BaseDto>(dto: T): T {
    if (dto) {
      dto.updatedBy = this.request['_user']?.userID || null;

      return dto;
    } else {
      throw new NotFoundException('No data specified!');
    }
  }
}
