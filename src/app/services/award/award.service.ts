import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Award{
  id: number;
  name: string;
  styleAward: string;
  project: number;
}

@Injectable({
  providedIn: 'root'
})
export class AwardService {

  private apiUrl = 'http://localhost:8080/awards'

  constructor(
    private http: HttpClient
  ) { }

  saveAwards(award: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, award);
  }

  updateAward(id: number, awardData: any): Observable<Award> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, awardData);
  }

  removeAward(id:number): Observable<void> {
    return this.http.delete<any> (`${this.apiUrl}/${id}`);
  }

  getAwardsByIdProject(idProject: number): Observable<Award[]> {
    return this.http.get<Award[]>(`${this.apiUrl}/project/${idProject}`);
  }
}
