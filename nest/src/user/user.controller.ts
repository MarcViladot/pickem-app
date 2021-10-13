import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User, UserRole } from './entities/user.entity';
import { JwtAuthGuard, RequestWithUser } from '../auth/guards/jwt/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResponseApi, ResponseApiEmpty, ResponseApiSuccess, WebApiResponseCode } from '../utils/ResponseApi';
import { WebApiException } from '../utils/WebApiException';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {
    }

    @Post('create')
    async createUser(@Body() userDto: CreateUserDto): Promise<ResponseApiEmpty> {
        try {
            await this.userService.createUser(userDto);
            return new ResponseApiEmpty();
        } catch (error) {
            throw new WebApiException(WebApiResponseCode.Unexpected, [], error);
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async getUserById(@Param() id: number, @Req() req: RequestWithUser): Promise<ResponseApi<User>> {
        const user = await this.userService.findUserById(id);
        if (!user) {
            throw new WebApiException(WebApiResponseCode.UserNotFound, [id]);
        }
        return new ResponseApiSuccess(user);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async getAllUsers(): Promise<ResponseApi<User[]>> {
        const users = await this.userService.findAll();
        return new ResponseApiSuccess(users);
    }
}
