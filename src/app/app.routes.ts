import { Routes } from '@angular/router';
import {RoleEnum} from "./core/models/roleEnum";
import {authGuard} from "./core/guards/auth.guard";
import {loginGuard} from "./core/guards/login.guard";
import {ExitGuard} from "./core/guards/exit.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: "full"
  },
  {
    path: 'login',
    canActivate: [authGuard],
    loadComponent: () => import('./features/login/login.component').then(component => component.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [loginGuard],
    canDeactivate: [ExitGuard],
    data: {role: [RoleEnum.Admin]},
    loadComponent: () => import('./features/admin/admin.component').then(component => component.AdminComponent)
  },
  {
    path: 'worker',
    canActivate: [loginGuard],
    data: {role: [RoleEnum.Worker, RoleEnum.Admin]},
    loadComponent: () => import('./features/worker/worker.component').then(component => component.WorkerComponent)
  },

];
