import { buildMessage, registerDecorator } from 'class-validator';
import { ValidationOptions } from 'joi';
import { ObjectLiteral } from 'typeorm';
import { ValidatorDecoratorReturnType } from './models/validator-decorator-return.type';

export function IsObjectOrEmptyString<T extends ObjectLiteral>(
  validationOptions?: ValidationOptions,
): ValidatorDecoratorReturnType<T> {
  return function decoratorRegisterFn(object: T, propertyName: string): void {
    const message = buildMessage(function (eachPrefix: string) {
      return eachPrefix.concat(
        '$property must either be an object or an empty string',
      );
    });
    registerDecorator({
      name: 'isObjectOrEmptyString',
      target: object.constructor,
      propertyName,
      options: { message, ...validationOptions },
      validator: { validate: isObjectOrEmptyString },
    });
  };
}

export function isObjectOrEmptyString(value: '' | object): boolean {
  return value === '' || typeof value === 'object';
}
