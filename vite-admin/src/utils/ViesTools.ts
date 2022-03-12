
export class ViesTools {

    public static numberTo2digits(x: number): string {
        return ('0' + x).slice(-2);
    }

    public static numberTo5digits(x: number): string {
        return ('0000' + x).slice(-5);
    }
}
