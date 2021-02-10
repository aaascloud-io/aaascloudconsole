export class DateUtils {

  /**
   * Dateを文字列に変換する
   * 
   * @param date 
   * @param format
   */
  public static format1(date: Date, format: string): string {
    var result = '';
    if (date) {
      result = format;
      var yyyy = String(date.getFullYear());
      var MM = ('0' + (date.getMonth() + 1)).slice(-2);
      var dd = ('0' + date.getDate()).slice(-2);
      var HH = ('0' + date.getHours()).slice(-2);
      var mm = ('0' + date.getMinutes()).slice(-2);
      var ss = ('0' + date.getSeconds()).slice(-2);
      var SSS = ('00' + date.getMilliseconds()).slice(-3);

      result = result.replace(/yyyy/, yyyy);
      result = result.replace(/MM/, MM);
      result = result.replace(/dd/, dd);
      result = result.replace(/HH/, HH);
      result = result.replace(/mm/, mm);
      result = result.replace(/ss/, ss);
      result = result.replace(/SSS/, SSS);
    }
    return result;
  };

  /**
   * format1の日付(yyyyMMddHHmmssSSS)版
   * 
   * @param date 
   * @param format
   */
  public static format2(date: string, format: string): string {
    var result = '';
    if (date) {
      result = format;
      var yyyy = (4 <= date.length) ? date.substr(0, 4) : '';
      var MM = (6 <= date.length) ? date.substr(4, 2) : '';
      var dd = (8 <= date.length) ? date.substr(6, 2) : '';
      var HH = (10 <= date.length) ? date.substr(8, 2) : '';
      var mm = (12 <= date.length) ? date.substr(10, 2) : '';
      var ss = (14 <= date.length) ? date.substr(12, 2) : '';
      var SSS = (17 <= date.length) ? date.substr(14, 3) : '';
      result = result.replace(/yyyy/, yyyy);
      result = result.replace(/MM/, MM);
      result = result.replace(/dd/, dd);
      result = result.replace(/HH/, HH);
      result = result.replace(/mm/, mm);
      result = result.replace(/ss/, ss);
      result = result.replace(/SSS/, SSS);
    }
    return result;
  };
}
