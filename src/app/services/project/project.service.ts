import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface Project{
  id: number;
  name: string;
  dateAndTime: string;
  status: string;
  amountAwards: number;
  description: string;
  value: number
}

@Injectable({
  providedIn: 'root'
})

export class ProjectService {

  private apiUrl = 'http://localhost:8080/projects'

  private projectCreatedSource = new Subject<Project>();
  projectCreated$ = this.projectCreatedSource.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  updateProject(id: number, projectData: any): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, projectData);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  listarProjetos(): Observable<Project[]>{
    return this.http.get<Project[]>(this.apiUrl);
  }

  notifyProjectCreated(newProject: Project) {
    this.projectCreatedSource.next(newProject);
  }

  createProject(projectData: any): Observable<any> {
    return this.http.post<any> (this.apiUrl, projectData);
  }

}
