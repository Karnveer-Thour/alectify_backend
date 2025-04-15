import { ObjectLiteral } from 'typeorm';

export type ValidatorDecoratorReturnType<T extends ObjectLiteral> = (
  object: T,
  properyName: string,
) => void;
