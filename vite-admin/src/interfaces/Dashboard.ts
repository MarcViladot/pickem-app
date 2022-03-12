import { Match } from "./League";

export interface DashboardInfo {
  usersCount: number;
  groupsCount: number;
  leaguesCount: number;
  teamsCount: number;
  predictionsCount: number;
  liveMatchList: Match[];
}
