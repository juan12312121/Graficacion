import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaginacionComponent } from '../paginacion/paginacion.component';

@Component({
  selector: 'app-diagramas-recientes',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, PaginacionComponent],
  templateUrl: './diagramas-recientes.component.html',
  styleUrls: ['./diagramas-recientes.component.css']
})
export class DiagramasRecientesComponent implements OnInit {
  recientes: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.obtenerDiagramasRecientes();
  }

  obtenerDiagramasRecientes() {
    const token = localStorage.getItem('token');
    fetch('http://localhost:4000/api/diagramas', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      // Asigna fecha actual si no trae ninguna (no persistente)
      data.forEach((d: any) => {
        if (!d.updatedAt && !d.createdAt) d.updatedAt = new Date().toISOString();
      });

      // Ordena por fecha
      this.recientes = (data || [])
        .sort((a: any, b: any) => {
          const fechaA = new Date(a.updatedAt || a.createdAt).getTime();
          const fechaB = new Date(b.updatedAt || b.createdAt).getTime();
          return fechaB - fechaA;
        })
        .slice(0, 6);

      this.cdr.detectChanges();
    });
  }

  obtenerTextoFecha(fecha: string): string {
    if (!fecha) return '';
    const ahora = new Date();
    const creada = new Date(fecha);
    const diffMs = ahora.getTime() - creada.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDias === 0) return 'Hoy';
    if (diffDias === 1) return 'Ayer';
    return `Hace ${diffDias} días`;
  }

  eliminarDiagrama(id: string) {
    const token = localStorage.getItem('token');
    if (!confirm('¿Eliminar este diagrama?')) return;
    fetch(`http://localhost:4000/api/diagramas/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(() => {
      this.recientes = this.recientes.filter(d => d._id !== id);
      this.cdr.detectChanges();
    });
  }
}