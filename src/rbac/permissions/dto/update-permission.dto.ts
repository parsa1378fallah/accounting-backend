import { PartialType } from "@nestjs/mapped-types";
import { CreatePermissionDto } from "./create-permission";

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) { }