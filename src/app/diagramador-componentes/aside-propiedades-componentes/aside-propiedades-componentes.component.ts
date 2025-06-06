import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Connection, DiagramElement } from '../interfaces/diagram.interfaces';

export interface PropertyUpdate {
  elementId: string;
  property: string;
  value: any;
}

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aside-propiedades-componentes.component.html',
  styleUrls: ['./aside-propiedades-componentes.component.css']
})
export class PropertiesPanelComponent implements OnChanges {
  @Input() selectedElement: DiagramElement | Connection | null = null;
  @Input() allElements: DiagramElement[] = [];
  @Input() isVisible: boolean = false;
  
  @Output() propertyUpdate = new EventEmitter<PropertyUpdate>();
  @Output() elementDelete = new EventEmitter<string>();
  @Output() elementDuplicate = new EventEmitter<DiagramElement>();
  @Output() panelClose = new EventEmitter<void>();

  elementProperties: any = {};
  connectionProperties: any = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedElement'] && this.selectedElement) {
      this.initializeProperties();
    }
  }

  private initializeProperties(): void {
    if (this.isDiagramElement(this.selectedElement)) {
      this.elementProperties = {
        name: this.selectedElement.attributes?.name || '',
        description: this.selectedElement.attributes?.description || '',
        width: this.selectedElement.size.width,
        height: this.selectedElement.size.height,
        x: this.selectedElement.position.x,
        y: this.selectedElement.position.y,
        fill: this.selectedElement.attributes?.fill || '#ffffff',
        stroke: this.selectedElement.attributes?.stroke || '#333333',
        strokeWidth: this.selectedElement.attributes?.strokeWidth || 1,
        headerText: this.selectedElement.attributes?.headerText || '',
        bodyText: this.selectedElement.attributes?.bodyText || '',
        opacity: this.selectedElement.attributes?.opacity || 1,
        visible: this.selectedElement.attributes?.visible !== false,
        locked: this.selectedElement.attributes?.locked || false,
        stereotypeText: this.selectedElement.attributes?.stereotypeText || '',
        stereotype: this.selectedElement.attributes?.stereotype || '',
        content: this.selectedElement.attributes?.content || '',
        icon: this.selectedElement.attributes?.icon || '',
        shape: this.selectedElement.attributes?.shape || 'rectangle'
      };
    } else if (this.isConnection(this.selectedElement)) {
      this.connectionProperties = {
        stroke: this.selectedElement.attributes?.stroke || '#333333',
        strokeWidth: this.selectedElement.attributes?.strokeWidth || 2,
        strokeDasharray: this.selectedElement.attributes?.strokeDasharray || '',
        markerTarget: this.selectedElement.attributes?.markerTarget || '',
        arrowType: this.selectedElement.attributes?.arrowType || 'none',
        connectionType: this.selectedElement.attributes?.connectionType || 'solid'
      };
    }
  }

  isDiagramElement(element: any): element is DiagramElement {
    return element && 'type' in element && 'position' in element && 'size' in element && 'attributes' in element;
  }

  isConnection(element: any): element is Connection {
    return element && 'source' in element && 'target' in element && 'attributes' in element;
  }

  getElementIcon(): string {
    if (!this.selectedElement) return 'fa-question';
    
    if (this.isDiagramElement(this.selectedElement)) {
      switch (this.selectedElement.type) {
        case 'component': return 'fa-cube';
        case 'interface': return 'fa-circle';
        case 'port': return 'fa-plug';
        case 'connector': return 'fa-link';
        case 'relation': return 'fa-arrow-right';
        case 'annotation': return 'fa-comment';
        default: return 'fa-square';
      }
    } else if (this.isConnection(this.selectedElement)) {
      return 'fa-link';
    }
    
    return 'fa-question';
  }

  getElementTypeLabel(): string {
    if (!this.selectedElement) return '';
    
    if (this.isDiagramElement(this.selectedElement)) {
      switch (this.selectedElement.type) {
        case 'component': return 'Componente';
        case 'interface': return 'Interfaz';
        case 'port': return 'Puerto';
        case 'connector': return 'Conector';
        case 'relation': return 'Relación';
        case 'annotation': return 'Anotación';
        default: return 'Elemento';
      }
    } else if (this.isConnection(this.selectedElement)) {
      return 'Conexión';
    }
    
    return '';
  }

  getSourceElementName(): string {
    if (!this.isConnection(this.selectedElement)) return '';
    
    const connection = this.selectedElement as Connection;
    const sourceElement = this.allElements.find(
      el => el.id === connection.source.elementId
    );
    return sourceElement?.attributes?.name || `Elemento ${connection.source.elementId}`;
  }

  getTargetElementName(): string {
    if (!this.isConnection(this.selectedElement)) return '';
    
    const connection = this.selectedElement as Connection;
    const targetElement = this.allElements.find(
      el => el.id === connection.target.elementId
    );
    return targetElement?.attributes?.name || `Elemento ${connection.target.elementId}`;
  }

  // Método auxiliar para obtener información del subtipo
  getSubTypeLabel(): string {
    if (!this.isDiagramElement(this.selectedElement)) return '';
    
    if (this.selectedElement.subType) {
      return this.selectedElement.subType.charAt(0).toUpperCase() + this.selectedElement.subType.slice(1);
    }
    
    return '';
  }

  onPropertyChange(property: string, value: any): void {
    if (!this.selectedElement) return;
    
    this.propertyUpdate.emit({
      elementId: this.selectedElement.id,
      property,
      value
    });
  }

  onSizeChange(dimension: 'width' | 'height', value: number): void {
    if (!this.selectedElement || !this.isDiagramElement(this.selectedElement)) return;
    
    this.propertyUpdate.emit({
      elementId: this.selectedElement.id,
      property: `size.${dimension}`,
      value
    });
  }

  onPositionChange(axis: 'x' | 'y', value: number): void {
    if (!this.selectedElement || !this.isDiagramElement(this.selectedElement)) return;
    
    this.propertyUpdate.emit({
      elementId: this.selectedElement.id,
      property: `position.${axis}`,
      value
    });
  }

  onDelete(): void {
    if (this.selectedElement) {
      this.elementDelete.emit(this.selectedElement.id);
    }
  }

  onDuplicate(): void {
    if (this.isDiagramElement(this.selectedElement)) {
      this.elementDuplicate.emit(this.selectedElement);
    }
  }

  onClose(): void {
    this.panelClose.emit();
  }
}