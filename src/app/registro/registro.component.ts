import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  // Propiedades del formulario
  nombre: string = '';
  apellido: string = ''; // <- Nuevo campo para concatenar
  correo: string = '';
  contrasena: string = '';
  confirmContrasena: string = '';

  // Visibilidad de contraseñas
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  // Enviar el formulario
  onSubmit(): void {
    if (!this.nombre || !this.apellido || !this.correo || !this.contrasena || !this.confirmContrasena) {
      alert('Todos los campos son obligatorios');
      return;
    }

    if (this.contrasena !== this.confirmContrasena) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const datosRegistro = {
      nombre: `${this.nombre} ${this.apellido}`.trim(), // ← Concatenación
      email: this.correo,
      password: this.contrasena
    };

    this.http.post(`${environment.apiUrl}/auth/register`, datosRegistro).subscribe({
      next: () => {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en registro:', err);
        alert(err.error?.mensaje || 'Ocurrió un error en el registro');
      }
    });
  }

  // Alternar visibilidad de contraseñas
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  navigateLogin(): void {
    this.router.navigate(['/login']);
  }
}
