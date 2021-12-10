import { Injectable } from '@nestjs/common';
import * as admin from "firebase-admin";
import { UserRole } from "../../user/entities/user.entity";
import { ITokenPayload } from "./auth.service";


@Injectable()
export class FirebaseAuthService {

  async createToken(uid: string, userId: number, role: UserRole): Promise<string> {
    const payload: ITokenPayload = {userId, role};
    return admin.auth().createCustomToken(uid, payload);
  }
}
