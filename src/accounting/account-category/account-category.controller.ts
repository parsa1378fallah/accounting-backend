import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { AccountCategoriesService } from './account-category.service';

import {
  CreateAccountCategoryDto,
  UpdateAccountCategoryDto,
  AccountCategoryQueryDto,
} from './dto';

@ApiTags('Account Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('account-categories')
export class AccountCategoriesController {
  constructor(
    private readonly accountCategoriesService: AccountCategoriesService,
  ) { }

  @Post()
  @ApiOperation({
    summary: 'Create account category',
  })
  @ApiResponse({
    status: 201,
    description: 'Account category created successfully',
  })
  create(
    @Body()
    dto: CreateAccountCategoryDto,
  ) {
    return this.accountCategoriesService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all account categories',
  })
  @ApiQuery({
    name: 'search',
    required: false,
  })
  @ApiQuery({
    name: 'accountGroupId',
    required: false,
  })
  findAll(
    @Query()
    query: AccountCategoryQueryDto,
  ) {
    return this.accountCategoriesService.findAll(query);
  }

  @Get('summary')
  @ApiOperation({
    summary: 'Get account categories summary',
  })
  summary() {
    return this.accountCategoriesService.summary();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get account category by id',
  })
  @ApiParam({
    name: 'id',
  })
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.accountCategoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update account category',
  })
  @ApiParam({
    name: 'id',
  })
  update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateAccountCategoryDto,
  ) {
    return this.accountCategoriesService.update(
      id,
      dto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete account category',
  })
  @ApiParam({
    name: 'id',
  })
  remove(
    @Param('id')
    id: string,
  ) {
    return this.accountCategoriesService.remove(id);
  }
}