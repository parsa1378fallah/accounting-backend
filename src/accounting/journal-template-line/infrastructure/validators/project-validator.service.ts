import { Injectable, Logger, Inject } from '@nestjs/common';
import { MissingProjectException } from '../../common/exceptions/missing-reference.exception';

export interface ProjectValidatorInterface {
    exists(projectId: string): Promise<boolean>;
    getProject(projectId: string): Promise<any>;
}

@Injectable()
export class ProjectValidatorService {
    private readonly logger = new Logger(ProjectValidatorService.name);

    constructor(
        @Inject('PROJECT_SERVICE')
        private readonly projectService: ProjectValidatorInterface,
    ) { }

    async validateExists(projectId: string): Promise<void> {
        if (!projectId) {
            return; // اختیاری است
        }

        this.logger.debug(`Validating project: ${projectId}`);

        try {
            const exists = await this.projectService.exists(projectId);

            if (!exists) {
                throw new MissingProjectException(projectId);
            }

            this.logger.debug(`Project validation passed: ${projectId}`);
        } catch (error) {
            this.logger.error(`Project validation failed: ${error.message}`);
            throw error;
        }
    }

    async validate(projectId: string): Promise<any> {
        if (!projectId) {
            return null;
        }

        await this.validateExists(projectId);
        return this.projectService.getProject(projectId);
    }
}