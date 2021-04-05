import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/_services/HttpService';
import { DataFatoryService } from 'src/app/_services/DataFatoryService';
import { UserInfo } from 'src/app/_common/_Interface/UserInfo';
import { AlertService } from '../../_services/alert.service';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import {MessageService} from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { ConstantsHandler, ServerType } from '../../_common/_constant/constants.handler';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  submitted = false;
  public pageModel = {
    userid: '',
    password: '',
    newpassword: '',
    confirmpassword: '',
    pwdDifferent: false
  }
  constructor(private route: Router,
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private dataFatoryService: DataFatoryService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      newpassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(6)],]
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  logout() {
    if (localStorage.getItem('currentUser')) {
      this.authService.doLogout().then(res => {
        this.router.navigate(['/']);
      }, err => {
        console.log(err);
      });
    }
  }

  async tryRegister() {
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    }
    if (this.profileForm.value.newpassword != this.profileForm.value.confirmpassword) {
      this.showAlert("error", "新規パスワードと新規パスワード（確認用）に同じパスワードを設定してください");
      return;
    }
    try {
      //権限取得
      let item: UserInfo = this.dataFatoryService.getUserInfo();
      if (item != null) {
        ///認証
        await this.httpService.accessToken(
          item.login_id,
          this.f.password.value
        );
        var param = {
          "loginInfo": {
            "loginuserid": item.uid,
            "loginusername": item.login_id,
            "loginrole": item.role,
            "logincompanyid": item.company
          },
          "targetUserInfo": {
            "targetuserid": item.uid,
            "targetuserCompanyid": item.company
          },
          "username": item.login_id,
          "password": this.f.newpassword.value
        }
        var resUser = await this.httpService.useRpPost('/updateProfile', param).then(item => {
          try {
            if (item != null) {
              if (item.resultCode === "0000") {
                var timeout = new Date(new Date().getTime() + ConstantsHandler.GLOBAL_TOKEN.interval);
                this.cookieService.set(ConstantsHandler.SUCCESS_INFO, JSON.stringify("パスワードを変更しました、再ログインしてください。"), timeout);
                this.logout();
              } else {
                this.showAlert("error", "パスワードを変更APIエラー発生しました");
                //pageModel
                this.clearControls();
              }
            }
          } catch (e) {
            this.showAlert("error", "パスワードを変更APIエラー発生しました");
            console.log('パスワードを変更APIエラー発生しました');
            //pageModel
            this.clearControls();
          }
        })

      }
      // this.router.navigate(["/main/page/dashboard"]);
    } catch (err) {
      // this.handleError('操作失敗', err);
      if (err.status === 401) {
        this.showAlert("error", "元のパスワードが間違っています");
        //pageModel
        this.clearControls();
      } else {
        this.showAlert("error", "パスワード変更失敗しました");
        //pageModel
        this.clearControls();
      }
    }

  }

  clearControls() {
    //pageModel
    for (var prop in this.pageModel) {
      if (this.pageModel.hasOwnProperty(prop)) {
        this.pageModel[prop] = '';
      }
    }
  }

  showAlert(alertType, alertDetail) {
    this.showAlertSetlife(alertType, alertDetail,null)
  }


  showAlertSetlife(alertType, alertDetail,plife) {
    var lifeValue=2000;
    if(plife!==null||plife!=='')
    {
      lifeValue=plife
    }
    this.messageService.add({
      key : 'alertModal', 
      severity : alertType, 
      summary : alertType, 
      detail : alertDetail,
      life : lifeValue});
  }
}
