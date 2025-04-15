import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { shouldBypassAuth } from './bypass.guard';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // constructor provided
  // so that the reflector gets injected
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    return (
      shouldBypassAuth(context, this.reflector) || super.canActivate(context)
    );
  }
}
