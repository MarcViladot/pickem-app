import { Match } from "../../match/entities/match.entity";

export interface IDashboardInfo {
  usersCount: number;
  groupsCount: number;
  leaguesCount: number;
  teamsCount: number;
  predictionsCount: number;
  liveMatchList: Match[];
}

export class DashboardInfo implements IDashboardInfo {
  groupsCount: number;
  usersCount: number;
  leaguesCount: number;
  predictionsCount: number;
  teamsCount: number;
  liveMatchList: Match[];

  constructor(groupsCount: number, usersCount: number, liveMatchList: Match[], leaguesCount: number, teamsCount: number, predictionsCount: number) {
    this.groupsCount = groupsCount;
    this.usersCount = usersCount;
    this.liveMatchList = liveMatchList;
    this.teamsCount = teamsCount;
    this.leaguesCount = leaguesCount;
    this.predictionsCount = predictionsCount;
  }
}
