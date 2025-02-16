import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {


    constructor(private router: Router) {}
  
  navigateLogin() {
    try {
      console.log('Navegando a la página de registro');
      this.router.navigate(['/login']).then(success => {
        if (success) {
          console.log('Navegación exitosa a /login');
        } else {
          console.error('Error en la navegación a /login');
        }
      }).catch(error => {
        console.error('Error en la navegación:', error);
      });
    } catch (error) {
      console.error('Error capturado en navigateToRegistro:', error);
    }
  }


}
