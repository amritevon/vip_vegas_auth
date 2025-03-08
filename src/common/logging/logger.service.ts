import { Injectable, LoggerService } from '@nestjs/common';
import logger from './logger';

@Injectable()
export class LogService implements LoggerService {
  log(message: string) {
    logger.info(message);
  }

  error(message: string, trace?: string) {
    logger.error(`${message} - Trace: ${trace}`);
  }

  warn(message: string) {
    logger.warn(message);
  }

  debug(message: string) {
    logger.debug(message);
  }
}
