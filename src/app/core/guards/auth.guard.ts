import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {map, take} from 'rxjs';
import {LoginService} from "@services/login.service";
import {RoleEnum} from "@models/roleEnum";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);

  return loginService.user.pipe(take(1), map(user => {
    const isAuth = !!user;
    if (isAuth) {
      const allowedRoles = route.data['role'] as string[]; // Obtener roles permitidos de la ruta

      // @ts-ignore
      if (user?.roles.includes(RoleEnum.Admin)) {
        localStorage.setItem('role', RoleEnum.Admin);
        return false;
      } else { // @ts-ignore
        if (user?.roles.includes(RoleEnum.Worker)) {
                localStorage.setItem('role', RoleEnum.Worker);
                return false;
              }
      }
    }
    return true;
  }));
};
