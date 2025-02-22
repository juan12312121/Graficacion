import { Component } from '@angular/core';
import { PaginacionComponent } from '../paginacion/paginacion.component';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-papelera',
  standalone: true,
  imports: [SidebarComponent,PaginacionComponent],
  templateUrl: './papelera.component.html',
  styleUrl: './papelera.component.css'
})
export class PapeleraComponent {

}
