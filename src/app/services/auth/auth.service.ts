import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User{
  id?: number;
  name: string;
  email: string;
  password: string;
  telephone: string;
  firstName: string;
  lastName: string;
  address: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) { }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  login(email: string, password: string): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/login`, {email, password});
  }
  
}
