import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import { DragDropData } from '../interfaces/diagram.interfaces';
import { DiagramUtils } from '../interfaces/utils/diagram.utils';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {
  
  // Inyectar Router en el constructor
  constructor(private router: Router) {}

  onDragStart(event: DragEvent, tipo: string) {
    // Mapear el tipo del sidebar al formato correcto usando DiagramUtils
    const mappedType = DiagramUtils.mapSidebarTypeToElement(tipo);
        
    // Crear el objeto DragDropData correcto
    const dragData: DragDropData = {
      elementType: mappedType.elementType as 'component' | 'interface' | 'port' | 'connector' | 'relation' | 'annotation',
      subType: mappedType.subType,
      // Mantener compatibilidad con el código legacy
      componentType: mappedType.elementType === 'component' ? mappedType.subType : undefined,
      interfaceType: mappedType.elementType === 'interface' ? mappedType.subType : undefined,
      // Agregar información adicional
      label: this.getLabelForType(tipo),
      icon: this.getIconForType(tipo)
    };

    event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
  }

  private getLabelForType(tipo: string): string {
    const labelMap: Record<string, string> = {
      'component': 'Componente',
      'interface': 'Interfaz',
      'port': 'Puerto',
      'connector': 'Conector',
      'relation': 'Relación',
      'server-component': 'Servidor',
      'client-component': 'Cliente',
      'database-component': 'Base de Datos',
      'service-component': 'Servicio',
      'subsystem-component': 'Subsistema',
      'note-annotation': 'Nota',
      'comment-annotation': 'Comentario',
      'constraint-annotation': 'Restricción',
      'stereotype-annotation': 'Estereotipo'
    };
    return labelMap[tipo] || tipo;
  }

  private getIconForType(tipo: string): string {
    const iconMap: Record<string, string> = {
      'component': 'fas fa-puzzle-piece',
      'interface': 'fas fa-circle',
      'port': 'fas fa-dot-circle',
      'connector': 'fas fa-plug',
      'relation': 'fas fa-project-diagram',
      'server-component': 'fas fa-server',
      'client-component': 'fas fa-desktop',
      'database-component': 'fas fa-database',
      'service-component': 'fas fa-cogs',
      'subsystem-component': 'fas fa-cubes',
      'note-annotation': 'fas fa-sticky-note',
      'comment-annotation': 'fas fa-comment',
      'constraint-annotation': 'fas fa-info-circle',
      'stereotype-annotation': 'fas fa-tag'
    };
    return iconMap[tipo] || 'fas fa-puzzle-piece';
  }

  goHome() {
    // Navegar a la ruta principal
    this.router.navigate(['/principal']);
  }
}