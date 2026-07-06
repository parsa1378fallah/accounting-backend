import { IsString, IsNumber, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ReorderItemDto {
    @ApiProperty({
        description: 'Line ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsString()
    lineId: string;

    @ApiProperty({
        description: 'New sort order',
        example: 0,
        minimum: 0,
        maximum: 999,
    })
    @IsNumber()
    @Min(0)
    @Max(999)
    sortOrder: number;
}

export class ReorderJournalTemplateLineDto {
    @ApiProperty({
        description: 'Template ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsString()
    templateId: string;

    @ApiProperty({
        description: 'Items to reorder',
        type: [ReorderItemDto],
        minItems: 1,
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReorderItemDto)
    items: ReorderItemDto[];
}