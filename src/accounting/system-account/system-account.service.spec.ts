import { Test, TestingModule } from '@nestjs/testing';
import { SystemAccountService } from './system-account.service';

describe('SystemAccountService', () => {
  let service: SystemAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemAccountService],
    }).compile();

    service = module.get<SystemAccountService>(SystemAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
