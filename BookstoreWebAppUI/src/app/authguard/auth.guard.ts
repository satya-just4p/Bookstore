import { CanActivateFn, Router } from '@angular/router';
import { inject, Inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('Token');

  if(token){
    return true;
  }
  else
  {
    
    router.navigate(['/login']);
    return false;

  }

  //return true;
};
