import { SetMetadata } from '@nestjs/common';

export const Roles = (...hasRoles: number[]) => SetMetadata('roles', hasRoles);
