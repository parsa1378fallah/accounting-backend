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


import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';


import {
  JournalTemplateLineService,
} from './journal-template-line.service';


import {
  CreateJournalTemplateLineDto,
} from './dto/create-journal-template-line.dto';


import {
  UpdateJournalTemplateLineDto,
} from './dto/update-journal-template-line.dto';


import {
  QueryJournalTemplateLineDto,
} from './dto/query-journal-template-line.dto';



@ApiTags('Journal Template Lines')
@Controller('journal-template-lines')
export class JournalTemplateLineController {


  constructor(
    private readonly service:
      JournalTemplateLineService,
  ) { }



  @Post()
  @ApiOperation({
    summary: 'Create journal template line',
  })
  @ApiResponse({
    status: 201,
    description:
      'Journal template line created successfully',
  })
  @ApiBody({
    type: CreateJournalTemplateLineDto,
  })
  async create(
    @Body()
    dto: CreateJournalTemplateLineDto,
  ) {

    return this.service.create(dto);

  }





  @Get()
  @ApiOperation({
    summary: 'Get journal template lines',
  })
  @ApiResponse({
    status: 200,
    description:
      'Return journal template lines',
  })
  async findAll(
    @Query()
    query: QueryJournalTemplateLineDto,
  ) {

    return this.service.findAll(query);

  }





  @Get(':id')
  @ApiOperation({
    summary:
      'Get journal template line by id',
  })
  @ApiParam({
    name: 'id',
    example: 'clx123456',
  })
  @ApiResponse({
    status: 200,
    description:
      'Journal template line found',
  })
  @ApiResponse({
    status: 404,
    description:
      'Journal template line not found',
  })
  async findOne(
    @Param('id')
    id: string,
  ) {

    return this.service.findOne(id);

  }





  @Patch(':id')
  @ApiOperation({
    summary:
      'Update journal template line',
  })
  @ApiParam({
    name: 'id',
    example: 'clx123456',
  })
  @ApiBody({
    type: UpdateJournalTemplateLineDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Journal template line updated',
  })
  async update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateJournalTemplateLineDto,
  ) {

    return this.service.update(
      id,
      dto,
    );

  }





  @Delete(':id')
  @ApiOperation({
    summary:
      'Delete journal template line',
  })
  @ApiParam({
    name: 'id',
    example: 'clx123456',
  })
  @ApiResponse({
    status: 200,
    description:
      'Journal template line deleted',
  })
  async remove(
    @Param('id')
    id: string,
  ) {

    return this.service.remove(id);

  }


}