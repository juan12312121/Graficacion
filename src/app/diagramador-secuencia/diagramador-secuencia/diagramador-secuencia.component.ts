import { Component } from '@angular/core';
import { ToolbarComponent } from "../../toolbar/toolbar.component";
import { AsidedComponent } from '../asided/asided.component';


@Component({
  selector: 'app-diagramador-secuencia',
  standalone: true,
  imports: [AsidedComponent, ToolbarComponent],
  templateUrl: './diagramador-secuencia.component.html',
  styleUrl: './diagramador-secuencia.component.css'
})
export class DiagramadorSecuenciaComponent {

}
