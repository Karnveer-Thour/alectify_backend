import { JWTConfig } from '@core/jwt/jwt.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UsersRepository } from './repositories/users.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from './users.service';
import { UserFcmTokenService } from './services/user-fcm-token.service';
import { UserContactsRepository } from './repositories/user-contacts.repository';
import { UserFcmTokenRepository } from './repositories/user-fcm-token.repository';
import { AWSConfig } from '@core/aws/aws.config';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forFeature(JWTConfig),
    ConfigModule.forFeature(AWSConfig),
  ],
  controllers: [],
  providers: [
    JwtStrategy,
    UsersService,
    UsersRepository,
    UserFcmTokenService,
    UserContactsRepository,
    UserFcmTokenRepository,
  ],
  exports: [UsersService, UserFcmTokenService],
})
export class UsersModule {}
