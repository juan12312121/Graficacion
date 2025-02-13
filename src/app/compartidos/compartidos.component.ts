import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-compartidos',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './compartidos.component.html',
  styleUrl: './compartidos.component.css'
})
export class CompartidosComponent {

}
