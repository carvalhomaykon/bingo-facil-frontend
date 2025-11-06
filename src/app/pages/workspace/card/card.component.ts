import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalLayoutComponent } from '../modal-layout/modal-layout.component';
import { ModalInputComponent } from '../modal-input/modal-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardService } from '../../../services/card/card.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalLayoutComponent,
    ModalInputComponent
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit{

  cardForm!: FormGroup;

  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cardService: CardService,
  ){}

  ngOnInit(): void{
    this.initializeForm();
  }

  initializeForm(): void {
    this.cardForm = this.fb.group({
      codeCard: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.cardForm.valid){
      const formValue = {
        ...this.cardForm.value,
        codeCard: this.cardForm.value.codeCard.trim()
      };

      this.cardService.getCardByCodeCard(formValue.codeCard).subscribe({
        next: (reponse) => {
          this.router.navigate(["/workspace/card", formValue.codeCard]);
        },
        error: (err) => {
          console.error("Erro ao acessar o bingo.", err);
        }
      })

    }
  }

}
