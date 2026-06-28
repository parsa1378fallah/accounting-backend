import { ApiProperty } from '@nestjs/swagger';

import {
    IsUUID,
} from 'class-validator';

export class ExecuteRevaluationDto {
    @ApiProperty()
    @IsUUID()
    organizationId: string;

    @ApiProperty()
    @IsUUID()
    baseCurrencyId: string;
}
