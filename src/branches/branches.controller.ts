import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentOrg } from 'src/common/decorators/current-org.decorator';
import { CreateBranchDto } from './dro';
import { UpdateBrachDto } from './dro/update-branch.dto';

@Controller('branches')
@UseGuards(JwtAuthGuard)
export class BranchesController {
    constructor(private branchService: BranchesService) { }

    @Post()
    create(@CurrentOrg() orgId: string, @Body() dto: CreateBranchDto) {
        return this.branchService.create(orgId, dto)
    }


    @Get()
    findAll(@CurrentOrg() orgId: string) {
        return this.branchService.findAll(orgId)
    }

    @Get(':id')
    findOne(@CurrentOrg() orgId: string, @Param('id') id: string) {
        return this.branchService.findOne(orgId, id)
    }

    @Patch(':id')
    update(
        @CurrentOrg() orgId: string,
        @Param('id') id: string,
        @Body() dto: UpdateBrachDto
    ) {
        return this.branchService.update(orgId, id, dto)
    }
    @Delete(':id')
    remove(
        @CurrentOrg() orgId: string,
        @Param('id') id: string,
    ) {
        return this.branchService.remove(
            orgId,
            id,
        );
    }
}
