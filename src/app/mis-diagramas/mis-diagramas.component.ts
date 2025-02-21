import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { PaginacionComponent } from '../paginacion/paginacion.component';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-mis-diagramas',
  standalone: true,
  imports: [SidebarComponent, CommonModule,PaginacionComponent],
  templateUrl: './mis-diagramas.component.html',
  styleUrl: './mis-diagramas.component.css'
})
export class MisDiagramasComponent {

  openMenus: { [key: number]: boolean } = {}; 
  
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
    this.totalPages = Math.ceil(0 / this.itemsPerPage); // Cambiar 0 por el total de diagramas si se agrega algún array.
  }  
}
