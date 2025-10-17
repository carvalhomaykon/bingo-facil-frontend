import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface NumberCard{
  project: number
}

export interface Card{
  id: number;
  project: number;
  user: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private apiUrl = 'http://localhost:8080/cards'

  constructor(
    private http: HttpClient
  ) { }

  createCard(amount: number, cardData: NumberCard): Observable<ArrayBuffer>{
    const url = `${this.apiUrl}/${amount}`

    return this.http.post(
      url, cardData,
      {
        responseType: 'arraybuffer'
      }
    );
  }
}
