import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Project{
  id: number;
  name: string;
  dateAndTime: string;
  status: string
}

@Injectable({
  providedIn: 'root'
})

export class ProjectService {

  private apiUrl = 'http://localhost:8080/projects'

  constructor(
    private http: HttpClient
  ) { }

  listarProjetos(): Observable<Project[]>{
    return this.http.get<Project[]>(this.apiUrl);
  }

}
