import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { PrimaryInputComponent } from '../primary-input/primary-input.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    AuthLayoutComponent,
    PrimaryInputComponent
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  constructor(
    private router: Router
  ){}

  submit(){
    this.router.navigate(["/login"])
  }

}
