import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TemplateCard{
  project: number,
  backgroundImagePath: string,
  layoutConfig: string
}

@Injectable({
  providedIn: 'root'
})
export class TemplateCardService {

  private apiUrl = 'http://localhost:8080/template-card'

  constructor(
    private http: HttpClient
  ) { }

  saveTemplateCard(templateCard: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, templateCard);
  }

  saveBackgroundImagePath(file: File): Observable<any> {
    const formData = new FormData();

    formData.append('file', file)

    return this.http.post<any>(`${this.apiUrl}/upload`, formData);
  }

  getTemplateCard(idProject: number): Observable<TemplateCard> {
    return this.http.get<TemplateCard>(`${this.apiUrl}/project/${idProject}`);
  }

  updateTemplateCard(id: number, templateCard:any): Observable<TemplateCard> {
    return this.http.put<TemplateCard>(`${this.apiUrl}/${id}`, templateCard);
  }

  removeTemplateCard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
