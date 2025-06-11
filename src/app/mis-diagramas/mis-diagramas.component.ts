import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { PaginacionComponent } from '../paginacion/paginacion.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router'; // Asegúrate de importar esto

@Component({
  selector: 'app-mis-diagramas',
  standalone: true,
  imports: [SidebarComponent, CommonModule, PaginacionComponent, RouterModule],
  templateUrl: './mis-diagramas.component.html',
  styleUrl: './mis-diagramas.component.css'
})
export class MisDiagramasComponent implements OnInit {

  diagramas: any[] = [];
  openMenus: { [key: number]: boolean } = {}; 
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

 constructor(private cdr: ChangeDetectorRef, private router: Router) {}
 editarDiagrama(id: string) {
  this.router.navigate(['/diagramador-base', id]);
}

  ngOnInit() {
    this.obtenerDiagramas();
  }

  obtenerDiagramas() {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:4000/api/diagramas', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        this.diagramas = data;
        this.updateTotalPages();
        this.cdr.detectChanges();
      })
      .catch(err => console.error('Error al cargar diagramas:', err));
  }

  eliminarDiagrama(id: string): void {
    const token = localStorage.getItem('token');
    if (!confirm('¿Estás seguro de eliminar este diagrama?')) return;

    fetch(`http://localhost:4000/api/diagramas/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(() => {
        this.diagramas = this.diagramas.filter(d => d._id !== id);
        this.updateTotalPages();
        this.cdr.detectChanges();
      })
      .catch(err => console.error('Error al eliminar:', err));
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
    this.totalPages = Math.ceil(this.diagramas.length / this.itemsPerPage);
  }

  get paginatedDiagramas() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.diagramas.slice(start, start + this.itemsPerPage);
  }
}
