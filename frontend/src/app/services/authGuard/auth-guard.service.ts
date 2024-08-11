import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard {

  canActivate(): boolean {
    if (this.isValid()) {
      console.log(this.isValid())
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  isValid() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  constructor(private router: Router, private jwtHelper: JwtHelperService) {}
}

