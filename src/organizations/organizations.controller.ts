import { Body, Controller, Get, Param, Patch, Post, Delete } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';

@Controller('organizations')
export class OrganizationsController {
    constructor(private organizationService: OrganizationsService) { }

    @Post()
    create(@Body() dto: CreateOrganizationDto) {
        return this.organizationService.create(dto)
    }

    @Get()
    findAll() {
        return this.organizationService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.organizationService.findOne(id)
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateOrganizationDto,
    ) {
        return this.organizationService.update(
            id,
            dto,
        );
    }

    @Delete(':id')
    remove(
        @Param('id') id: string,
    ) {
        return this.organizationService.remove(id);
    }

}
