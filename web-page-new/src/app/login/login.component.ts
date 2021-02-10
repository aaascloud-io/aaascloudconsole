﻿import { Component, OnInit, Renderer2 ,ViewChild, ElementRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { AlertService } from '../_services/alert.service';
// import { HttpService } from '@service/HttpService';
import { HttpService } from '../_services/HttpService';
import { UserService } from '../_services/UserService';


@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    /** 描画用キャンバス */
    @ViewChild('myCanvas') protected canvas: ElementRef;

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  isPageLoaded = false;
  checkcodeList: string;

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    public authService: AuthService,
    private renderer: Renderer2
  ) {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'];
    });

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      checkcode: ['', Validators.required]
    });
    // Remember Me
    // if (localStorage.getItem('remember')) {
    //   this.renderer.removeClass(document.body, 'bg-full-screen-image');
    //   localStorage.removeItem('currentLayoutStyle');
    //   this.router.navigate(['/dashboard/sales']);
    // } else if (localStorage.getItem('currentUser')) {
    //   // Force logout on login if not remember me
    //   this.authService.doLogout();
    //   this.isPageLoaded = true;
    // } else {
    //   this.isPageLoaded = true;
    // }
    this.isPageLoaded = true;
    this.getCheckCode();

  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  async　tryLogin() {
    this.submitted = true;

    if (this.f.checkcode.value !== this.checkcodeList) {
      this.alertService.error('確認コードが異なります。');
      this.resetCheckCode();
      return;
    }

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    
    const value = {
      email: this.f.email.value,
      password: this.f.password.value
    };

    try {
      ///認証
      await this.httpService.accessToken(
        this.f.email.value,
        this.f.password.value
      );
      ///権限チェック
      await this.userService.authorized().toPromise();
      ///自身の情報取得
      var res = await this.userService.getMyInfo().toPromise();
      ///保存
      this.httpService.processUserInfo(res);
      ///画面遷移
        this.setUserInStorage(res);
        localStorage.removeItem('currentLayoutStyle');
        let returnUrl = '/dashboard';
        if (this.returnUrl) {
          returnUrl = this.returnUrl;
        }
        this.router.navigate([returnUrl]);
      // this.router.navigate(["/main/page/dashboard"]);
    } catch (err) {
      // this.handleError('操作失敗', err);
      this.alertService.error(err.message);
    }
    // //login検証
    // this.authService.doLogin(value).then(
    //   res => {
    //     this.setUserInStorage(res);
    //     localStorage.removeItem('currentLayoutStyle');
    //     // let returnUrl = '/dashboard/sales';
    //     let returnUrl = '/dashboard';
    //     if (this.returnUrl) {
    //       returnUrl = this.returnUrl;
    //     }
    //     this.router.navigate([returnUrl]);
    //   },
    //   err => {
    //     this.submitted = false;
    //     this.alertService.error(err.message);
    //   }
    // );
  }
// addCheckbox(event) {
//   const toggle = document.getElementById('icheckbox');
//   if (event.currentTarget.className === 'icheckbox_square-blue') {
//      this.renderer.addClass(toggle, 'checked');
//   } else if (event.currentTarget.className === 'icheckbox_square-blue checked') {
//     this.renderer.removeClass(toggle, 'checked');
//   }
// }
  setUserInStorage(res) {
    if (res.user) {
      localStorage.setItem('currentUser', JSON.stringify(res.user));
    } else {
      localStorage.setItem('currentUser', JSON.stringify(res));
    }
  }


  //チェックコード
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
      ctx.fillText(this.checkcodeList, canvasEl.width / 2, 105, canvasEl.width);
    }
  }
  private getCheckCode(): void {
    this.checkcodeList = '';
    [1, 2, 3, 4].forEach(abc => {
      this.checkcodeList += Math.floor(Math.random() * 10).toString();
    });
  }

  resetCheckCode() {
    this.checkCodeDraw();
  }
}