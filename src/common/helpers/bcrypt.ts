import * as bcrypt from 'bcrypt';

const SALT_FACTOR = 10;

export function hashString(password: string): Promise<string> {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_FACTOR));
}

export function hashCompare(
  plainPassword: string,
  password: string,
): Promise<string> {
  return bcrypt.compareSync(plainPassword, password);
}
