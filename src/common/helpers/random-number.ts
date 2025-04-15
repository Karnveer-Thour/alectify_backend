import cryptoRandomString from 'crypto-random-string';

/**
 * Generate a random numeric code of length provided
 * @param {Number} length length of code to generate
 */
export const generateNumericCode = (length = 4) => {
  const token = cryptoRandomString({ length, type: 'numeric' });
  return token;
};

/**
 * Generate a random token code of length provided
 * @param {Number} length length of code to generate
 */
export const generateTokenCode = (length: number) => {
  const token = cryptoRandomString({ length });
  return token;
};
