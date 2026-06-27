import { PartialType } from '@nestjs/swagger';

import { CreateSystemAccountDto } from './create-system-account.dto';

export class UpdateSystemAccountDto extends PartialType(
    CreateSystemAccountDto,
) { }