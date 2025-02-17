import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [],  // Asegúrate de que si usas formularios o módulos adicionales estén importados aquí
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  // Propiedades del formulario
  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  contrasena: string = '';
  confirmContrasena: string = '';

  // Propiedades para manejar la visibilidad de las contraseñas
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  constructor(private router: Router) {}

  // Método de navegación a login
  navigateLogin(): void {
    try {
      console.log('Navegando a la página de login');
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
      console.error('Error capturado en navigateLogin:', error);
    }
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    if (this.contrasena === this.confirmContrasena) {
      console.log('Formulario de registro enviado con éxito');
      // Aquí puedes realizar la lógica para enviar los datos del formulario
    } else {
      console.error('Las contraseñas no coinciden');
    }
  }

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  // Método para alternar la visibilidad de la confirmación de la contraseña
  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }
}
