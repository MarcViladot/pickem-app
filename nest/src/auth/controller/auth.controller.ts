import { AuthService } from "src/auth/services/auth.service";
import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { User, UserRole } from "src/user/entities/user.entity";
import { JwtAuthGuard, RequestWithUid, RequestWithUser } from "../guards/jwt/jwt-auth.guard";
import { ResponseApi, ResponseApiEmpty, ResponseApiSuccess, WebApiResponseCode } from "../../utils/ResponseApi";
import { CurrentUser } from "../../user/entities/CurrentUser";
import { WebApiException } from "../../utils/WebApiException";
import { FirebaseAuthService } from "../services/firebase-auth.service";
import { CreateUserDto } from "../../user/dto/create-user.dto";


@Controller("auth")
export class AuthController {

  constructor(private authService: AuthService,
              private firebaseAuth: FirebaseAuthService) {
  }

  @Get("loginAuth")
  @UseGuards(JwtAuthGuard)
  async loginAuth(@Req() req: RequestWithUid): Promise<ResponseApi<CurrentUser>> {
    try {
      const user = await this.authService.getCurrentUser(req.user.user_id);
      if (user) {
        const token = await this.firebaseAuth.createToken(user.uid, user.id, user.userRole);
        const currentUser = new CurrentUser(user, token);
        return new ResponseApiSuccess(currentUser);
      }
      return new ResponseApiSuccess(null);
    } catch (e) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], e);
    }
  }

  @Post("create")
  async createUser(@Body() userDto: CreateUserDto): Promise<ResponseApi<CurrentUser>> {
    try {
      const user = await this.authService.createUser(userDto);
      const currentUser = await this.getCurrentUser(userDto.uid, user.id, user.userRole);
      return new ResponseApiSuccess(currentUser);
    } catch (error) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], error);
    }
  }

  private async getCurrentUser(uid: string, id: number, role: UserRole): Promise<CurrentUser> {
    const currentUser = await this.authService.getCurrentUser(uid);
    const token = await this.firebaseAuth.createToken(uid, id, role);
    return new CurrentUser(currentUser, token);
  }

  /*@Post('login')
   async login(@Body() body): Promise<ResponseApi<CurrentUser>> {
     const currentUser = await this.authService.login(body.email, body.password);
     return new ResponseApiSuccess(currentUser);
   }*/
}
