import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faClock,
  faEdit,
  faEllipsisV,
  faEye,
  faFilter,
  faProjectDiagram,
  faSearch,
  faShareAlt,
  faSitemap,
  faSort,
  faTags,
  faTrash,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-mis-diagramas',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FontAwesomeModule],
  templateUrl: './mis-diagramas.component.html',
  styleUrl: './mis-diagramas.component.css'
})
export class MisDiagramasComponent {
  faTags = faTags;
  faClock = faClock;
  faUser = faUser;
  faEllipsisV = faEllipsisV;
  faEye = faEye;
  faTrash = faTrash;
  faEdit = faEdit;
  faShareAlt = faShareAlt;
  faSitemap = faSitemap;
  faProjectDiagram = faProjectDiagram;
  faSort = faSort;
  faFilter = faFilter;
  faSearch = faSearch;
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;

  openMenus: { [key: number]: boolean } = {}; 
  
  diagrams = Array.from({ length: 50 }, (_, i) => ({
    title: `Diagrama ${i + 1}`,
    lastEdited: `Hace ${i + 1} días`,
    owner: `Usuario ${i + 1}`,
    tags: ['Etiqueta1', 'Etiqueta2'],
    menuItems: [
      { icon: faEye, label: 'Ver detalles', action: 'verDetalles' },
      { icon: faTrash, label: 'Eliminar', action: 'eliminarDiagrama' }
    ]
  }));

  currentPage = 1;
  itemsPerPage = 10; // Cambiado a un valor más práctico
  totalPages = 1;

  constructor(private cdr: ChangeDetectorRef) {
    this.updateTotalPages();
  }

  toggleMenu(index: number, event: Event): void {
    event.stopPropagation();
    Object.keys(this.openMenus).forEach(key => {
      if (+key !== index) {
        this.openMenus[+key] = false;
      }
    });
    this.openMenus[index] = !this.openMenus[index];
    this.cdr.detectChanges();
  }

  @HostListener('document:click')
  closeMenus(): void {
    this.openMenus = {}; 
    this.cdr.detectChanges();
  }

  ejecutarAccion(accion: string, event: Event): void {
    event.stopPropagation();
    if (accion === 'verDetalles') {
      this.verDetalles();
    } else if (accion === 'eliminarDiagrama') {
      this.eliminarDiagrama();
    }
  }

  verDetalles(): void {
    console.log('Ver detalles del diagrama');
  }

  eliminarDiagrama(): void {
    console.log('Diagrama eliminado');
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  get paginatedDiagrams() {
    this.updateTotalPages();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.diagrams.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  updateTotalPages() {
    this.totalPages = Math.ceil(this.diagrams.length / this.itemsPerPage);
  }
}
