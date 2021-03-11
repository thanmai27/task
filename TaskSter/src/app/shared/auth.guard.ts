import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private router:Router)
  {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (sessionStorage.getItem('loggedUserinfo')||sessionStorage.getItem('buttonValue')) {
        // logged in so return true
        return true;
    }

    else
    {
      // not logged in so redirect to login page with the return url and return false
      this.router.navigateByUrl('/');
    }
    

}
 
  // canActivate()
  // {
  //   if(this.authService.isUser )
  //   {
  //     return true;

  //   }
  // }

}
