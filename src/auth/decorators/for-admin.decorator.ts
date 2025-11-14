import { SetMetadata } from '@nestjs/common';

export const ADMIN_KEY = 'is_admin';
export const ForAdmin = () => SetMetadata(ADMIN_KEY, true);
