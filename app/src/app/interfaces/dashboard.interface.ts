import {Round} from './league.interface';

export interface IAppDashboard {
    nextRounds: Round[];
}

export class AppDashboard implements IAppDashboard {

    nextRounds: Round[];

    constructor(api: IAppDashboard) {
        this.nextRounds = [];
        this.setState(api);
    }

    setState(newState: IAppDashboard) {
        this.nextRounds = newState.nextRounds;
    }
}
