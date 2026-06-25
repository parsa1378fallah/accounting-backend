import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { LoggerService } from './logger.service';

@Global()
@Module({
    imports: [
        WinstonModule.forRoot({
            level: 'debug',
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.ms(),
                        winston.format.json(),
                    ),
                }),
            ],
        }),
    ],
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule { }