import { Injectable } from '@nestjs/common';

@Injectable()
export class CloseFiscalYearValidator {
    async validate(): Promise<void> {
        // Orchestrator (later we inject all validators here)
    }
}