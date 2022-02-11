import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup
  errMessage = "";
  isLoginFailed = false;
  isLoggedIn = false;

  constructor(private service: UserService,
    private router: Router,
    private tokenStotage: TokenStorageService
  ) { }

  ngOnInit(): void {
    if (this.tokenStotage.getToken()) {
      this.isLoggedIn = true;
    } else {
      this.loginForm = new FormGroup({
        email: new FormControl(),
        password: new FormControl()
      })
    }
  }

  doLogin() {
    let login = {
    email: this.loginForm.value.email,
    password: this.loginForm.value.password
  };
  this.service.login(login)
  .subscribe((res)=>{
    this.tokenStotage.saveToken(res.token);
    this.tokenStotage.saveUser(res.userCredentials);
    this.isLoggedIn = true;
    window.location.reload();
  },
  err => {
    this.errMessage = err.error.msg;
    this.isLoginFailed = true;
    console.log(this.errMessage);
  });
}

}
