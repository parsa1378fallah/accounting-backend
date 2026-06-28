import {
    IsOptional,
    IsString,
} from 'class-validator';

export class MoveCostCenterDto {

    @IsOptional()
    @IsString()
    parentId: string | null;

}