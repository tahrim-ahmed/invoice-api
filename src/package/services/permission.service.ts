import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserResponseDto } from '../dto/response/user-response.dto';

@Injectable()
export class PermissionService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  admin = (): { userID: string; status: boolean } => {
    const user: UserResponseDto = this.request['_user'] as UserResponseDto;
    if (user) {
      if (user.isAdmin) {
        return {
          userID: user.userID,
          status: true,
        };
      }
    }
    return {
      userID: null,
      status: false,
    };
  };

  user = (): { userID: string; status: boolean } => {
    const user: UserResponseDto = this.request['_user'] as UserResponseDto;
    if (user) {
      if (user.isUser) {
        return {
          userID: user.userID,
          status: true,
        };
      }
    }
    return {
      userID: null,
      status: false,
    };
  };
}
