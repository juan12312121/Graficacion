import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  isPasswordVisible: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    const datosLogin = {
      email: this.email,
      password: this.password
    };

    this.http.post(`${environment.apiUrl}/auth/login`, datosLogin).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this.router.navigate(['/principal']);
      },
      error: (err) => {
        console.error('Error en login', err);
        alert('Credenciales incorrectas o error en el servidor');
      }
    });
  }

  navigateToRegistro(): void {
    this.router.navigate(['/registro']).catch((error: any) => {
      console.error('Error en la navegación a /registro', error);
    });
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']).catch((error: any) => {
      console.error('Error en la navegación:', error);
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
