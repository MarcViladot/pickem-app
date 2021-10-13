import {Match} from './League';

export interface DashboardInfo {
    usersCount: number;
    groupsCount: number;
    liveMatchList: Match[];
}
