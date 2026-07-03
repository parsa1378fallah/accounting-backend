import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CloseFiscalYearDto {
    @ApiProperty({
        description: 'Fiscal year identifier',
        example: 'cm123abc456def789ghi01234',
    })
    @IsString()
    @IsNotEmpty()
    fiscalYearId: string;

    @ApiPropertyOptional({
        description: 'Optional closing notes',
        maxLength: 5000,
        example: 'Fiscal year closed after external audit.',
    })
    @IsOptional()
    @IsString()
    @MaxLength(5000)
    notes?: string;
}