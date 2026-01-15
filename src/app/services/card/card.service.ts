import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { isSubscription } from 'rxjs/internal/Subscription';

export interface NumberCard{
  project: number
}

export interface Card{
  id: number;
  project: {
    name: string,
    dateAndTime: string,
    status: string
  };
  user: number;
  status: string;
  codeCard: string;
}

export interface NumbersCard{
  number: {
    value: number;
  };
  row: number;
  column: number;
}

export interface GridConfig{
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number
}

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private apiUrl = 'http://localhost:8080/cards'

  constructor(
    private http: HttpClient
  ) { }

  createCard(amount: number, cardData: NumberCard, type: string): Observable<ArrayBuffer> {
    const url = `${this.apiUrl}/${amount}/${type}`;

    return this.http.post(url, cardData, { responseType: 'arraybuffer' }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ArrayBuffer) {
          const errorText = new TextDecoder('utf-8').decode(error.error);
          
          try {
            const errorObject = JSON.parse(errorText);
            return throwError(() => errorObject);

          } catch (e) {
            return throwError(() => new Error(errorText));
          }
        }
        return throwError(() => error);
      })
    );
  }

  getNumbersCardByCodeCard(codeCard:string): Observable<NumbersCard[]>{
    return this.http.get<NumbersCard[]>(`${this.apiUrl}/${codeCard}/numbers-card`);
  }

  getCardByCodeCard(codeCard: string): Observable<Card>{
    return this.http.get<Card>(`${this.apiUrl}/code-card/${codeCard}`);
  }

  getAllCards(): Observable<Card[]>{
    return this.http.get<Card[]>(`${this.apiUrl}`);
  }

}
