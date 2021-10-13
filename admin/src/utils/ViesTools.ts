
export class ViesTools {

    public static numberTo2digits(x: number): string {
        return ('0' + x).slice(-2);
    }

    public static numberTo3digits(x: number): string {
        return ('00' + x).slice(-3);
    }

    public static numberTo4digits(x: number): string {
        return ('000' + x).slice(-4);
    }

    public static numberTo5digits(x: number): string {
        return ('0000' + x).slice(-5);
    }
}
