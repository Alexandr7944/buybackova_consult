import { Test, TestingModule } from '@nestjs/testing';
import { AuditableObjectService } from './auditable-object.service';

describe('AuditableObjectService', () => {
  let service: AuditableObjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditableObjectService],
    }).compile();

    service = module.get<AuditableObjectService>(AuditableObjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
