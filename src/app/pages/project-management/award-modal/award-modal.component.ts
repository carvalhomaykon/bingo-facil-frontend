import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalLayoutComponent } from '../../workspace/modal-layout/modal-layout.component';
import { ModalInputComponent } from '../../workspace/modal-input/modal-input.component';

@Component({
  selector: 'app-award-modal',
  standalone: true,
  imports: [
    ModalLayoutComponent
  ],
  templateUrl: './award-modal.component.html',
  styleUrl: './award-modal.component.scss'
})
export class AwardModalComponent {

  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  onSubmit() {}

}
