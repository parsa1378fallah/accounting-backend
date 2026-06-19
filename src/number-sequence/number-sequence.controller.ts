import { Body, Controller, Post, Get } from '@nestjs/common';
import { NumberSequenceService } from './number-sequence.service';
import { CurrentOrg } from 'src/common/decorators/current-org.decorator';

@Controller('number-sequences')
export class NumberSequenceController {
  constructor(private service: NumberSequenceService) { }

  @Post()
  create(@CurrentOrg() orgId: string, @Body() body: any) {
    return this.service.createSequence(
      orgId,
      body.entity,
      body.prefix,
      body.padding,
    );
  }

  @Get('next/:entity')
  getNext(@CurrentOrg() orgId: string, body: any) {
    return this.service.getNextNumber(orgId, body.entity);
  }
}