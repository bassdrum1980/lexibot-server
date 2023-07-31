import 'dotenv/config.js';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

export const Transports = {
  console: new transports.Console({
    level: process.env.LOG_LEVEL_CONSOLE || 'debug',
    format: format.combine(
      format.colorize(),
      format.printf((info) => `${info.level} ${info.message.replace(/^\s+|\s+$/g, '')}`),
    ),
  }),
  file: new transports.DailyRotateFile({
    level: process.env.LOG_LEVEL_FILE || 'info',
    filename: './logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf((info) => `${info.timestamp} ${info.level.toUpperCase()} ${info.message.replace(/^\s+|\s+$/g, '')}`),
    ),
  }),
};

let logger;

export function getLogger() {
  if (!logger) {
    logger = createLogger({
      transports: [
        Transports.console,
        Transports.file,
      ],
    });
  }
  return logger;
}
