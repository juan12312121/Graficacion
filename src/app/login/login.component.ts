import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Importa RouterModule aquí
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconService } from '../services/icon-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, CommonModule, RouterModule],  // Añade RouterModule a las importaciones
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  faHome: any;
  faEnvelope: any;
  faLock: any;
  faQuestionCircle: any;
  faProjectDiagram: any;

  email: string = '';
  password: string = '';
  isPasswordVisible: boolean = false;

  constructor(private iconService: IconService, private router: Router) {}

  ngOnInit(): void {
    this.faHome = this.iconService.getIcon('home');
    this.faEnvelope = this.iconService.getIcon('envelope');
    this.faLock = this.iconService.getIcon('lock');
    this.faQuestionCircle = this.iconService.getIcon('questionCircle');
    this.faProjectDiagram = this.iconService.getIcon('projectDiagram');
  }

  onSubmit(): void {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
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
