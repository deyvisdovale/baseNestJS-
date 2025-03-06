import { SetMetadata } from '@nestjs/common';

export const MODULE_ACCESS_KEY = 'module_access';
export const Module_Access = (...module_access: string[]) =>
  SetMetadata(MODULE_ACCESS_KEY, module_access);
