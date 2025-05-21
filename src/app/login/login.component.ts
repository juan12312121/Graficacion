import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Importa RouterModule aquí
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, CommonModule, RouterModule],  // Añade RouterModule a las importaciones
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // No es necesario definir los íconos desde IconService
  email: string = '';
  password: string = '';
  isPasswordVisible: boolean = false;
  staticMail: string='correo@';
  staticPass: string='1234'

  constructor(private router: Router) {}

  ngOnInit(): void {
    // No es necesario inicializar íconos desde IconService
  }

  onSubmit(): void {

    if(this.email===this.staticMail && this.password===this.staticPass){
        this.router.navigate(['/principal']);
    } 
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
