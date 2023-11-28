import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {

    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) return false;
    
    const token = request.headers.authorization.split(' ')[1]; 
    
    return token !== null;
  }
}
