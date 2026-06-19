import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto';
import { UpdatePermissionDto } from './dto';
import { PermissionFilterDto } from './dto';

@Controller('permissions')
export class PermissionsController {
    constructor(private readonly service: PermissionsService) { }

    @Post()
    create(@Body() dto: CreatePermissionDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll(@Query() filter: PermissionFilterDto) {
        return this.service.findAll(filter);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}