import { Global, Module } from '@nestjs/common';

import { LoggerModule } from './logger/logger.module';
import { LoggingInterceptor } from '../interceptor/logging.interceptor';

@Global()
@Module({
    imports: [LoggerModule],
    providers: [LoggingInterceptor],
    exports: [LoggingInterceptor],
})
export class ObservabilityModule { }