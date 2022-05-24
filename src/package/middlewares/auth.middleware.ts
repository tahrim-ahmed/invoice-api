import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private static toResponse(res: Response, message: string): Response {
    return res
      .json({
        message,
      })
      .status(HttpStatus.UNAUTHORIZED);
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers['authorization']?.split('Bearer ')[1];

      if (!token) {
        return AuthMiddleware.toResponse(
          res,
          'Login is required before accessing',
        );
      }

      const privateKEY = fs.readFileSync('env/jwtRS256.key');

      jwt.verify(
        token,
        privateKEY,
        {
          algorithms: ['RS256'],
        },
        (err, decoded) => {
          if (err) return AuthMiddleware.toResponse(res, 'Token is invalid!!');
          else {
            req['_user'] = decoded;
            next();
          }
        },
      );
    } catch (error) {
      return AuthMiddleware.toResponse(res, 'Authorization is denied');
    }
  }
}
