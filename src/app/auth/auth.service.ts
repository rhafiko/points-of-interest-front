import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from 'src/environments/environment';
import { Observable, throwError, BehaviorSubject, Observer } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiEndpoint;
  private username;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  public isAuthenticated(): boolean {
    let token = this.getToken();
    if (token) {
      this.username = this.jwtHelper.decodeToken(token).username;
    }
    return token && !this.jwtHelper.isTokenExpired(token);
  }

  public signUp(username: string, password: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/auth/signup`, { username, password }).pipe(
      tap((ret) => {
        console.log('signup', ret);
      }),
      catchError((error) => throwError(error))
    );
  }

  public signIn(username: string, password: string): Observable<any> {
    return this.http.post<string>(`${this.baseUrl}/auth/signin`, { username, password }).pipe(
      tap((token: any) => {
        console.log('signin', token.accessToken);
        this.username = this.jwtHelper.decodeToken(token.accessToken).username;
        this.saveToken(token);
      }),
      catchError((error) => throwError(error))
    );
  }

  public signOut(): Promise<any> {
    return new Promise(async (resolve) => {
      await this.removeToken();
      resolve(true);
    });
  }

  public saveToken(token: any) {
    console.log('saveToken', token.accessToken);
    localStorage.setItem('point_jwt_token', token.accessToken);
  }

  public getToken(): string {
    let token = localStorage.getItem('point_jwt_token');
    console.log('get token', token);
    return token;
  }

  public removeToken() {
    localStorage.removeItem('point_jwt_token');
  }

  get userData() {
    return this.username;
  }
}
