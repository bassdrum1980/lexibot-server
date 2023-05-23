import 'dotenv/config';
import crypto from 'node:crypto';

export function encryptPasswordWithPublicKey(password) {
  let result;

  try {
    const publicKeyPem = process.env.PUBLIC_KEY;
    const passwordBuffer = Buffer.from(password);
    const encryptedBuffer = crypto.publicEncrypt(publicKeyPem, passwordBuffer);
    const encryptedPassword = encryptedBuffer.toString('base64');
    result = encryptedPassword;
  } catch (error) {
    console.error(
      '[utils/auth/encryptPasswordWithPublicKey] ' +
        'Error occured while encrypting password with public key: ' +
        `error = ${error}`
    );
    result = null;
  }

  return result;
}

export function decryptPasswordWithPrivateKey(encryptedPassword) {
  let result;

  try {
    const privateKeyPem = process.env.PRIVATE_KEY;
    const encryptedBuffer = Buffer.from(encryptedPassword, 'base64');
    const decryptedBuffer = crypto.privateDecrypt(
      privateKeyPem,
      encryptedBuffer
    );
    const decryptedPassword = decryptedBuffer.toString('utf-8');
    result = decryptedPassword;
  } catch (error) {
    console.error(
      '[utils/auth/decryptPasswordWithPrivateKey] ' +
        'Error occured while decrypting password with private key: ' +
        `error = ${error}`
    );
    result = null;
  }
  return result;
}

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
