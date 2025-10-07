import { Component, EventEmitter, Input, Output } from '@angular/core';
import { flatMap } from 'rxjs';

@Component({
  selector: 'app-modal-layout',
  standalone: true,
  imports: [],
  templateUrl: './modal-layout.component.html',
  styleUrl: './modal-layout.component.scss'
})
export class ModalLayoutComponent {

  @Input() nameModal:string = '';
  @Input() show: boolean = false;

  @Output() close = new EventEmitter<void>();
  
  closeModal(): void {
    this.close.emit();
  }

}
