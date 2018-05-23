import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthGuardService implements CanActivate{

  constructor(
    private router: Router,
  ) { }
  canActivate(){
    const hasAuth = tokenNotExpired();

    if (hasAuth) {
      return hasAuth;
    }

    this.router.navigate(['/login']);
    return hasAuth;
  }
}
