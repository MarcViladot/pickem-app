import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { ResponseApi, ResponseApiSuccess } from '../utils/ResponseApi';
import { DashboardInfo, IDashboardInfo } from './interfaces/dashboard.interface';

@Controller('dashboard')
/*@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)*/
export class DashboardController {

  constructor(private dashboardService: DashboardService) {
  }

  @Get('info')
  async getDashboardInfo(): Promise<ResponseApi<IDashboardInfo>> {
    const userCount = await this.dashboardService.getTotalUserCount();
    const groupCount = await this.dashboardService.getTotalGroupCount();
    const liveMatchList = await this.dashboardService.getLiveMatches();
    const dashboardInfo = new DashboardInfo(groupCount, userCount, liveMatchList)
    return new ResponseApiSuccess(dashboardInfo);
  }

}
