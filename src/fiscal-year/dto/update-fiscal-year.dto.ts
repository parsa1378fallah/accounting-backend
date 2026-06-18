import { PartialType } from "@nestjs/mapped-types";

import { CreateFiscalYearDto } from "./create-fiscal-year.dto";

export class UpdateFiscalaYearDto extends PartialType(CreateFiscalYearDto) { }