import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CostCenterService } from './cost-center.service';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';

@Controller('cost-center')
export class CostCenterController {
  constructor(private readonly costCenterService: CostCenterService) {}

  @Post()
  create(@Body() createCostCenterDto: CreateCostCenterDto) {
    return this.costCenterService.create(createCostCenterDto);
  }

  @Get()
  findAll() {
    return this.costCenterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.costCenterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCostCenterDto: UpdateCostCenterDto) {
    return this.costCenterService.update(+id, updateCostCenterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.costCenterService.remove(+id);
  }
}
