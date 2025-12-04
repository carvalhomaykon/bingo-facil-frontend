import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { PrimaryInputComponent } from '../primary-input/primary-input.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    AuthLayoutComponent,
    PrimaryInputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm !: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ){}

  ngOnInit(): void{
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  onSubmit(){
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (reponse) => {
        this.notificationService.show('Login realizado com sucesso! Redirecionando...', 'success');
          setTimeout(() => {
            this.router.navigate(["/workspace"])
          }, 1000);
      },
      error: (httpError: HttpErrorResponse) => {
        const errorMessage ='Erro ao realizar login. Tente novamente.';
        this.notificationService.show(errorMessage, 'error');
      }
    });
    
  }

}
