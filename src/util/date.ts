export default class DateUtil {

    public static calcDiff(a: Date, b: Date) {
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
      
        return (utc2 - utc1);
    }

}