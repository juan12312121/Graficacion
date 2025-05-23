import { Component } from '@angular/core';
import { ToolbarComponent } from "../../toolbar/toolbar.component";
import { AsideComponent } from '../aside/aside.component';
import { AtributosComponent } from '../atributos/atributos.component';


@Component({
  selector: 'app-creador-diagramador',
  standalone: true,
  imports: [AsideComponent, AtributosComponent, ToolbarComponent],
  templateUrl: './creador-diagramador.component.html',
  styleUrl: './creador-diagramador.component.css'
})
export class CreadorDiagramadorComponent {

}
