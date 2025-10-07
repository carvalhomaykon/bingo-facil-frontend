import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { flatMap } from 'rxjs'
@Component({
  selector: 'app-modal-layout',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './modal-layout.component.html',
  styleUrl: './modal-layout.component.scss'
})
export class ModalLayoutComponent {

  @Input() nameModal:string = '';
  @Input() show: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output("submit") onSubmit = new EventEmitter();
  
  closeModal(): void {
    this.close.emit();
  }

  submit(){
    this.onSubmit.emit();
  }

}
