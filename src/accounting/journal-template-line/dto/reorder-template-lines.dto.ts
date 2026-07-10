import { ApiProperty } from '@nestjs/swagger';

import {
    ArrayMinSize,
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';



export class ReorderJournalTemplateLineItemDto {


    @ApiProperty({
        example: 'line_123',
        description: 'Journal template line identifier',
    })
    @IsString()
    @IsNotEmpty()
    id: string;



    @ApiProperty({
        example: 1,
        description: 'New display order',
    })
    @IsNumber()
    @Min(0)
    sortOrder: number;

}




export class ReorderJournalTemplateLinesDto {


    @ApiProperty({
        example: 'template_123',
        description: 'Journal template identifier',
    })
    @IsString()
    @IsNotEmpty()
    templateId: string;



    @ApiProperty({
        type: [ReorderJournalTemplateLineItemDto],
        example: [
            {
                id: 'line_1',
                sortOrder: 1,
            },
            {
                id: 'line_2',
                sortOrder: 2,
            },
        ],
    })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({
        each: true,
    })
    @Type(() => ReorderJournalTemplateLineItemDto)
    items: ReorderJournalTemplateLineItemDto[];

}