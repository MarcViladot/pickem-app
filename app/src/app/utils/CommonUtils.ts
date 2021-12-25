import {Round} from '../interfaces/league.interface';

export class CommonUtils {

    public static getRoundName(round: Round, lang: string): string {
        const translatedName = round.translationGroup.roundNames.find((trans) => trans.lang === lang);
        if (translatedName) {
            return `${translatedName.text} ${round.translationNameExtra}`;
        }
        return round.name;
    }
}
