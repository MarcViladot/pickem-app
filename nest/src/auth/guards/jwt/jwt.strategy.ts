import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../../constants';
import { FirebasePayload, ITokenPayload } from "../../services/auth.service";
import { UserRole } from "../../../user/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: FirebasePayload): Promise<FirebasePayload> {
    if (!payload.userRole) {
      return { ...payload };
    }
    return {
      ...payload,
      userRole: payload.userRole,
      userId: payload.userId,
    }
  }
}
