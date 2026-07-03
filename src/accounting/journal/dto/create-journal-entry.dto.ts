import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';

import {
    IsArray,
    ArrayMinSize,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested,
    IsEnum,
} from 'class-validator';

import { Type } from 'class-transformer';

import { CreateJournalLineDto } from './create-journal-line.dto';

export enum JournalReferenceType {
    MANUAL = 'MANUAL',
    SALES = 'SALES',
    PURCHASE = 'PURCHASE',
    PAYMENT = 'PAYMENT',
    RECEIPT = 'RECEIPT',
    PAYROLL = 'PAYROLL',
    INVENTORY = 'INVENTORY',
    ADJUSTMENT = 'ADJUSTMENT',
    OPENING = 'OPENING',
    CLOSING = 'CLOSING',
    JOURNAL_TEMPLATE = 'JOURNAL_TEMPLATE',
    RECURRING_JOURNAL = 'RECURRING_JOURNAL',
}

export class CreateJournalEntryDto {
    @ApiProperty({
        example: 'ckxxxxxxxxxxxxxxxx',
    })
    @IsUUID()
    organizationId: string;

    @ApiProperty({
        example: 'ckxxxxxxxxxxxxxxxx',
    })
    @IsUUID()
    fiscalYearId: string;

    @ApiProperty({
        example: 'ckxxxxxxxxxxxxxxxx',
    })
    @IsUUID()
    branchId: string;

    @ApiPropertyOptional({
        example: 'Purchase invoice #2001',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        enum: JournalReferenceType,
    })
    @IsOptional()
    @IsEnum(JournalReferenceType)
    referenceType?: JournalReferenceType;

    @ApiPropertyOptional({
        example: 'INV-1002',
    })
    @IsOptional()
    @IsString()
    referenceId?: string;

    @ApiProperty({
        type: () => [CreateJournalLineDto],
    })
    @IsArray()
    @ArrayMinSize(2)
    @ValidateNested({
        each: true,
    })
    @Type(() => CreateJournalLineDto)
    lines: CreateJournalLineDto[];
}