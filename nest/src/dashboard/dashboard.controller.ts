import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard, RequestWithUid } from "../auth/guards/jwt/jwt-auth.guard";
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { ResponseApi, ResponseApiSuccess } from '../utils/ResponseApi';
import { DashboardInfo, IAppDashboard, IDashboardInfo } from "./interfaces/dashboard.interface";

@Controller('dashboard')
/*@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)*/
export class DashboardController {

  constructor(private dashboardService: DashboardService) {
  }

  @Get('info')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getDashboardInfo(): Promise<ResponseApi<IDashboardInfo>> {
    const userCount = await this.dashboardService.getTotalUserCount();
    const groupCount = await this.dashboardService.getTotalGroupCount();
    const teamsCount = await this.dashboardService.getTotalTeamsCount();
    const leaguesCount = await this.dashboardService.getTotalLeaguesCount();
    const predictionsCount = await this.dashboardService.getTotalPredictionsCount();
    const liveMatchList = await this.dashboardService.getLiveMatches();
    const dashboardInfo = new DashboardInfo(groupCount, userCount, liveMatchList, leaguesCount, teamsCount, predictionsCount);
    return new ResponseApiSuccess(dashboardInfo);
  }

  @Get('app')
  @UseGuards(JwtAuthGuard)
  async getAppDashboard(@Req() req: RequestWithUid): Promise<ResponseApi<IAppDashboard>> {
    const nextRounds = await this.dashboardService.getNextRounds(req.user.userId);
    const dashboardInfo: IAppDashboard = {
      nextRounds
    };
    return new ResponseApiSuccess(dashboardInfo);
  }

}
