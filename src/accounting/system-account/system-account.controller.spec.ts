import { Test, TestingModule } from '@nestjs/testing';
import { SystemAccountController } from './system-account.controller';
import { SystemAccountService } from './system-account.service';

describe('SystemAccountController', () => {
  let controller: SystemAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemAccountController],
      providers: [SystemAccountService],
    }).compile();

    controller = module.get<SystemAccountController>(SystemAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
