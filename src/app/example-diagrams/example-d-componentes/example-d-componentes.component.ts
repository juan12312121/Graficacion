import { Component } from '@angular/core';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { AsideComponent } from '../../diagramador-componentes/aside/aside.component';
@Component({
  selector: 'app-example-d-componentes',
  standalone: true,
  imports: [ToolbarComponent,AsideComponent],
  templateUrl: './example-d-componentes.component.html',
  styleUrl: './example-d-componentes.component.css'
})
export class ExampleDComponentesComponent {

}
