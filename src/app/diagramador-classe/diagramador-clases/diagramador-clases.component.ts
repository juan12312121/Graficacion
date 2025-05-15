import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToolbarComponent } from "../../toolbar/toolbar.component";
import { AsideComponent } from '../aside/aside.component';

@Component({
  selector: 'app-diagramador-clases',
  standalone: true,
  imports: [CommonModule, AsideComponent, ToolbarComponent], // Agregamos el componente aside y CommonModule
  templateUrl: './diagramador-clases.component.html',
  styleUrls: ['./diagramador-clases.component.css'] // Corrección en "styleUrls"
})
export class DiagramadorClasesComponent {}
