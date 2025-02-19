import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DiagramasRecientesComponent } from '../diagramas-recientes/diagramas-recientes.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [SidebarComponent, CommonModule, DiagramasRecientesComponent],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {
}
