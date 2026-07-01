import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { SignedUrlService } from '../security/signed-url.service';

@Injectable()
export class AttachmentGuard implements CanActivate {
    constructor(
        private readonly signedUrlService: SignedUrlService,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        const { expires, signature } = request.query;
        const attachmentId = request.params.id;

        if (!expires || !signature) {
            throw new UnauthorizedException(
                'Missing signed URL parameters',
            );
        }

        const valid =
            this.signedUrlService.verify(
                attachmentId,
                Number(expires),
                signature,
            );

        if (!valid) {
            throw new UnauthorizedException(
                'Invalid or expired link',
            );
        }

        return true;
    }
}