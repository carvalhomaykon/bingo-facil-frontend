import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Award{
  id: number;
  name: string;
  styleAward: string;
}

@Injectable({
  providedIn: 'root'
})
export class AwardService {

  private apiUrl = 'http://localhost:8080/awards'

  constructor(
    private http: HttpClient
  ) { }

  createAward(awardData: any): Observable<any> {
    return this.http.post<any> (this.apiUrl, awardData);
  }

  getAwardsByIdProject(idProject: number): Observable<Award[]> {
    return this.http.get<Award[]>(`${this.apiUrl}/project/${idProject}`);
  }
}
