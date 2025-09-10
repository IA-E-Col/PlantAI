import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {LoginService} from "../services/login.service";

export const authenticationGuard : CanActivateFn = () => {

  const router = inject(Router);
  
  // Check if token exists
  const token = localStorage.getItem('token');
  if (!token) {
    router.navigate(['login']);
    return false;
  }
  
  // Check if user data exists and is valid
  const userString = localStorage.getItem('authUser');
  if (!userString) {
    // Clear invalid session
    localStorage.removeItem('token');
    router.navigate(['login']);
    return false;
  }
  
  try {
    const user = JSON.parse(userString);
    if (!user.id || !user.email) {
      // Clear invalid user data
      localStorage.removeItem('token');
      localStorage.removeItem('authUser');
      router.navigate(['login']);
      return false;
    }
  } catch (error) {
    // Clear corrupted user data
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    router.navigate(['login']);
    return false;
  }
  
  return true;
};

