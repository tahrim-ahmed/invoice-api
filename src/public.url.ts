import { RequestMethod } from '@nestjs/common';

export const publicUrls = [
  { path: '/api/v1/auth/login', method: RequestMethod.POST },
  { path: '/api/v1/roles', method: RequestMethod.POST },
  { path: '/api/v1/users/registration', method: RequestMethod.POST },
];
