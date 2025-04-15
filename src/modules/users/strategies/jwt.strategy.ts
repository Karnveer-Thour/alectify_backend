import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectConfig } from '@common/decorators/inject-config.decorator';
import { JWTConfig } from '@core/jwt/jwt.config';
// import { UserEntity } from '../..//users/entities/user.entity';
// import { UsersRepository } from '../..//users/repositories/users.repository';
// import { LoginDto } from '../dto/login.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectConfig(JWTConfig)
    private readonly JWTConfigFactory: ConfigType<typeof JWTConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWTConfigFactory.jwtSecret,
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
