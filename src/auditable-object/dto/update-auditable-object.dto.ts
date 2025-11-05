import { PartialType } from '@nestjs/mapped-types';
import { CreateAuditableObjectDto } from './create-auditable-object.dto';

export class UpdateAuditableObjectDto extends PartialType(CreateAuditableObjectDto) {
    name: string;
    address: string;
    ownerId?: number;
}
