import { Component, OnInit, ViewChild, ElementRef, Injector } from '@angular/core';

import { left_flyIn } from "@common/_animations/left_flyIn";
import { HttpService } from '@service/HttpService';
import { UserService } from '@service/UserService';
import { AbstractComponent } from '@sub/abstract/abstract.component';
import { codes } from "@common/_utils/codes";
import { UserInfo, LoginInfo } from 'src/app/_common/_interface/userInfo';
import { DataFatoryService } from '@service/DataFatoryService';



@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [left_flyIn]
})
export class LoginComponent extends AbstractComponent implements OnInit {

  /** 描画用キャンバス */
  @ViewChild('myCanvas') protected canvas: ElementRef;

  private loginInfo: LoginInfo;

  /** 画面モデル */
  protected pageModel = {
    user: {
      username: '',
      password: '',
      checkcode: ''
    },
    checkcodeList: '',
    result: {
      retcode: '',
      message: ''
    }
  }

  constructor(
    protected injector: Injector,
    private httpService: HttpService,
    private dataFatoryService: DataFatoryService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.getCheckCode();
    if (this.httpService.verify()) {
      this.router.navigate(["/main/page/dashboard"]);
    }
  }

  /**
   * ログイン(画面より)
   * 
   */
  protected async login() {
    ///入力チェック
    var flg = this.checkParameters();
    if (flg) {
      try {
        ///認証
        var res = await this.httpService.accessToken(
          this.pageModel.user.username,
          this.pageModel.user.password
        );
        if (res.resultCode === codes.RETCODE.NORMAL) {
          this.pageModel.result.retcode = res.resultCode;
          this.pageModel.result.message = res.resultMsg;
          ///保存
          this.httpService.processUserInfo(res);
          ///画面遷移
          this.router.navigate(["/main/page/dashboard"]);
        } else {
          this.alert.warning('ユーザー名またはパスワードは間違った。');
          flg = false;
        }
        ///権限チェック
        // var res = await this.userService.authorized().toPromise();
        ///自身の情報取得
        // var res = await this.userService.getMyInfo().toPromise();
      } catch (err) {
        this.handleError('操作失敗', err);
      }
    }
  }

  private checkParameters() {
    var result = true;
    if (!this.pageModel.user.username) {
      this.alert.warning('ユーザー名を入力してください。');
      result = false;
    }
    if (!this.pageModel.user.password) {
      this.alert.warning('パスワードを入力してください。');
      result = false;
    }
    if (this.pageModel.user.checkcode.toString() !== this.pageModel.checkcodeList) {
      this.alert.warning('確認コードが異なります。');
      result = false;
      this.resetCheckCode();
    }
    return result;
  }

  /*
  private getApi(user: any): void {
    var obj = this;
    this.httpService.accessToken(obj.pageModel.user.username, obj.pageModel.user.password).then(function (res) {
      obj.httpService.getUserInfo(function () {
        obj.router.navigate(["/main/page/dashboard"]);
      });
    });
  }
  */

  private getCheckCode(): void {
    this.pageModel.checkcodeList = '';
    [1, 2, 3, 4].forEach(abc => {
      this.pageModel.checkcodeList += Math.floor(Math.random() * 10).toString();
    });
  }

  ngAfterViewInit() {
    this.checkCodeDraw();
  }

  private checkCodeDraw(): void {
    ///チェックコード生成
    this.getCheckCode();
    ///キャンバスに描画
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    var ctx = canvasEl.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      ctx.fillStyle = '#FF0000';
      ctx.font = "80px Arial, meiryo, sans-serif";
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(this.pageModel.checkcodeList, canvasEl.width / 2, 105, canvasEl.width);
    }
  }

  private resetCheckCode(): void {
    this.checkCodeDraw();
  }

  /**
   * 「Enter」もOK
   * 
   * @param event 
   */
  protected keyPress(event: any) {
    if (event.key === 'Enter') {
      this.login();
    }
  }
}
