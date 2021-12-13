import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { RequestWithUid, RequestWithUser } from "../guards/jwt/jwt-auth.guard";
import { WebApiException } from '../../utils/WebApiException';
import { WebApiResponseCode } from '../../utils/ResponseApi';
import { CurrentUser } from "../../user/entities/CurrentUser";
import { CreateUserDto } from "../../user/dto/create-user.dto";

export interface ITokenPayload {
  userId: number;
  role: UserRole;
  user_id?: string;
}

export interface FirebasePayload {
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string;
  iat: number;
  exp: number;
  email: string;
  email_verified: boolean;
  firebase: any;
  // CUSTOM TOKEN FIELDS
  userRole?: UserRole;
  userId: number;
}


@Injectable()
export class AuthService {

  constructor(private usersService: UserService,
                private jwtService: JwtService) {}

  async getCurrentUser(uid: string) {
    return this.usersService.getCurrentUser(uid);
  }

  async getCurrentUserAdmin(req: RequestWithUser) {
    return this.usersService.getCurrentUserAdmin(req.user.userId);
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(userDto);
  }
}
