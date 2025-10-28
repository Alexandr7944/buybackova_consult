import { Test, TestingModule } from '@nestjs/testing';
import { MaturityLevelController } from './maturity-level.controller';
import { MaturityLevelService } from './maturity-level.service';

describe('MaturityLevelController', () => {
  let controller: MaturityLevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaturityLevelController],
      providers: [MaturityLevelService],
    }).compile();

    controller = module.get<MaturityLevelController>(MaturityLevelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
