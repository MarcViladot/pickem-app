import { Match } from '../../match/entities/match.entity';

export interface IDashboardInfo {
  usersCount: number;
  groupsCount: number;
  liveMatchList: Match[];
}

export class DashboardInfo implements IDashboardInfo {
  groupsCount: number;
  usersCount: number;
  liveMatchList: Match[];

  constructor(groupsCount: number, usersCount: number, liveMatchList: Match[]) {
    this.groupsCount = groupsCount;
    this.usersCount = usersCount;    this.liveMatchList = liveMatchList;
  }
}
