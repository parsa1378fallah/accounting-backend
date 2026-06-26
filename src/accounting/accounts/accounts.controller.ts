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

import { AccountsService } from './accounts.service';

import {
  CreateAccountDto,
  UpdateAccountDto,
  AccountQueryDto,
} from './dto';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
  ) { }

  // ============================================================
  // CREATE
  // ============================================================

  @Post()
  @ApiOperation({
    summary: 'Create account',
    description:
      'Create a new chart of account record',
  })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully',
  })
  create(
    @Body()
    dto: CreateAccountDto,
  ) {
    return this.accountsService.create(dto);
  }

  // ============================================================
  // FIND ALL
  // ============================================================

  @Get()
  @ApiOperation({
    summary: 'Get all accounts',
  })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiQuery({
    name: 'search',
    required: false,
  })
  @ApiQuery({
    name: 'organizationId',
    required: false,
  })
  @ApiQuery({
    name: 'accountCategoryId',
    required: false,
  })
  findAll(
    @Query()
    query: AccountQueryDto,
  ) {
    return this.accountsService.findAll(query);
  }

  // ============================================================
  // TREE
  // ============================================================

  @Get('tree/:organizationId')
  @ApiOperation({
    summary: 'Get account hierarchy tree',
  })
  @ApiParam({
    name: 'organizationId',
  })
  tree(
    @Param('organizationId')
    organizationId: string,
  ) {
    return this.accountsService.tree(
      organizationId,
    );
  }

  // ============================================================
  // SUMMARY
  // ============================================================

  @Get('summary')
  @ApiOperation({
    summary: 'Get accounts summary',
  })
  @ApiQuery({
    name: 'organizationId',
    required: false,
  })
  summary(
    @Query('organizationId')
    organizationId?: string,
  ) {
    return this.accountsService.summary(
      organizationId,
    );
  }

  // ============================================================
  // FIND ONE
  // ============================================================

  @Get(':id')
  @ApiOperation({
    summary: 'Get account by id',
  })
  @ApiParam({
    name: 'id',
  })
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.accountsService.findOne(id);
  }

  // ============================================================
  // UPDATE
  // ============================================================

  @Patch(':id')
  @ApiOperation({
    summary: 'Update account',
  })
  @ApiParam({
    name: 'id',
  })
  update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateAccountDto,
  ) {
    return this.accountsService.update(
      id,
      dto,
    );
  }

  // ============================================================
  // DELETE
  // ============================================================

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft delete account',
  })
  @ApiParam({
    name: 'id',
  })
  remove(
    @Param('id')
    id: string,
  ) {
    return this.accountsService.remove(id);
  }

  // ============================================================
  // RESTORE
  // ============================================================

  @Patch(':id/restore')
  @ApiOperation({
    summary: 'Restore account',
  })
  @ApiParam({
    name: 'id',
  })
  restore(
    @Param('id')
    id: string,
  ) {
    return this.accountsService.restore(id);
  }

  // ============================================================
  // ACTIVATE
  // ============================================================

  @Patch(':id/activate')
  @ApiOperation({
    summary: 'Activate account',
  })
  @ApiParam({
    name: 'id',
  })
  activate(
    @Param('id')
    id: string,
  ) {
    return this.accountsService.activate(id);
  }

  // ============================================================
  // DEACTIVATE
  // ============================================================

  @Patch(':id/deactivate')
  @ApiOperation({
    summary: 'Deactivate account',
  })
  @ApiParam({
    name: 'id',
  })
  deactivate(
    @Param('id')
    id: string,
  ) {
    return this.accountsService.deactivate(id);
  }
}