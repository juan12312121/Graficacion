import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock, faEdit, faEllipsisV, faFilter, faProjectDiagram, faSearch, faShareAlt, faSitemap, faSort, faTags, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [FontAwesomeModule, SidebarComponent,CommonModule],  
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {
  faProjectDiagram = faProjectDiagram;
  faSearch = faSearch;
  faFilter = faFilter;
  faSort = faSort;
  faEllipsisV = faEllipsisV;
  faTrash = faTrash;
  faEdit = faEdit;
  faShareAlt = faShareAlt;
  faClock = faClock;
  faUser = faUser;
  faTags = faTags;
  faSitemap = faSitemap;

  isMenuOpen = false;

  toggleMenu(event: MouseEvent): void {
    this.isMenuOpen = !this.isMenuOpen;
    console.log('Menú abierto:', this.isMenuOpen);
  }
}
