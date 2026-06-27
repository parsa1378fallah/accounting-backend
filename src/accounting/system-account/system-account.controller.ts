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

import { SystemAccountService } from './system-account.service';
import {
  CreateSystemAccountDto,
  UpdateSystemAccountDto,
  SystemAccountQueryDto,
} from './dto';

@ApiTags('System Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system-accounts')
export class SystemAccountController {
  constructor(
    private readonly systemAccountService: SystemAccountService,
  ) { }

  // ----------------------------------------------------------------
  // CREATE
  // ----------------------------------------------------------------

  @Post()
  @ApiOperation({
    summary: 'Create a new system account',
  })
  @ApiResponse({
    status: 201,
    description: 'System account created successfully',
  })
  create(@Body() dto: CreateSystemAccountDto) {
    return this.systemAccountService.create(dto);
  }

  // ----------------------------------------------------------------
  // FIND ALL
  // ----------------------------------------------------------------

  @Get()
  @ApiOperation({
    summary: 'Get all system accounts',
  })
  @ApiResponse({
    status: 200,
    description: 'List of system accounts',
  })
  findAll(@Query() query: SystemAccountQueryDto) {
    return this.systemAccountService.findAll(query);
  }

  // ----------------------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------------------

  @Get('summary/:organizationId')
  @ApiOperation({
    summary: 'Get system account summary',
  })
  @ApiParam({
    name: 'organizationId',
    description: 'Organization ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Summary returned successfully',
  })
  summary(@Param('organizationId') organizationId: string) {
    return this.systemAccountService.summary(organizationId);
  }

  // ----------------------------------------------------------------
  // FIND ONE
  // ----------------------------------------------------------------

  @Get(':id')
  @ApiOperation({
    summary: 'Get system account by id',
  })
  @ApiParam({
    name: 'id',
    description: 'System Account ID',
  })
  @ApiResponse({
    status: 200,
    description: 'System account details',
  })
  findOne(@Param('id') id: string) {
    return this.systemAccountService.findOne(id);
  }

  // ----------------------------------------------------------------
  // UPDATE
  // ----------------------------------------------------------------

  @Patch(':id')
  @ApiOperation({
    summary: 'Update system account',
  })
  @ApiParam({
    name: 'id',
    description: 'System Account ID',
  })
  @ApiResponse({
    status: 200,
    description: 'System account updated successfully',
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSystemAccountDto,
  ) {
    return this.systemAccountService.update(id, dto);
  }

  // ----------------------------------------------------------------
  // ACTIVATE
  // ----------------------------------------------------------------

  @Patch(':id/activate')
  @ApiOperation({
    summary: 'Activate system account',
  })
  @ApiParam({
    name: 'id',
    description: 'System Account ID',
  })
  @ApiResponse({
    status: 200,
    description: 'System account activated successfully',
  })
  activate(@Param('id') id: string) {
    return this.systemAccountService.activate(id);
  }

  // ----------------------------------------------------------------
  // DEACTIVATE
  // ----------------------------------------------------------------

  @Patch(':id/deactivate')
  @ApiOperation({
    summary: 'Deactivate system account',
  })
  @ApiParam({
    name: 'id',
    description: 'System Account ID',
  })
  @ApiResponse({
    status: 200,
    description: 'System account deactivated successfully',
  })
  deactivate(@Param('id') id: string) {
    return this.systemAccountService.deactivate(id);
  }

  // ----------------------------------------------------------------
  // RESTORE
  // ----------------------------------------------------------------

  @Patch(':id/restore')
  @ApiOperation({
    summary: 'Restore soft deleted system account',
  })
  @ApiParam({
    name: 'id',
    description: 'System Account ID',
  })
  @ApiResponse({
    status: 200,
    description: 'System account restored successfully',
  })
  restore(@Param('id') id: string) {
    return this.systemAccountService.restore(id);
  }

  // ----------------------------------------------------------------
  // DELETE
  // ----------------------------------------------------------------

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft delete system account',
  })
  @ApiParam({
    name: 'id',
    description: 'System Account ID',
  })
  @ApiResponse({
    status: 200,
    description: 'System account deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.systemAccountService.remove(id);
  }
}