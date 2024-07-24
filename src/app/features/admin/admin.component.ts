import { Component } from '@angular/core';
import {CanComponentDeactivate, ExitGuard} from "../../core/guards/exit.guard";
import {Observable} from 'rxjs';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements ExitGuard {

    hasUnsavedChanges = true

    canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
      if(this.hasUnsavedChanges){
        return confirm("Quieres salir sin guardar los cambios?")
      }

      return true
    }

}
