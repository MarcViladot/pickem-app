import { Controller, Get, Post, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/services/auth.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService,
              private authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


}
