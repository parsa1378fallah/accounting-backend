import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ClosingPreviewQueryDto {
    @ApiProperty({
        example: 'cm123abc456def789ghi01234',
    })
    @IsString()
    @IsNotEmpty()
    fiscalYearId: string;
}