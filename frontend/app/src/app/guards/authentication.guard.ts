import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {LoginService} from "../services/login.service";

export const authenticationGuard : CanActivateFn = (route, state) => {

  const auth = inject(LoginService);
  const router = inject(Router);

      if(!auth.isauthenticated()) {
        return true
      }
      else
        return true;

};



