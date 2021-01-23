import crypto from 'crypto';

const randomString = (size: number) => {
  return crypto.randomBytes(size).toString('base64').substring(0, size);
};

export { randomString };
