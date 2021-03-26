import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/_services/HttpService';
import { DataFatoryService } from 'src/app/_services/DataFatoryService';
import { UserInfo } from 'src/app/_common/_Interface/UserInfo';
import { AlertService } from '../../_services/alert.service';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';

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
      alert('新規パスワードと新規パスワード（確認用）に同じパスワードを設定してください');
      // this.alertService.error('新規パスワードと新規パスワード（確認用）に同じパスワードを設定してください');
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
                this.ngOnInit();
                // $("#addinfo").hide();
                // $('.modal-backdrop').remove();
                alert('パスワードを変更しました、再ログインしてください');
                this.logout();
              } else {
                alert('パスワードを変更APIエラー発生しました');
                //pageModel
                this.clearControls();
              }
            }
          } catch (e) {
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
        // this.alertService.error("パスワードが間違っています");
        alert('パスワードが間違っています');
        //pageModel
        this.clearControls();
      } else {
        // this.alertService.error("パスワード変更失敗しました");
        alert('パスワード変更失敗しました');
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
}
