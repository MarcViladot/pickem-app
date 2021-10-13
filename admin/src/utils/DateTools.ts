import {ViesTools} from './ViesTools';

export class DateTools {

  public static convertFromServerDate(serverDate: string): Date | null {
    // Assumes that the date from server is UTC
    if (serverDate) {
      const dateParts = serverDate.split('T');
      const dateDayParts = dateParts[0].split('-');
      const dateTimeParts = dateParts[1].split(':');

      const DateSentUTCyear = parseInt(dateDayParts[0], 10);
      const DateSentUTCmonth = parseInt(dateDayParts[1], 10);
      const DateSentUTCday = parseInt(dateDayParts[2], 10);

      const DateSentUTChour = parseInt(dateTimeParts[0], 10);
      const DateSentUTCmin = parseInt(dateTimeParts[1], 10);
      const DateSentUTCsec = parseInt(dateTimeParts[2], 10);

      return new Date(Date.UTC(DateSentUTCyear, DateSentUTCmonth - 1, DateSentUTCday, DateSentUTChour, DateSentUTCmin, DateSentUTCsec));
    }
    return null;
  }

  public static convertFromServerDateLocal(serverDate: string): Date | null {
    // Assumes that the date from server is local time
    if (serverDate !== null) {
      const dateParts = serverDate.split('T');
      const dateDayParts = dateParts[0].split('-');
      const dateTimeParts = dateParts[1].split(':');

      const DateSentUTCyear = parseInt(dateDayParts[0], 10);
      const DateSentUTCmonth = parseInt(dateDayParts[1], 10);
      const DateSentUTCday = parseInt(dateDayParts[2], 10);

      const DateSentUTChour = parseInt(dateTimeParts[0], 10);
      const DateSentUTCmin = parseInt(dateTimeParts[1], 10);
      const DateSentUTCsec = parseInt(dateTimeParts[2], 10);

      return new Date(DateSentUTCyear, DateSentUTCmonth - 1, DateSentUTCday, DateSentUTChour, DateSentUTCmin, DateSentUTCsec);
    }
    return null;
  }

  public static convertToServerDate(date: Date): string {
    const month = date.getMonth() + 1;
    return `${date.getFullYear()}-${ViesTools.numberTo2digits(month)}-${ViesTools.numberTo2digits(date.getDate())}T${ViesTools.numberTo2digits(date.getHours())}:${ViesTools.numberTo2digits(date.getMinutes())}:${ViesTools.numberTo2digits(date.getSeconds())}:${ViesTools.numberTo3digits(date.getMilliseconds())}`;
  }

  public static convertToServerDateUTC(date: Date): string {
    const month = date.getUTCMonth() + 1;
    return `${date.getUTCFullYear()}-${ViesTools.numberTo2digits(month)}-${ViesTools.numberTo2digits(date.getUTCDate())}T${ViesTools.numberTo2digits(date.getUTCHours())}:${ViesTools.numberTo2digits(date.getUTCMinutes())}:${ViesTools.numberTo2digits(date.getUTCSeconds())}:${ViesTools.numberTo3digits(date.getUTCMilliseconds())}`;
  }

  public static getCompleteDate(date: Date): string {
    let str: string = '';
    if (date != null) {
      const month = date.getMonth() + 1;
      str = `${ViesTools.numberTo2digits(date.getDate())}/${ViesTools.numberTo2digits(month)}/${date.getFullYear()} ${ViesTools.numberTo2digits(date.getHours())}:${ViesTools.numberTo2digits(date.getMinutes())}:${ViesTools.numberTo2digits(date.getSeconds())}`;
    }
    return str;
  }

  public static getDayDate(date: Date): string {
    let str: string = '';
    if (date != null) {
      const month = date.getMonth() + 1;
      str = `${ViesTools.numberTo2digits(date.getDate())}/${ViesTools.numberTo2digits(month)}/${date.getFullYear()}`;
    }
    return str;
  }

  public static getCompleteDateToSeconds(date: Date): string {
    let str: string = '';
    if (date != null) {
      const month = date.getMonth() + 1;
      str = `${ViesTools.numberTo2digits(date.getDate())}/${ViesTools.numberTo2digits(month)}/${date.getFullYear()} ${ViesTools.numberTo2digits(date.getHours())}:${ViesTools.numberTo2digits(date.getMinutes())}:${ViesTools.numberTo2digits(date.getSeconds())}`;
    }
    return str;
  }

  public static getCompleteDateToMilisecons(date: Date): string {
    let str: string = '';
    if (date != null) {
      const month = date.getMonth() + 1;
      str = `${ViesTools.numberTo2digits(date.getDate())}/${ViesTools.numberTo2digits(month)}/${date.getFullYear()} ${ViesTools.numberTo2digits(date.getHours())}:${ViesTools.numberTo2digits(date.getMinutes())}:${ViesTools.numberTo2digits(date.getSeconds())}:${ViesTools.numberTo3digits(date.getMilliseconds())}`;
    }
    return str;
  }

  public static getCompleteDateToMinutes(date: Date): string {
    let str: string = '';
    if (date != null) {
      const month = date.getMonth() + 1;
      str = `${ViesTools.numberTo2digits(date.getDate())}/${ViesTools.numberTo2digits(month)}/${date.getFullYear()} ${ViesTools.numberTo2digits(date.getHours())}:${ViesTools.numberTo2digits(date.getMinutes())}`;
    }
    return str;
  }

  public static getMatchParsedDate(date: Date): string {
    let str: string = '';
    if (date != null) {
      const month = date.getMonth() + 1;
      str = `${ViesTools.numberTo2digits(date.getDate())}/${ViesTools.numberTo2digits(month)} ${ViesTools.numberTo2digits(date.getHours())}:${ViesTools.numberTo2digits(date.getMinutes())}`;
    }
    return str;
  }

  public static getSmartDate(date: Date): string {
    let str: string = '';
    if (date !== null) {
      const month = date.getMonth() + 1;
      str = `${ViesTools.numberTo2digits(date.getDate())}/${ViesTools.numberTo2digits(month)}/${date.getFullYear()} ${ViesTools.numberTo2digits(date.getHours())}:${ViesTools.numberTo2digits(date.getMinutes())}:${ViesTools.numberTo2digits(date.getSeconds())}h`;
    }
    return str;
  }

  public static isDateToday(storedDate: Date): boolean {
    const dateNow = new Date();
    const year = storedDate.getFullYear();
    const month = storedDate.getMonth();
    const day = storedDate.getDate();
    return (dateNow.getFullYear() === year) && (dateNow.getMonth() + 1 === month) && (dateNow.getDate() === day);
  }

}
