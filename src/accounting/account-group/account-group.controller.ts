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

import { AccountGroupsService } from './account-group.service';

import {
  CreateAccountGroupDto,
  UpdateAccountGroupDto,
  AccountGroupQueryDto,
} from './dto';

@ApiTags('Account Groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('account-groups')
export class AccountGroupsController {
  constructor(
    private readonly accountGroupsService: AccountGroupsService,
  ) { }

  // ============================================================
  // CREATE
  // ============================================================

  @Post()
  @ApiOperation({
    summary: 'Create account group',
    description:
      'Create a new account group (Assets, Liabilities, Revenue, Expenses, Equity)',
  })
  @ApiResponse({
    status: 201,
    description: 'Account group created successfully',
  })
  create(
    @Body()
    dto: CreateAccountGroupDto,
  ) {
    return this.accountGroupsService.create(dto);
  }

  // ============================================================
  // FIND ALL
  // ============================================================

  @Get()
  @ApiOperation({
    summary: 'Get all account groups',
  })
  @ApiQuery({
    name: 'search',
    required: false,
  })
  findAll(
    @Query()
    query: AccountGroupQueryDto,
  ) {
    return this.accountGroupsService.findAll(query);
  }

  // ============================================================
  // SUMMARY
  // ============================================================

  @Get('summary')
  @ApiOperation({
    summary: 'Get account groups summary',
  })
  summary() {
    return this.accountGroupsService.summary();
  }

  // ============================================================
  // FIND ONE
  // ============================================================

  @Get(':id')
  @ApiOperation({
    summary: 'Get account group by id',
  })
  @ApiParam({
    name: 'id',
    description: 'Account Group ID',
  })
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.accountGroupsService.findOne(id);
  }

  // ============================================================
  // UPDATE
  // ============================================================

  @Patch(':id')
  @ApiOperation({
    summary: 'Update account group',
  })
  @ApiParam({
    name: 'id',
    description: 'Account Group ID',
  })
  update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateAccountGroupDto,
  ) {
    return this.accountGroupsService.update(
      id,
      dto,
    );
  }

  // ============================================================
  // DELETE
  // ============================================================

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete account group',
  })
  @ApiParam({
    name: 'id',
    description: 'Account Group ID',
  })
  remove(
    @Param('id')
    id: string,
  ) {
    return this.accountGroupsService.remove(id);
  }
}