import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JournalTemplateLineMapper } from '../../application/mappers/journal-template-line.mapper';
import { JournalTemplateLine } from '../../domain/entities/journal-template-line.entity';

@Injectable()
export class JournalTemplateLineTransformInterceptor
    implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        return next.handle().pipe(
            map(data => {
                if (data instanceof JournalTemplateLine) {
                    return JournalTemplateLineMapper.toResponse(data);
                }

                if (Array.isArray(data)) {
                    return data.map(item =>
                        item instanceof JournalTemplateLine
                            ? JournalTemplateLineMapper.toResponse(item)
                            : item,
                    );
                }

                return data;
            }),
        );
    }
}