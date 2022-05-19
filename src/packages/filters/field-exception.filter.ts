import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { DtoValidationException } from '../exceptions/validations/dto-validation.exception';
import { ValidationType } from '../exceptions/validations/validation-type.enum';
import { BooleanValidationException } from '../exceptions/validations/boolean-validation.exception';
import { UuidValidationException } from '../exceptions/validations/uuid-validation.exception';
import { IntValidationException } from '../exceptions/validations/int-validation.exception';
import { FieldErrorDto } from '../dto/response/field-error.dto';
import { ResponseDto } from '../dto/response/response.dto';
import { ErrorDto } from '../dto/response/error.dto';

@Catch(
  DtoValidationException,
  BooleanValidationException,
  UuidValidationException,
  IntValidationException,
)
export class FieldExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let error = null;

    switch (exception.validationType) {
      case ValidationType.DTO:
        error = this.dtoValidationError(exception);
        break;
      case ValidationType.UUID:
        error = this.uuidValidationError(exception);
        break;
      case ValidationType.BOOLEAN:
        error = this.booleanValidationError(exception);
        break;
      case ValidationType.INT:
        error = this.intValidationError(exception);
        break;
    }

    const responseDto = new ResponseDto(
      new Date().getTime(),
      <number>HttpStatus.BAD_REQUEST,
      <string>exception.message,
      new ErrorDto(error, null),
    );

    return response.json(responseDto);
  }

  dtoValidationError(exception: any): FieldErrorDto[] {
    const validationErrors: FieldErrorDto[] = [];
    if (exception.errors.length > 0) {
      for (const error of exception.errors) {
        const property = error.property;
        const errorCollection = [];
        if (!error.constraints || Object.keys(error.constraints).length === 0) {
          this.findChildError(errorCollection, error.children, property);
        } else {
          errorCollection.push({
            field: error.property,
            message: error.constraints[Object.keys(error.constraints)[0]],
          });
        }
        validationErrors.push(...errorCollection);
      }
      return validationErrors;
    }
  }

  uuidValidationError(exception: any): FieldErrorDto[] {
    return [
      new FieldErrorDto(
        exception.field,
        exception.value,
        `UUID ${exception.version ? 'v' + exception.version : ''} is expected`,
        [],
      ),
    ];
  }

  booleanValidationError(exception: any): FieldErrorDto[] {
    return [
      new FieldErrorDto(
        exception.field,
        exception.value,
        `Boolean string is expected`,
        [],
      ),
    ];
  }

  intValidationError(exception: any): FieldErrorDto[] {
    return [
      new FieldErrorDto(
        exception.field,
        exception.value,
        `Numeric string is expected`,
        [],
      ),
    ];
  }

  private findChildError(errorCollection, errors, property) {
    for (const error of errors) {
      if (!error.constraints || Object.keys(error.constraints).length === 0) {
        const nProperty = '.' + error.property;
        const sProperty = '[' + error.property + ']';
        const newProperty = isNaN(error.property) ? nProperty : sProperty;
        this.findChildError(
          errorCollection,
          error.children,
          property + newProperty,
        );
      } else {
        errorCollection.push({
          field: property + '.' + error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        });
      }
    }
  }
}
