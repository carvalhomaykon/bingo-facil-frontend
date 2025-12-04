import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { PrimaryInputComponent } from '../primary-input/primary-input.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    AuthLayoutComponent,
    PrimaryInputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{

  signupForm!: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ){
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmed: ['', [Validators.required]]
    }, {
      validator: this.passwordsMatchValidator('password', 'passwordConfirmed')
    });
  }

  passwordsMatchValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  onSubmit() {
    if (this.signupForm.valid){
      this.auth.signup(this.signupForm.value).subscribe({
        next: (response) => {
          this.notificationService.show('Cadastro realizado com sucesso! Redirecionando...', 'success');
          setTimeout(() => {
            this.router.navigate(["/login"])
          }, 1000);
        },
        error: (httpError: HttpErrorResponse) => {
          const errorMessage = httpError.error?.mensagem || 'Erro desconhecido. Tente novamente.';
          
          this.notificationService.show(errorMessage, 'error');
        }
      });
    } else{
      this.signupForm.markAllAsTouched();
    }
  }

}
