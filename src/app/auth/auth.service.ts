import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiEndpoint;
  private username;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private spinner: NgxSpinnerService) {}

  public isAuthenticated(): boolean {
    let token = this.getToken();
    if (token) {
      this.username = this.jwtHelper.decodeToken(token).username;
    }
    return token && !this.jwtHelper.isTokenExpired(token);
  }

  public signUp(username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.spinner.show();
      return this.http.post<string>(`${this.baseUrl}/auth/signup`, { username, password }).subscribe(
        () => {
          this.spinner.hide();
          resolve(true);
        },
        (error) => {
          this.spinner.hide();
          reject(error);
        }
      );
    });
  }

  public signIn(username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.spinner.show();
      return this.http.post<string>(`${this.baseUrl}/auth/signin`, { username, password }).subscribe(
        (token: any) => {
          this.username = this.jwtHelper.decodeToken(token.accessToken).username;
          this.saveToken(token);
          this.spinner.hide();
          resolve(true);
        },
        (error) => {
          this.spinner.hide();
          reject(error);
        }
      );
    });
  }

  public signOut(): Promise<any> {
    return new Promise(async (resolve) => {
      await this.removeToken();
      resolve(true);
    });
  }

  public saveToken(token: any) {
    localStorage.setItem('point_jwt_token', token.accessToken);
  }

  public getToken(): string {
    let token = localStorage.getItem('point_jwt_token');
    return token;
  }

  public removeToken() {
    localStorage.removeItem('point_jwt_token');
  }

  get userData() {
    return this.username;
  }
}
