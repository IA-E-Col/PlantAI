import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {LoginService} from "../services/login.service";

export const authenticationGuard : CanActivateFn = () => {

  const router = inject(Router);
  if (!localStorage.getItem('token')) {
    router.navigate(['login']);
    return false;
  }
  return true;
};

