import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';

export class ReopenFiscalYearDto {
    @ApiProperty({
        description: 'Reason for reopening the fiscal year.',
        example: 'Incorrect closing journal entry.',
        maxLength: 1000,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    reason!: string;

    @ApiProperty({
        description: 'Additional notes.',
        example: 'Approved by CFO.',
        required: false,
        maxLength: 2000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    notes?: string;
    @ApiProperty()
    @IsUUID()
    fiscalYearId: string;
}