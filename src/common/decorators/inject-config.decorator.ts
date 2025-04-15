import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

export function InjectConfig<T extends ReturnType<typeof registerAs>>(
  configRegistrar: T,
) {
  return Inject(configRegistrar.KEY);
}
