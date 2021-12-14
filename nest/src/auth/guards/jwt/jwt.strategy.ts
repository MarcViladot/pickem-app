import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { secrets } from "../../constants";
import { FirebasePayload } from "../../services/auth.service";
import decode from "jwt-decode";

interface TokenHeader {
  alg: string;
  kid: string;
  typ: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKeyProvider: (req, token, done) => {
        const decodedToken: TokenHeader = decode(token, {header: true})
        if (!decodedToken) {
          done(`Error: malformed token: ${decodedToken}`, null)
          return
        }
        const secretOrKey = secrets[decodedToken.kid]
        if (!secretOrKey) {
          done(`Error: key not found: ${decodedToken.kid}`, null)
          return
        }
        done(null, secretOrKey)
      }
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
