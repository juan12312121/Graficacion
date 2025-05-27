import { Component } from '@angular/core';
import { AsidedComponent } from '../../diagramador-secuencia/asided/asided.component';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
@Component({
  selector: 'app-example-d-secuencia',
  standalone: true,
  imports: [AsidedComponent,ToolbarComponent],
  templateUrl: './example-d-secuencia.component.html',
  styleUrl: './example-d-secuencia.component.css'
})
export class ExampleDSecuenciaComponent {

}
