import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from '@angular/core';

import {map, take} from 'rxjs';
import {LoginService} from "@services/login.service";

export const loginGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  loginService.autologin()

  return loginService.user.pipe(take(1), map(user => {
    const isAuth = !!user;
    if (isAuth) {
      const allowedRoles = route.data['role'] as string[]; // Obtener roles permitidos de la ruta
      if (user?.roles.some(role => allowedRoles.includes(role))) {
        return true;
      } else if (user?.roles.includes('Admin')) {
        return router.createUrlTree(['/admin']);
      } else if (user?.roles.includes('Worker')) {
        return router.createUrlTree(['/worker']);
      }
    }
    return router.createUrlTree(['/login']);
  }));
};
