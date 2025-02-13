import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // Agrega esta importación
import {
  faClock, faEdit, faEllipsisV, faEye, faFilter, faInfoCircle,
  faProjectDiagram, faSearch, faShareAlt, faSitemap,
  faSort, faTags, faTrash, faUser
} from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-diagramas-recientes',
  standalone: true,
  imports: [FontAwesomeModule,CommonModule],
  templateUrl: './diagramas-recientes.component.html',
  styleUrl: './diagramas-recientes.component.css'
})
export class DiagramasRecientesComponent {
 // Íconos de FontAwesome
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
  faInfoCircle = faInfoCircle;
  faEye = faEye;

  openMenus: { [key: number]: boolean } = {};

  diagrams = [
    {
      title: 'Organigrama Empresarial',
      lastEdited: 'Hace 2 días',
      owner: 'Juan Pérez',
      tags: ['Organización', 'RR.HH'],
      menuItems: [
        { icon: faEye, label: 'Ver detalles', action: 'verDetalles' },
        { icon: faTrash, label: 'Eliminar', action: 'eliminarDiagrama' }
      ]
    },
    {
      title: 'Flujo de Procesos',
      lastEdited: 'Hace 5 días',
      owner: 'María Gómez',
      tags: ['Procesos', 'Producción'],
      menuItems: [
        { icon: faEdit, label: 'Editar', action: 'verDetalles' },
        { icon: faShareAlt, label: 'Compartir', action: 'eliminarDiagrama' }
      ]
    }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  toggleMenu(index: number, event: Event): void {
    event.stopPropagation(); // Evita que el clic cierre inmediatamente el menú
  
    // Cierra otros menús abiertos
    Object.keys(this.openMenus).forEach(key => {
      if (+key !== index) {
        this.openMenus[+key] = false;
      }
    });
  
    // Alterna el estado del menú actual
    this.openMenus[index] = !this.openMenus[index];
    
    // Asegúrate de que se actualicen los cambios de manera efectiva
    this.cdr.detectChanges();
  }

  @HostListener('document:click')
  closeMenus(): void {
    this.openMenus = {}; // Cierra todos los menús abiertos
    this.cdr.detectChanges();
  }

  ejecutarAccion(accion: string, event: Event): void {
    event.stopPropagation(); // Evita que el menú se cierre al hacer clic en una opción

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
}
