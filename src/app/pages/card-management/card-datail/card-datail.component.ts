import { Component, Input, OnInit } from '@angular/core';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { Card, CardService, NumbersCard } from '../../../services/card/card.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-datail',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    CommonModule
  ],
  templateUrl: './card-datail.component.html',
  styleUrl: './card-datail.component.scss'
})
export class CardDatailComponent implements OnInit{

  cardDetails: any;
  numbersMatrix: (number | null)[][] = [];
  isLoading: boolean = true;

  constructor(
    private cardService: CardService,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const codeCard = params.get('codeCard');

      if (codeCard) {
        this.loadCard(codeCard);
        this.loadNumbersCards(codeCard); // Chama a função para popular a matriz
      }
    });
  }

  loadCard(codeCard:string): void {
    if (codeCard) {
      this.isLoading = true;
      
      this.cardService.getCardByCodeCard(codeCard).subscribe({
        next: (response) => {
          this.cardDetails = response;
        },
        error: (err) => {
          console.error('Erro ao carregar detalhes do card.', err);
          this.isLoading = false;
        }
      });
    }
  }

  loadNumbersCards(codeCard:string): void {
    if (codeCard){
      this.isLoading = true;

      this.cardService.getNumbersCardByCodeCard(codeCard).subscribe({
        next: (response: NumbersCard[]) => {
          
          response.forEach(item => {
            this.numbersMatrix[item.row] = this.numbersMatrix[item.row] || [];
            this.numbersMatrix[item.row][item.column] = item.number?.value ?? null;
          });
          
          console.log('Matriz Bingo populada:', this.numbersMatrix);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar números do card.', err);
          this.isLoading = false;
        }
      });
    }
  }

}
