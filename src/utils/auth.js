import crypto from 'node:crypto';

export function makeSalt() {
  return String(Math.round(new Date().valueOf() * Math.random()));
}

export function encryptPassword(password, salt) {
  try {
    return crypto.createHmac('sha1', salt).update(password).digest('hex');
  } catch (error) {
    return '';
  }
}

export function comparePasswords(password, hash, salt) {
  return encryptPassword(password, salt) === hash;
}
