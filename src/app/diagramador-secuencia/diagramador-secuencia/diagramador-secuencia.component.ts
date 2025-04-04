import { Component } from '@angular/core';
import { AsideComponent } from "../../diagramador-classe/aside/aside.component";
import { AsidedComponent } from '../asided/asided.component';


@Component({
  selector: 'app-diagramador-secuencia',
  standalone: true,
  imports: [AsidedComponent, AsideComponent],
  templateUrl: './diagramador-secuencia.component.html',
  styleUrl: './diagramador-secuencia.component.css'
})
export class DiagramadorSecuenciaComponent {

}
