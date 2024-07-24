import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {LoginService} from "@services/login.service";
import {provideRouter, RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {of, throwError} from "rxjs";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: LoginService
  let loginSpy: jasmine.Spy
  let saveTokenSpy: jasmine.Spy
  let alertSpy: jasmine.Spy
  const mock = {
    username: "admin",
    roles: ["Admin"],
    accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIkFkbWluIl0sImlzcyI6InNwcmluZ0Jvb3RBcHAiLCJleHAiOjE3MjE3NzMxOTl9.dZngN70an9YAxFC24ov3XVxAs5k2o_pSPAZukZvCDmM",
    refreshToken: "some-refresh-token",
    _expiration: "2024-07-23T22:19:59.000Z"
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterModule.forRoot([]), ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        LoginService,
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginService = TestBed.inject(LoginService)
    loginSpy = spyOn(loginService, 'login').and.returnValue(of(mock))
    saveTokenSpy = spyOn(loginService, 'saveToken');
    alertSpy = spyOn(window, 'alert');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login Sevice when login is called', () => {
    const user = {username: 'admin', password: '123456'}
    component.loginFormGroup.setValue(user)
    component.login()
    expect(loginSpy).toHaveBeenCalledWith(user)
    expect(saveTokenSpy).toHaveBeenCalledWith(mock)
  });

  it('should display error message when user is incorrect', () => {
    loginSpy.and.returnValue(throwError(() => new Error('error')))
    component.loginFormGroup.setValue({username: 'wrong', password: 'wrong'});
    component.login()
    expect(alertSpy).toHaveBeenCalledWith('Error verificando el usuario')
  });


});
