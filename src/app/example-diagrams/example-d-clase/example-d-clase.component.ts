import { Component } from '@angular/core';
import { ToolbarComponent } from "../../toolbar/toolbar.component";
import { AsideComponent } from '../../diagramador-classe/aside/aside.component';

@Component({
  selector: 'app-example-d-clase',
  standalone: true,
  imports: [AsideComponent,ToolbarComponent],
  templateUrl: './example-d-clase.component.html',
  styleUrl: './example-d-clase.component.css'
})
export class ExampleDClaseComponent {

}
