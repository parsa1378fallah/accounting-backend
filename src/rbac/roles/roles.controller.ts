import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, RoleFilterDto, UpdateRoleDto } from './dto';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.rolesService.create(dto)
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(id)
    }

    @Get()
    findAll(@Query('filter') filter: RoleFilterDto) {
        return this.rolesService.findAll(filter)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
        return this.rolesService.update(id, dto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.rolesService.remove(id)
    }

}
