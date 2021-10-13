import { AuthService } from 'src/auth/services/auth.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard, RequestWithUser } from '../guards/jwt/jwt-auth.guard';
import { ResponseApi, ResponseApiSuccess } from '../../utils/ResponseApi';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @Get('loginAuth')
    @UseGuards(JwtAuthGuard)
    async loginAuth(@Req() req: RequestWithUser): Promise<ResponseApi<User>> {
        const user = await this.authService.getCurrentUser(req);
        return new ResponseApiSuccess(user || null);
    }

    @Post('login')
    async login(@Body() body): Promise<ResponseApi<User>> {
      const user = await this.authService.login(body.email, body.password);
      return new ResponseApiSuccess(user);
    }
}
