import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsArray } from 'class-validator';

export class CreateClosingJournalDto {
    @ApiProperty({
        description: 'Fiscal Year ID',
    })
    @IsUUID()
    fiscalYearId: string;

    @ApiProperty({
        description: 'Organization ID',
    })
    @IsUUID()
    organizationId: string;

    @ApiProperty({
        description: 'Journal Entry description for closing',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: 'List of accounts affected in closing',
        type: [String],
    })
    @IsArray()
    @IsOptional()
    accountIds?: string[];
    @ApiProperty({
        description: 'Retained earnings account id',
    })
    @IsUUID()
    retainedEarningsAccountId: string;
}