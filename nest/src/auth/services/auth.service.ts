import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { RequestWithUser } from '../guards/jwt/jwt-auth.guard';
import { WebApiException } from '../../utils/WebApiException';
import { WebApiResponseCode } from '../../utils/ResponseApi';
import { CurrentUser } from "../../user/entities/CurrentUser";

export interface ITokenPayload {
  userId: number;
  email: string;
  role: UserRole;
}

@Injectable()
export class AuthService {

  constructor(private usersService: UserService,
                private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmailWithPass(email);
    if (user && await this.isCorrectPassword(user.password, pass)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string): Promise<CurrentUser> {
    const user: User = await this.validateUser(email, password);
    if (!user) {
      throw new WebApiException(WebApiResponseCode.UserIncorrectCredentials, []);
    }
    const payload: ITokenPayload = {email, userId: user.id, role: user.userRole};
    const currentUser = await this.usersService.getCurrentUser(user.id);
    return new CurrentUser({
      ...currentUser,
      token: this.jwtService.sign(payload)
    })
  }

  async isCorrectPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async getUserFromRequest(req: RequestWithUser): Promise<User | undefined> {
    return this.usersService.findUserById(req.user.userId);
  }

  async getCurrentUser(req: RequestWithUser) {
    return this.usersService.getCurrentUser(req.user.userId);
  }

  async getCurrentUserAdmin(req: RequestWithUser) {
    return this.usersService.getCurrentUserAdmin(req.user.userId);
  }

}
