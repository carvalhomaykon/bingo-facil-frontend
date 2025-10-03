import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-primary-input',
  standalone: true,
  imports: [],
  templateUrl: './primary-input.component.html',
  styleUrl: './primary-input.component.scss'
})
export class PrimaryInputComponent {

  @Input() label: string = "";
  @Input() type: string = "";
  @Input() placeholder: string = "";
  @Input() inputName: string = "";

}
