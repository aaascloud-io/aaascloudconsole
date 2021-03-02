import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { AlertService } from '../_services/alert.service';
import { UserService } from '../_api/user/user.service';
import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase/app';
import { HttpService } from '../_services/HttpService';


@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  user = {};
  users = [];
  defaultImage = '../assets/images/portrait/small/default.png';
  public pageModel={
    userid:'',
    password:'',
    newpassword:'',
    confirmpassword:'',
    pwdDifferent:true
  }
  constructor(
    private httpService: HttpService,

    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private authService: AuthService,
    private userService: UserService) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      // email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      newpassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.pageModel.pwdDifferent=false;

    this.userService.getUsers().subscribe(users => {
      this.users = users.map(item => {
        return {
          ...item.payload.doc.data() as {},
          id: item.payload.doc.id
        };
      });
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  async tryRegister() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    if(this.registerForm.value.newpassword!=this.registerForm.value.confirmpassword){
      this.pageModel.pwdDifferent=true;
      return;
    }
    this.loading = true;
    try {
      ///認証
      await this.httpService.accessToken(
        this.f.email.value,
        this.f.password.value
      );
      // ///権限チェック
      // await this.userService.authorized().toPromise();
      ///自身の情報取得
      // var res = await this.userService.getMyInfo().toPromise();

      var param ={ 
        "username":　this.f.email.value ,
        "password":　this.f.newpassword.value
      };
      var resUser = await this.httpService.usePost('/updateProfile', param).then(item => {
        try {
          if (item != null) {


          }

        } catch (e) {
          console.log('ユーザーを検索API エラー　発生しました。');
        }
      })

      // this.router.navigate(["/main/page/dashboard"]);
    } catch (err) {
      // this.handleError('操作失敗', err);
      this.alertService.error(err.message);
    }


  }
}
