export class CreateAuditDto {
    objectId: number;
    auditorName: string;
    ownerSignerName: string;
    formState: Record<string, number>;
    resultValue?: number;
    resultDescription?: string;
}
