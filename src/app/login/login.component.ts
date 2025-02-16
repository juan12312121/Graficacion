import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconService } from '../services/icon-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
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

  constructor(private iconService: IconService, private router: Router) {}

  ngOnInit() {
    this.faHome = this.iconService.getIcon('home');
    this.faEnvelope = this.iconService.getIcon('envelope');
    this.faLock = this.iconService.getIcon('lock');
    this.faQuestionCircle = this.iconService.getIcon('questionCircle');
    this.faProjectDiagram = this.iconService.getIcon('projectDiagram');
  }

  onSubmit() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }

  navigateToRegistro() {
    try {
      console.log('Navegando a la página de registro');
      this.router.navigate(['/registro']).then(success => {
        if (success) {
          console.log('Navegación exitosa a /registro');
        } else {
          console.error('Error en la navegación a /registro');
        }
      }).catch(error => {
        console.error('Error en la navegación:', error);
      });
    } catch (error) {
      console.error('Error capturado en navigateToRegistro:', error);
    }
  }
  
}
