import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // Mantén esta importación si es necesaria
import { BtnCrearDiagramaComponent } from '../btn-crear-diagrama/btn-crear-diagrama.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule, BtnCrearDiagramaComponent], // Sin cambios en los imports
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SidebarComponent {
  // El constructor ya no necesita la inyección de IconService
  constructor(private router: Router) {}
}
