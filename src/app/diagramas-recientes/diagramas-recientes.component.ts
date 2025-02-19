import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-diagramas-recientes',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './diagramas-recientes.component.html',
  styleUrls: ['./diagramas-recientes.component.css']
})
export class DiagramasRecientesComponent {}
