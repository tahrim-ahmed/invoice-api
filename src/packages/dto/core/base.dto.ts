import { Allow } from 'class-validator';

export abstract class BaseDto {
  @Allow()
  id: string;

  @Allow()
  version: number;

  @Allow()
  deletedAt: Date;

  @Allow()
  createdBy: string | null;

  @Allow()
  updatedBy: string | null;

  @Allow()
  createdAt: Date | null;

  @Allow()
  updatedAt: Date | null;
}
