import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector }
  from '@nestjs/core';

import { InjectRepository }
  from '@nestjs/typeorm';

import { Repository }
  from 'typeorm';

import { ROLES_KEY }
  from '../decorators/roles.decorator';

import { User }
  from '../../modules/users/entities/user.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class RolesGuard
  implements CanActivate {

  constructor(
    private reflector: Reflector,

    @InjectRepository(User)
    private userRepository:
      Repository<User>,
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const requiredRoles =
      this.reflector.getAllAndOverride(
        ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    /*
      NO ROLE REQUIRED
    */

    if (!requiredRoles) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest();

    const userId =
      request.headers['x-user-id'];


    if (!isUUID(String(userId))) {
      throw new UnauthorizedException(
        'Invalid user id format',
      );
    }



    if (!userId) {
      throw new UnauthorizedException(
        'x-user-id header missing',
      );
    }

    const user =
      await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    const hasRole =
      requiredRoles.includes(
        user.role,
      );

    if (!hasRole) {
      throw new ForbiddenException(
        'Access denied',
      );
    }

    return true;
  }
}

