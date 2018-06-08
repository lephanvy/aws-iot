import { Component, OnInit } from '@angular/core';
import { UserLoginService } from '../../../services/login.service';
import { CognitoCallback, LoggedInCallback } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements CognitoCallback , LoggedInCallback ,OnInit {
  errorMessage: string;
  username: string;
  password: string;
  constructor(
    private loginService: UserLoginService,
    private router: Router
  ) { }

  ngOnInit() {
    this.errorMessage = null;
        console.log("Checking if the user is already authenticated. If so, then redirect to the secure site");
        this.loginService.isAuthenticated(this);

  }
  cognitoCallback(message: string, result: any) {
    if (message != null) { //error
        this.errorMessage = message;
        console.log("result: " + this.errorMessage);
        if (this.errorMessage === 'User is not confirmed.') {
            console.log("redirecting");
           
        } else if (this.errorMessage === 'User needs to set password.') {
            console.log("redirecting to set new password");
            this.router.navigate(['/new-password']);
        }
    } else { //success
        // this.ddb.writeLogEntry("login");
        this.router.navigate(['/']);
    }

    
}

isLoggedIn(message: string, isLoggedIn: boolean) {
  if (isLoggedIn) {
      this.router.navigate(['/']);
  }
}
onLogin() {
  console.log('click');
  if (this.username == null || this.password == null) {
      this.errorMessage = "All fields are required";
      console.log('require')
      return;
  }
  this.errorMessage = null;
  this.loginService.authenticate(this.username, this.password, this);
}
}
