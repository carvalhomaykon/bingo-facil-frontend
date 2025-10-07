import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { __values } from 'tslib';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post<any> (`${this.apiUrl}/login`, credentials).pipe(
      tap ((response) => {
        if (response && response.token){
          this.storeToken(response.token);
        }
      })
    );
  }

  public isAuthenticated(): boolean{
    return this.getToken() !== null;
  }

  private storeToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  public getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public logout(): void {
    localStorage.removeItem('authToken');
  }

  signup(useData: any): Observable<any> {
    return this.http.post<any> (this.apiUrl, useData);
  }
  
}
