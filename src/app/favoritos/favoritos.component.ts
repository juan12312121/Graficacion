import { Component } from '@angular/core';
import { PaginacionComponent } from '../paginacion/paginacion.component';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [SidebarComponent,PaginacionComponent],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent {

}
