import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastComponent } from '../../toast/toast.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    ToastComponent,
    RouterModule,
    CommonModule
  ],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})

export class AuthLayoutComponent {
  @Input() title: string = "";
  @Input() primaryBtnText: string = "";
  @Input() secundaryBtnText: string = "";
  @Input() secundaryBtnLink: string = "";
  @Input() mensagemDeErro: string = "";

  @Output("submit") onSubmit = new EventEmitter();

  submit(){
    this.onSubmit.emit();
  }
}
