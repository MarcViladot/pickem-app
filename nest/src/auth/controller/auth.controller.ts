import { AuthService } from 'src/auth/services/auth.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard, RequestWithUser } from '../guards/jwt/jwt-auth.guard';
import { ResponseApi, ResponseApiSuccess, WebApiResponseCode } from "../../utils/ResponseApi";
import { CurrentUser } from "../../user/entities/CurrentUser";
import { WebApiException } from "../../utils/WebApiException";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @Get('loginAuth')
    @UseGuards(JwtAuthGuard)
    async loginAuth(@Req() req: RequestWithUser): Promise<ResponseApi<CurrentUser>> {
        try {
            const user = await this.authService.getCurrentUser(req);
            const currentUser = new CurrentUser(user);
            return new ResponseApiSuccess(currentUser);
        } catch (e) {
            throw new WebApiException(WebApiResponseCode.Unexpected, [], e);
        }
    }

    @Post('login')
    async login(@Body() body): Promise<ResponseApi<CurrentUser>> {
      const user = await this.authService.login(body.email, body.password);
      return new ResponseApiSuccess(user);
    }
}
