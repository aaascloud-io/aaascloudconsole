export class Device {
  //保存モード
  saveFlg: string;
  //PF基本情報
  pfUrl: string;
  pfProtocol: string;
  pfDownload: string;
  pfUserName: string;
  pfMailAdd: string;
  //通信設定
  communicationProtocol: string;
  communicationData: boolean;
  //センサーノート
  noteUser: string;
  noteType: string;
  noteSsid: string;
  noteNo: string;
  noteDisplayName: string;
  noteUse: string;
  noteModule: string;
  noteIntervalOption: string;
  noteIntervalSecond: string;
  noteIntervalTime: string;

  constructor() {
    //保存モード
    this.saveFlg = '';
    //PF基本情報
    this.pfUrl = '';
    this.pfProtocol = '';
    this.pfDownload = '';
    this.pfUserName = '';
    this.pfMailAdd = '';
    //通信設定
    this.communicationProtocol = '';
    this.communicationData = true;
    //センサーノート
    this.noteUser = '';
    this.noteType = '';
    this.noteSsid = '';
    this.noteNo = '';
    this.noteDisplayName = '';
    this.noteUse = '';
    this.noteModule = '';
    this.noteIntervalOption = '';
    this.noteIntervalSecond = '';
    this.noteIntervalTime = '';
  }
}