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
      // email: ['', Validators.required],
      username: ['', Validators.required],
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
        this.router.navigate(['/login']);
      }, err => {
        console.log(err);
      });
    }
  }

  async tryRegister() {
    this.submitted = true;
    if (this.profileForm.invalid) {
      this.submitted = false;
      return;
    }
    if (this.profileForm.value.newpassword != this.profileForm.value.confirmpassword) {
      alert('New Password Different');
      this.submitted = false;
      return;
    }
    try {
      ///認証
      await this.httpService.accessToken(
        this.f.username.value,
        this.f.password.value
      );
      // ///権限チェック
      // await this.userService.authorized().toPromise();
      ///自身の情報取得
      // var res = await this.userService.getMyInfo().toPromise();

      let item: UserInfo = this.dataFatoryService.getUserInfo();
      if (item != null) {
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
          "username": this.f.username.value,
          "password": this.f.newpassword.value
        }
      }

      var resUser = await this.httpService.useRpPost('/updateProfile', param).then(item => {
        try {
          if (item != null) {
            this.ngOnInit();
            // $("#addinfo").hide();
            // $('.modal-backdrop').remove();
            alert('パスワードを変更しました');
            this.logout();
          }

        } catch (e) {
          console.log('パスワードを変更APIエラー発生しました');
        }
      })

      // this.router.navigate(["/main/page/dashboard"]);
    } catch (err) {
      // this.handleError('操作失敗', err);
      this.alertService.error(err.message);
    }


  }
}
