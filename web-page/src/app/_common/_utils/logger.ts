export var level = {
  FATAL: 1,
  ERROR: 2,
  WARN: 3,
  INFO: 4,
  TRACE: 5,
  DEBUG: 6,
};

/**
 * ロガー
 * 
 */
export class Logger {

  /** ロギングの閾値 */
  public static thresh = level.DEBUG;

  /** コンストラクタ */
  private constructor() {
  }

  public static debug(clazz: any, message: string, ...params: any[]) {
    if (level.DEBUG <= this.thresh) {
      var record = this.log('DEBUG', clazz, message);
      console.log(record, ...params);
    }
  }

  public static detail(clazz: any, message: string, ...params: any[]) {
    if (level.TRACE <= this.thresh) {
      var record = this.log('TRACE', clazz, message);
      console.log(record, ...params);
    }
  }

  public static info(clazz: any, message: string, ...params: any[]) {
    if (level.INFO <= this.thresh) {
      var record = this.log('INFO', clazz, message);
      console.log(record, ...params);
    }
  }

  public static warn(clazz: any, message: string, ...params: any[]) {
    if (level.WARN <= this.thresh) {
      var record = this.log('WARN', clazz, message);
      console.warn(record, ...params);
    }
  }

  public static error(clazz: any, message: string, ...params: any[]) {
    if (level.ERROR <= this.thresh) {
      var record = this.log('ERROR', clazz, message);
      console.error(record, ...params);
    }
  }

  private static log(level: string, clazz: any, message: string) {
    var now = new Date();
    var yyyy = now.getFullYear();
    var MM = ('0' + now.getMonth() + 1).slice(-2);
    var dd = ('0' + now.getDate()).slice(-2);
    var HH = ('0' + now.getHours()).slice(-2);
    var mm = ('0' + now.getMinutes()).slice(-2);
    var ss = ('0' + now.getSeconds()).slice(-2);
    var SSS = ('00' + now.getMilliseconds()).slice(-3);
    var dateStr = yyyy + '-' + MM + '-' + dd + '.'
      + HH + ':' + mm + ':' + ss + '.' + SSS;
    var levelStr = (level + '      ').slice(0, 5);
    var caller = (clazz.constructor.name + '                ').slice(0, 24);
    var record = dateStr + ' ' + levelStr + ' ' + caller + ' ' + message;
    return record;
  }
}
