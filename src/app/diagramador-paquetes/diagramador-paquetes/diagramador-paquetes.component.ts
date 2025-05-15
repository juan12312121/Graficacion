import { Component } from '@angular/core';
import { ToolbarComponent } from "../../toolbar/toolbar.component";
import { AsideComponent } from '../aside/aside.component';


@Component({
  selector: 'app-diagramador-paquetes',
  standalone: true,
  imports: [AsideComponent, ToolbarComponent],
  templateUrl: './diagramador-paquetes.component.html',
  styleUrl: './diagramador-paquetes.component.css'
})
export class DiagramadorPaquetesComponent {

}
