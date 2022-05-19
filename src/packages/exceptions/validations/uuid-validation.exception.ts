import { BadRequestException } from '@nestjs/common';
import { ValidationType } from './validation-type.enum';

export class UuidValidationException extends BadRequestException {
  constructor(
    public field: string,
    public value: string,
    public version: '3' | '4' | '5',
    public message: string,
    public validationType: ValidationType = ValidationType.UUID,
  ) {
    super();
  }
}
