import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { ModalLayoutComponent } from '../../workspace/modal-layout/modal-layout.component';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [
    ModalLayoutComponent
  ],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.scss'
})
export class ProjectModalComponent {

  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  
  onSubmit() {}

}
