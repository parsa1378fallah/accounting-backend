import { PartialType } from '@nestjs/mapped-types'

import { CreateOrganizationDto } from './ctreate-organization.dto'

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) { }