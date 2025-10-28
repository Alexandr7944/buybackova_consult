import { Test, TestingModule } from '@nestjs/testing';
import { AuditableObjectController } from './auditable-object.controller';
import { AuditableObjectService } from './auditable-object.service';

describe('AuditableObjectController', () => {
  let controller: AuditableObjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditableObjectController],
      providers: [AuditableObjectService],
    }).compile();

    controller = module.get<AuditableObjectController>(AuditableObjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
