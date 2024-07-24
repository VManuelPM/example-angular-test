import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {LoginRequest, LoginResponse} from "../models/login";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {JwtHelperService} from "@auth0/angular-jwt";
import {LoggedUser} from "../models/logged-user";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public user = new BehaviorSubject<LoggedUser | null>(null);
  public tokenExpirationTime: any;
  private jwtHelperService: JwtHelperService = new JwtHelperService();
  private readonly URL_LOGIN: string = `${environment.URL_BASE}/login`

  constructor(private readonly http: HttpClient, private router: Router ) { }

  public login(user: LoginRequest): Observable<LoginResponse> {
    const formData: FormData = new FormData();
    formData.append('username', user.username);
    formData.append('password', user.password);
    return this.http.post<LoginResponse>(this.URL_LOGIN, formData)
  }

  public saveToken(jwtTokens: LoginResponse): void {
    const decodedAccessToken = this.jwtHelperService.decodeToken(jwtTokens.accessToken);
    const loggedUser = new LoggedUser(decodedAccessToken.sub,
      decodedAccessToken.roles,
      jwtTokens.accessToken,
      this.getExpirationDate(decodedAccessToken.exp)
    );
    this.user.next(loggedUser);
    this.autoLogout(this.getExpirationDate(decodedAccessToken.exp).valueOf() - new Date().valueOf());
    localStorage.setItem('userData', JSON.stringify(loggedUser));
    this.redirectLoggedInUser(decodedAccessToken, jwtTokens.accessToken);
}


  public getExpirationDate(exp: number): Date {
    const date = new Date(0);
    date.setUTCSeconds(exp);
    return date;
  }

  public autologin() {
    const userData: {
      username: string,
      roles: string[],
      _token: string,
      _expiration: Date,
    } = JSON.parse(localStorage.getItem('userData')!);
    if (!userData) return;
    const loadedUser = new LoggedUser(userData.username, userData.roles, userData._token, new Date(userData._expiration));
    if (loadedUser.token) {
      this.user.next(loadedUser);
      this.autoLogout(loadedUser._expiration.valueOf() - new Date().valueOf());
    }
  }

  public autoLogout(expirationDuration: number): void {
    this.tokenExpirationTime = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  public logout() {
    localStorage.clear();
    this.user.next(null);
    this.router.navigateByUrl('/login');
    if (this.tokenExpirationTime) {
      clearTimeout(this.tokenExpirationTime);
    }
    this.tokenExpirationTime = null;
  }

  public redirectLoggedInUser(decodedToken: any, accessToken: string) {
    if (decodedToken.roles.includes('Admin')) {
      this.router.navigateByUrl('/home');
    } else if (decodedToken.roles.includes('Worker')) {
      this.router.navigateByUrl('/stock');
    }
  }

}
