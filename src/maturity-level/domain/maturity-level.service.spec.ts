import { Test, TestingModule } from '@nestjs/testing';
import { MaturityLevelService } from './maturity-level.service';

describe('MaturityLevelService', () => {
  let service: MaturityLevelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaturityLevelService],
    }).compile();

    service = module.get<MaturityLevelService>(MaturityLevelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
