import { Component, forwardRef, Input, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-input',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ModalInputComponent),
      multi: true
    }
  ],
  templateUrl: './modal-input.component.html',
  styleUrl: './modal-input.component.scss'
})
export class ModalInputComponent {

  @Input() inputName:string = '';
  @Input() label:string = '';
  @Input() type:string = '';
  @Input() placeholder:string = '';

  value: string = ""
  onChange: any = () => {}
  onTouched: any = () => {}

  onInput(event:Event){
    const value = (event.target as HTMLInputElement).value
    this.onChange(value)
  }

  writeValue(value: any): void {
    this.value = value
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {}

}
