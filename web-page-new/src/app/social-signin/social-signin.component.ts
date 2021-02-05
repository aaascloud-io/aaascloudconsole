import { Component, OnInit } from '@angular/core';
import { AlertService } from '../_services/alert.service';
import { AuthService } from '../_services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../_api/user/user.service';

@Component({
  selector: 'app-social-signin',
  templateUrl: './social-signin.component.html',
  styleUrls: ['./social-signin.component.css']
})
export class SocialSigninComponent implements OnInit {
  private homeURL = '/home';
  private returnUrl: string;
  users = [];
  user = {};
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    public authService: AuthService,
    private userService: UserService
  ) {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'];
    });
  }

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users = users.map(item => {
        return {
          ...item.payload.doc.data() as {},
          id: item.payload.doc.id
        };
      });
    });
  }

  tryGoogleLogin() {
    this.authService.doGoogleLogin().then(
      res => {
        this.setUserInStorage(res);
        if (this.returnUrl) {
          this.homeURL = this.returnUrl;
        }
        this.router.navigate([this.homeURL]);
      },
      err => {
        this.alertService.error(err.message);
      }
    );
  }

  tryFacebookLogin() {
    this.authService.doFacebookLogin().then(
      res => {
        this.setUserInStorage(res);
        if (this.returnUrl) {
          this.homeURL = this.returnUrl;
        }
        this.router.navigate([this.homeURL]);
      },
      err => {
        this.alertService.error(err.message);
      }
    );
  }

  tryTwitterLogin() {
    this.authService.doTwitterLogin().then(
      res => {
        this.setUserInStorage(res);
        if (this.returnUrl) {
          this.homeURL = this.returnUrl;
        }
        this.router.navigate([this.homeURL]);
      },
      err => {
        console.log(err);
        this.alertService.error(err.message);
      }
    );
  }

  tryGithubLogin() {
    this.authService.doGitHubLogin().then(
      res => {
        this.setUserInStorage(res);
        if (this.returnUrl) {
          this.homeURL = this.returnUrl;
        }
        this.router.navigate([this.homeURL]);
      },
      err => {
        console.log(err);
        this.alertService.error(err.message);
      }
    );
  }

  setUserInStorage(res) {
    if (res.user) {
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
      this.user = {
        name: loggedInUser.displayName,
        image: loggedInUser.photoURL,
        uid: loggedInUser.uid
      };
      if (this.users.length === 0) {
        this.userService.createUser(this.user).then(user => {
          console.log(user);
        });
      } else {
        let userExists = false;
        for (let i = 0; i < this.users.length; i++) {
          const userUid = this.users[i].uid;
          if (res.user.uid === userUid) {
            userExists = true;
            break;
          }
        }

        if (!userExists) {
          this.userService.createUser(this.user).then(user => {
            console.log(user);
          });
        }
      }
    } else {
      localStorage.setItem('currentUser', JSON.stringify(res));
    }
  }
}
