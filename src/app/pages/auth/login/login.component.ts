import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { PrimaryInputComponent } from '../primary-input/primary-input.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';

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
    private fb: FormBuilder
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
        console.log("Lógin realizado com sucesso!");
        this.router.navigate(["/workspace"]);
      },
      error: (err) => {
        console.log("Erro no login: ", err);
      }
    });
    
  }

}
