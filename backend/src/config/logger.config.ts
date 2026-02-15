import type { WinstonModuleOptions } from 'nest-winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { format, transports } from 'winston';

export function createWinstonLoggerOptions(): WinstonModuleOptions {
  return {
    level: 'info',
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike('jamplay-backend', {
            prettyPrint: true,
          }),
        ),
      }),
    ],
  };
}
