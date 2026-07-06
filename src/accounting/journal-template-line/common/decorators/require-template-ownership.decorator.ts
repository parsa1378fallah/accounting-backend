import { SetMetadata } from '@nestjs/common';

export const RequireTemplateOwnership = (templateIdParamName: string = 'templateId') =>
    SetMetadata('require-template-ownership', templateIdParamName);