import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import { User, UserRole } from "./entities/user.entity";
import { JwtAuthGuard, RequestWithUser } from "../auth/guards/jwt/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import {
  ResponseApi,
  ResponseApiEmpty,
  ResponseApiError,
  ResponseApiSuccess,
  WebApiResponseCode
} from "../utils/ResponseApi";
import { FirebaseException, WebApiException } from "../utils/WebApiException";

@Controller("user")
export class UserController {

  constructor(private userService: UserService) {
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getUserById(@Param() id: number): Promise<ResponseApi<User>> {
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new WebApiException(WebApiResponseCode.UserNotFound, [id]);
    }
    return new ResponseApiSuccess(user);
  }

  @Get("byEmail/:email")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getByEmail(@Param() params: { email: string }): Promise<ResponseApi<User[]>> {
    try {
      const users = await this.userService.findByEmail(params.email);
      return new ResponseApiSuccess(users);
    } catch (e) {
      if (e instanceof FirebaseException) {
        throw e;
      } else {
        throw new WebApiException(WebApiResponseCode.Unexpected, []);
      }
    }
  }

  @Get(":maxCount/:nextPageToken")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers(@Param() params: { maxCount: string, nextPageToken: string }): Promise<ResponseApi<{ parsedUsers: User[], nextPageToken: string }>> {
    const maxRows = +params.maxCount !== -1 ? +params.maxCount : 1000
    console.log(maxRows);
    const users = await this.userService.findAll(maxRows, params.nextPageToken);
    return new ResponseApiSuccess(users);
  }
}
