import { Injectable } from '@nestjs/common';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';

@Injectable()
export class CostCenterService {
  create(createCostCenterDto: CreateCostCenterDto) {
    return 'This action adds a new costCenter';
  }

  findAll() {
    return `This action returns all costCenter`;
  }

  findOne(id: number) {
    return `This action returns a #${id} costCenter`;
  }

  update(id: number, updateCostCenterDto: UpdateCostCenterDto) {
    return `This action updates a #${id} costCenter`;
  }

  remove(id: number) {
    return `This action removes a #${id} costCenter`;
  }
}
