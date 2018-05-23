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
  email: string;
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
    // if (message != null) { //error
    //     this.errorMessage = message;
    //     console.log("result: " + this.errorMessage);
    //     if (this.errorMessage === 'User is not confirmed.') {
    //         console.log("redirecting");
    //         this.router.navigate(['/home/confirmRegistration', this.email]);
    //     } else if (this.errorMessage === 'User needs to set password.') {
    //         console.log("redirecting to set new password");
    //         this.router.navigate(['/home/newPassword']);
    //     }
    // } else { //success
    //     // this.ddb.writeLogEntry("login");
    //     this.router.navigate(['/securehome']);
    // }

    
}

isLoggedIn(message: string, isLoggedIn: boolean) {
  if (isLoggedIn) {
      this.router.navigate(['/home']);
  }
}
onLogin() {
  if (this.email == null || this.password == null) {
      this.errorMessage = "All fields are required";
      return;
  }
  this.errorMessage = null;
  this.loginService.authenticate(this.email, this.password, this);
}
}
