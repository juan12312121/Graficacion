import { Component } from '@angular/core';
import { ToolbarComponent } from "../../toolbar/toolbar.component";
import { AsideComponent } from '../aside/aside.component';


@Component({
  selector: 'app-diagramador-componentes',
  standalone: true,
  imports: [AsideComponent, ToolbarComponent],
  templateUrl: './diagramador-componentes.component.html',
  styleUrl: './diagramador-componentes.component.css'
})
export class DiagramadorComponentesComponent {

}
