import { ViesTools } from "./ViesTools";

export class DateTools {
  public static getCompleteDate(date: Date): string {
    let str = ``;
    if (date != null) {
      const month = date.getMonth() + 1;
      str = `${ViesTools.numberTo2digits(date.getDate())}/${ViesTools.numberTo2digits(
        month,
      )}/${date.getFullYear()} ${ViesTools.numberTo2digits(date.getHours())}:${ViesTools.numberTo2digits(
        date.getMinutes(),
      )}:${ViesTools.numberTo2digits(date.getSeconds())}`;
    }
    return str;
  }

  public static getDayDate(date: Date): string {
    let str = ``;
    if (date != null) {
      const month = date.getMonth() + 1;
      str = `${ViesTools.numberTo2digits(date.getDate())}/${ViesTools.numberTo2digits(month)}/${date.getFullYear()}`;
    }
    return str;
  }

  public static getMatchParsedDate(date: Date): string {
    let str = ``;
    if (date != null) {
      const month = date.getMonth() + 1;
      str = `${ViesTools.numberTo2digits(date.getDate())}/${ViesTools.numberTo2digits(month)} ${ViesTools.numberTo2digits(
        date.getHours(),
      )}:${ViesTools.numberTo2digits(date.getMinutes())}`;
    }
    return str;
  }
}
