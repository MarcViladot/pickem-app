import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './constants';
import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './guards/jwt/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt/jwt-auth.guard';
import { FirebaseAuthService } from "./services/firebase-auth.service";

@Module({
  imports: [UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret
    }),],
  providers: [AuthService, JwtStrategy, FirebaseAuthService],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
