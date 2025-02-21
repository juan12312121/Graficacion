import { Component } from '@angular/core';
import { PaginacionComponent } from '../paginacion/paginacion.component';
import { SidebarComponent } from '../sidebar/sidebar.component';



@Component({
  selector: 'app-compartidos',
  standalone: true,
  imports: [SidebarComponent,PaginacionComponent],
  templateUrl: './compartidos.component.html',
  styleUrl: './compartidos.component.css'
})
export class CompartidosComponent {

}
