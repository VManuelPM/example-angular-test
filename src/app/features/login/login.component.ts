import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../core/services/login.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginFormGroup !: FormGroup;

  constructor(private readonly loginService: LoginService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
        this.loginFormGroup = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
        })
  }

  login(): void {
    this.loginService.login(this.loginFormGroup.value).subscribe({
      next: res => {
        this.loginService.saveToken(res)
      },
      error: err => {
        console.error(err)
        alert('Error verificando el usuario')

      },
      complete: () => {
        console.log('complete');
      }
    })
  }



}
