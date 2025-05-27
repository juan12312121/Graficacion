import { Component } from '@angular/core';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { AsideComponent } from '../../diagramador-paquetes/aside/aside.component';
@Component({
  selector: 'app-example-d-paquetes',
  standalone: true,
  imports: [ToolbarComponent,AsideComponent],
  templateUrl: './example-d-paquetes.component.html',
  styleUrl: './example-d-paquetes.component.css'
})
export class ExampleDPaquetesComponent {

}
