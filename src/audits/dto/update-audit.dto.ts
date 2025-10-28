import { PartialType } from '@nestjs/mapped-types';
import { CreateAuditDto } from './create-audit.dto';

export class UpdateAuditDto extends PartialType(CreateAuditDto) {
    formState: Record<string, number>;
    auditorName: string;
    ownerSignerName: string;
}
