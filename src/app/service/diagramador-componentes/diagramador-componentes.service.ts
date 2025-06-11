// services/diagram.service.ts - VERSIÓN CORREGIDA CON updateElementPosition

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Connection,
  ConnectionMode,
  DiagramElement,
  DiagramState,
  DragDropData,
  Position,
  ToolAction,
  ZoomControls
} from '../../diagramador-componentes/interfaces/diagram.interfaces';
import { DiagramUtils } from '../../diagramador-componentes/interfaces/utils/diagram.utils';

@Injectable({
  providedIn: 'root'
})
export class DiagramService {
  updateElementPosition(arg0: string, arg1: { x: number; y: number; }) {
    throw new Error('Method not implemented.');
  }
  
  // Estado del diagrama
  private diagramStateSubject = new BehaviorSubject<DiagramState>({
    elements: [],
    connections: [],
    zoomLevel: 1
  });

  // Estado del modo conexión
  private connectionModeSubject = new BehaviorSubject<ConnectionMode>({
    active: false,
    indicator: 'Selecciona el origen'
  });

  // Stack para undo/redo
  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private maxHistorySize = 50;
  

  // Controles de zoom
  private zoomControlsSubject = new BehaviorSubject<ZoomControls>({
    level: 1,
    min: 0.1,
    max: 3,
    step: 0.1
  });

  // Observables públicos
  public diagramState$: Observable<DiagramState> = this.diagramStateSubject.asObservable();
  public connectionMode$: Observable<ConnectionMode> = this.connectionModeSubject.asObservable();
  public zoomControls$: Observable<ZoomControls> = this.zoomControlsSubject.asObservable();

  constructor() {
    // Guardar estado inicial
    this.saveState();
  }

  /**
   * Obtiene el estado actual del diagrama
   */
  getCurrentState(): DiagramState {
    return this.diagramStateSubject.value;
  }

  /**
   * Agrega un elemento al diagrama
   */
  addElement(dragData: DragDropData, position: Position): void {
    // Validar entradas
    if (!dragData) {
      console.error('dragData es requerido');
      return;
    }

    if (!position || !DiagramUtils.validatePosition(position)) {
      console.error('Posición inválida proporcionada:', position);
      return;
    }

    try {
      const currentState = this.getCurrentState();
      const newElement = this.createElementFromDragData(dragData, position);
      
      const updatedState: DiagramState = {
        ...currentState,
        elements: [...currentState.elements, newElement]
      };

      this.updateDiagramState(updatedState);
      this.saveState();
    } catch (error) {
      console.error('Error agregando elemento:', error);
    }
  }

  /**
   * Actualiza un elemento existente
   */
  updateElement(elementId: string, updates: Partial<DiagramElement>): void {
    const currentState = this.getCurrentState();
    const updatedElements = currentState.elements.map(element => 
      element.id === elementId ? { ...element, ...updates } : element
    );

    const updatedState: DiagramState = {
      ...currentState,
      elements: updatedElements
    };

    this.updateDiagramState(updatedState);
    this.saveState();
  }



  
 

  /**
   * Elimina un elemento del diagrama
   */
  removeElement(elementId: string): void {
    const currentState = this.getCurrentState();
    
    // Eliminar elemento
    const updatedElements = currentState.elements.filter(element => element.id !== elementId);
    
    // Eliminar conexiones relacionadas
    const updatedConnections = currentState.connections.filter(connection => 
      connection.source.elementId !== elementId && connection.target.elementId !== elementId
    );

    const updatedState: DiagramState = {
      ...currentState,
      elements: updatedElements,
      connections: updatedConnections
    };

    this.updateDiagramState(updatedState);
    this.saveState();
  }

  /**
   * Agrega una conexión entre elementos
   */
  addConnection(sourceElementId: string, sourcePort: string, targetElementId: string, targetPort: string): void {
    const currentState = this.getCurrentState();
    
    // Validar que los elementos existen
    const sourceElement = currentState.elements.find(e => e.id === sourceElementId);
    const targetElement = currentState.elements.find(e => e.id === targetElementId);
    
    if (!sourceElement || !targetElement) {
      console.error('Elementos no encontrados para la conexión');
      return;
    }

    // Validar conexión
    if (!DiagramUtils.validateConnection(sourceElement, targetElement)) {
      console.error('Conexión no válida');
      return;
    }

    const newConnection: Connection = {
      id: DiagramUtils.generateId(),
      source: { elementId: sourceElementId, port: sourcePort },
      target: { elementId: targetElementId, port: targetPort },
      attributes: DiagramUtils.createDefaultConnectionAttributes()
    };

    const updatedState: DiagramState = {
      ...currentState,
      connections: [...currentState.connections, newConnection]
    };

    this.updateDiagramState(updatedState);
    this.saveState();
  }

  /**
   * Actualiza una conexión existente
   */
  updateConnection(connectionId: string, updates: Partial<Connection>): void {
    const currentState = this.getCurrentState();
    const updatedConnections = currentState.connections.map(connection => 
      connection.id === connectionId ? { ...connection, ...updates } : connection
    );

    const updatedState: DiagramState = {
      ...currentState,
      connections: updatedConnections
    };

    this.updateDiagramState(updatedState);
    this.saveState();
  }

  /**
   * Elimina una conexión
   */
  removeConnection(connectionId: string): void {
    const currentState = this.getCurrentState();
    const updatedConnections = currentState.connections.filter(connection => connection.id !== connectionId);

    const updatedState: DiagramState = {
      ...currentState,
      connections: updatedConnections
    };

    this.updateDiagramState(updatedState);
    this.saveState();
  }

  /**
   * Selecciona un elemento
   */
  selectElement(element: DiagramElement | Connection): void {
    const currentState = this.getCurrentState();
    const updatedState: DiagramState = {
      ...currentState,
      selectedElement: element
    };

    this.updateDiagramState(updatedState);
  }

  /**
   * Deselecciona elemento actual
   */
  deselectElement(): void {
    const currentState = this.getCurrentState();
    const updatedState: DiagramState = {
      ...currentState,
      selectedElement: undefined
    };

    this.updateDiagramState(updatedState);
  }

  /**
   * Maneja acciones de la toolbar
   */
  handleToolAction(action: ToolAction): void {
    switch (action.type) {
      case 'undo':
        this.undo();
        break;
      case 'redo':
        this.redo();
        break;
      case 'connect':
        this.toggleConnectionMode();
        break;
      case 'delete':
        this.deleteSelected();
        break;
      case 'clear':
        this.clearDiagram();
        break;
      case 'zoom-in':
        this.zoomIn();
        break;
      case 'zoom-out':
        this.zoomOut();
        break;
      default:
        console.warn('Acción no reconocida:', action.type);
    }
  }

  /**
   * Togglea el modo de conexión
   */
  toggleConnectionMode(): void {
    const currentMode = this.connectionModeSubject.value;
    const newMode: ConnectionMode = {
      active: !currentMode.active,
      startPoint: undefined,
      indicator: !currentMode.active ? 'Selecciona el origen' : ''
    };

    this.connectionModeSubject.next(newMode);
  }

  /**
   * Establece el punto de inicio para conexión
   */
  setConnectionStart(elementId: string, port: string): void {
    const currentState = this.getCurrentState();
    const element = currentState.elements.find(e => e.id === elementId);
    
    if (element) {
      const currentMode = this.connectionModeSubject.value;
      const updatedMode: ConnectionMode = {
        ...currentMode,
        startPoint: {
          position: port as any,
          element: element,
          coordinates: DiagramUtils.getElementCenter(element)
        },
        indicator: 'Selecciona el destino'
      };

      this.connectionModeSubject.next(updatedMode);
    }
  }

  /**
   * Completa una conexión
   */
  completeConnection(targetElementId: string, targetPort: string): void {
    const connectionMode = this.connectionModeSubject.value;
    
    if (connectionMode.active && connectionMode.startPoint) {
      this.addConnection(
        connectionMode.startPoint.element.id,
        connectionMode.startPoint.position,
        targetElementId,
        targetPort
      );

      // Resetear modo conexión
      this.connectionModeSubject.next({
        active: false,
        indicator: ''
      });
    }
  }

  /**
   * Cancela una conexión en progreso
   */
  cancelConnection(): void {
    const currentMode = this.connectionModeSubject.value;
    
    if (currentMode.active) {
      // Resetear el modo de conexión manteniendo el estado activo pero limpiando el punto de inicio
      const resetMode: ConnectionMode = {
        active: true, // Mantener el modo activo
        startPoint: undefined, // Limpiar el punto de inicio
        indicator: 'Selecciona el origen' // Resetear el indicador
      };

      this.connectionModeSubject.next(resetMode);
      console.log('Conexión cancelada - modo conexión sigue activo');
    }
  }

  /**
   * Controles de zoom
   */
  zoomIn(): void {
    const currentZoom = this.zoomControlsSubject.value;
    const newLevel = Math.min(currentZoom.level + currentZoom.step, currentZoom.max);
    this.updateZoomLevel(newLevel);
  }

  zoomOut(): void {
    const currentZoom = this.zoomControlsSubject.value;
    const newLevel = Math.max(currentZoom.level - currentZoom.step, currentZoom.min);
    this.updateZoomLevel(newLevel);
  }

  setZoomLevel(level: number): void {
    const currentZoom = this.zoomControlsSubject.value;
    const clampedLevel = Math.max(currentZoom.min, Math.min(level, currentZoom.max));
    this.updateZoomLevel(clampedLevel);
  }

  /**
   * Undo/Redo funcionalidad
   */
  undo(): void {
    if (this.undoStack.length > 1) {
      this.redoStack.push(this.undoStack.pop()!);
      const previousState = this.undoStack[this.undoStack.length - 1];
      const state = JSON.parse(previousState);
      this.diagramStateSubject.next(state);
    }
  }

  redo(): void {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop()!;
      this.undoStack.push(nextState);
      const state = JSON.parse(nextState);
      this.diagramStateSubject.next(state);
    }
  }

  /**
   * Elimina el elemento seleccionado
   */
  deleteSelected(): void {
    const currentState = this.getCurrentState();
    if (currentState.selectedElement) {
      if ('type' in currentState.selectedElement) {
        // Es un elemento
        this.removeElement(currentState.selectedElement.id);
      } else {
        // Es una conexión
        this.removeConnection(currentState.selectedElement.id);
      }
    }
  }

  /**
   * Limpia todo el diagrama
   */
  clearDiagram(): void {
    const clearedState: DiagramState = {
      elements: [],
      connections: [],
      zoomLevel: 1
    };

    this.updateDiagramState(clearedState);
    this.saveState();
  }

  /**
   * Guarda el diagrama como JSON
   */
  exportDiagram(): string {
    const currentState = this.getCurrentState();
    return DiagramUtils.serializeDiagram(currentState.elements, currentState.connections);
  }

  /**
   * Carga un diagrama desde JSON
   */
  importDiagram(jsonString: string): boolean {
    const diagramData = DiagramUtils.deserializeDiagram(jsonString);
    
    if (diagramData) {
      const importedState: DiagramState = {
        elements: diagramData.elements,
        connections: diagramData.connections,
        zoomLevel: 1
      };

      this.updateDiagramState(importedState);
      this.saveState();
      return true;
    }

    return false;
  }

  // Métodos privados

  private updateDiagramState(newState: DiagramState): void {
    this.diagramStateSubject.next(newState);
  }

  private updateZoomLevel(level: number): void {
    const currentZoom = this.zoomControlsSubject.value;
    const updatedZoom: ZoomControls = {
      ...currentZoom,
      level
    };

    this.zoomControlsSubject.next(updatedZoom);

    // También actualizar en el estado del diagrama
    const currentState = this.getCurrentState();
    const updatedState: DiagramState = {
      ...currentState,
      zoomLevel: level
    };

    this.updateDiagramState(updatedState);
  }

  private saveState(): void {
    const currentState = this.getCurrentState();
    const stateString = JSON.stringify(currentState);
    
    if (this.undoStack.length >= this.maxHistorySize) {
      this.undoStack.shift();
    }
    
    this.undoStack.push(stateString);
    this.redoStack = []; // Limpiar redo stack cuando se hace una nueva acción
  }

  /**
   * Crea un elemento desde los datos de drag and drop
   * VERSIÓN CORREGIDA SIN PROPIEDADES NO DEFINIDAS
   */
  private createElementFromDragData(dragData: DragDropData, position: Position): DiagramElement {
    // Validar dragData
    if (!dragData) {
      console.error('dragData es requerido');
      throw new Error('dragData es requerido');
    }

    // Validar que tenemos un elementType
    if (!dragData.elementType) {
      console.error('elementType es requerido en dragData');
      throw new Error('elementType es requerido en dragData');
    }

    // Determinar el subType
    let subType = dragData.subType || 'basic';
    
    // Para compatibilidad con código legacy
    if (!dragData.subType) {
      if (dragData.componentType && dragData.elementType === 'component') {
        subType = dragData.componentType;
      } else if (dragData.interfaceType && dragData.elementType === 'interface') {
        subType = dragData.interfaceType;
      }
    }

    // Crear el elemento básico según la interfaz DiagramElement
    const element: DiagramElement = {
      id: this.generateUniqueId(),
      type: dragData.elementType,
      subType: subType,
      position: { ...position },
      size: this.getDefaultSize(dragData.elementType, subType),
      attributes: {
        name: dragData.label || this.getDefaultName(dragData.elementType, subType),
        icon: dragData.icon || this.getDefaultIcon(dragData.elementType, subType),
        description: '',
        properties: {},
        ...this.getDefaultAttributes(dragData.elementType, subType)
      }
    };

    return element;
  }

  /**
   * Genera un ID único para el elemento
   */
  private generateUniqueId(): string {
    return 'element_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Obtiene el tamaño por defecto según el tipo de elemento
   */
  private getDefaultSize(elementType: string, subType: string): { width: number; height: number } {
    const sizeMap: Record<string, { width: number; height: number }> = {
      'component': { width: 120, height: 80 },
      'interface': { width: 100, height: 60 },
      'database': { width: 100, height: 80 },
      'service': { width: 110, height: 70 },
      'container': { width: 200, height: 150 },
      'node': { width: 80, height: 60 }
    };

    return sizeMap[elementType] || { width: 100, height: 60 };
  }

  /**
   * Obtiene el nombre por defecto según el tipo de elemento
   */
  private getDefaultName(elementType: string, subType: string): string {
    const nameMap: Record<string, string> = {
      'component': 'Componente',
      'interface': 'Interfaz',
      'database': 'Base de Datos',
      'service': 'Servicio',
      'container': 'Contenedor',
      'node': 'Nodo'
    };

    const baseName = nameMap[elementType] || 'Elemento';
    return `${baseName} ${subType}`;
  }

  /**
   * Obtiene el icono por defecto según el tipo de elemento
   */
  private getDefaultIcon(elementType: string, subType: string): string {
    const iconMap: Record<string, string> = {
      'component': 'cube',
      'interface': 'layers',
      'database': 'database',
      'service': 'server',
      'container': 'box',
      'node': 'circle'
    };

    return iconMap[elementType] || 'square';
  }

  /**
   * Obtiene los atributos por defecto según el tipo de elemento
   */
  private getDefaultAttributes(elementType: string, subType: string): Record<string, any> {
    const defaultAttributes: Record<string, Record<string, any>> = {
      'component': {
        framework: 'angular',
        version: '1.0.0',
        dependencies: [],
        // Información de puertos como parte de atributos
        ports: this.getDefaultPorts(elementType, subType),
        // Información de estilo como parte de atributos
        style: this.getDefaultStyle(elementType, subType)
      },
      'interface': {
        methods: [],
        extends: null,
        ports: this.getDefaultPorts(elementType, subType),
        style: this.getDefaultStyle(elementType, subType)
      },
      'database': {
        engine: 'postgresql',
        tables: [],
        ports: this.getDefaultPorts(elementType, subType),
        style: this.getDefaultStyle(elementType, subType)
      },
      'service': {
        protocol: 'http',
        port: 8080,
        endpoints: [],
        ports: this.getDefaultPorts(elementType, subType),
        style: this.getDefaultStyle(elementType, subType)
      },
      'container': {
        image: 'ubuntu:latest',
        ports: [],
        volumes: [],
        connectionPorts: this.getDefaultPorts(elementType, subType),
        style: this.getDefaultStyle(elementType, subType)
      },
      'node': {
        type: 'compute',
        resources: {},
        ports: this.getDefaultPorts(elementType, subType),
        style: this.getDefaultStyle(elementType, subType)
      }
    };

    return defaultAttributes[elementType] || {
      ports: this.getDefaultPorts(elementType, subType),
      style: this.getDefaultStyle(elementType, subType)
    };
  }

  /**
   * Obtiene los puertos por defecto según el tipo de elemento
   * Ahora retorna la configuración como objeto simple
   */
  private getDefaultPorts(elementType: string, subType: string): Record<string, any> {
    const portConfigs: Record<string, Record<string, any>> = {
      'component': {
        input: { type: 'input', position: 'left' },
        output: { type: 'output', position: 'right' }
      },
      'interface': {
        implements: { type: 'input', position: 'left' },
        extends: { type: 'output', position: 'right' }
      },
      'database': {
        query: { type: 'input', position: 'left' },
        data: { type: 'output', position: 'right' }
      },
      'service': {
        request: { type: 'input', position: 'left' },
        response: { type: 'output', position: 'right' }
      },
      'container': {
        network: { type: 'input', position: 'left' },
        expose: { type: 'output', position: 'right' }
      },
      'node': {
        connection: { type: 'input', position: 'left' }
      }
    };

    return portConfigs[elementType] || {
      input: { type: 'input', position: 'left' },
      output: { type: 'output', position: 'right' }
    };
  }

  /**
   * Obtiene el estilo por defecto según el tipo de elemento
   * Ahora retorna un objeto que se incluirá en attributes
   */
  private getDefaultStyle(elementType: string, subType: string): Record<string, any> {
    const styleMap: Record<string, Record<string, any>> = {
      'component': {
        backgroundColor: '#e3f2fd',
        borderColor: '#2196f3',
        borderWidth: 2,
        borderRadius: 8,
        color: '#1976d2'
      },
      'interface': {
        backgroundColor: '#f3e5f5',
        borderColor: '#9c27b0',
        borderWidth: 2,
        borderRadius: 8,
        color: '#7b1fa2'
      },
      'database': {
        backgroundColor: '#e8f5e8',
        borderColor: '#4caf50',
        borderWidth: 2,
        borderRadius: 8,
        color: '#388e3c'
      },
      'service': {
        backgroundColor: '#fff3e0',
        borderColor: '#ff9800',
        borderWidth: 2,
        borderRadius: 8,
        color: '#f57c00'
      },
      'container': {
        backgroundColor: '#fce4ec',
        borderColor: '#e91e63',
        borderWidth: 2,
        borderRadius: 8,
        color: '#c2185b'
      },
      'node': {
        backgroundColor: '#f5f5f5',
        borderColor: '#9e9e9e',
        borderWidth: 2,
        borderRadius: 8,
        color: '#616161'
      }
    };

    return styleMap[elementType] || {
      backgroundColor: '#ffffff',
      borderColor: '#cccccc',
      borderWidth: 1,
      borderRadius: 4,
      color: '#333333'
    };
  }

  /**
   * Type guard para verificar si dragData es de tipo componente
   */
  private isComponentDragData(dragData: DragDropData): dragData is DragDropData & { componentType: string } {
    return 'componentType' in dragData && dragData.componentType !== undefined && dragData.componentType !== null;
  }

  /**
   * Type guard para verificar si dragData es de tipo interfaz
   */
  private isInterfaceDragData(dragData: DragDropData): dragData is DragDropData & { interfaceType: string } {
    return 'interfaceType' in dragData && dragData.interfaceType !== undefined && dragData.interfaceType !== null;
  }

// En tu DiagramService
updateElementProperty(elementId: string, property: string, value: any): void {
  const currentState = this.diagramStateSubject.value;
  const elementIndex = currentState.elements.findIndex(el => el.id === elementId);
  
  if (elementIndex !== -1) {
    const updatedElements = [...currentState.elements];
    const element = { ...updatedElements[elementIndex] };
    
    // Actualizar la propiedad en el lugar correcto
    if (property === 'name' || property === 'description') {
      element.attributes = { ...element.attributes, [property]: value };
    } else if (property === 'width' || property === 'height') {
      element.size = { ...element.size, [property]: value };
    } else if (property === 'x' || property === 'y') {
      element.position = { ...element.position, [property]: value };
    } else {
      // Para propiedades visuales como fill, stroke, etc.
      element.attributes = { ...element.attributes, [property]: value };
    }
    
    updatedElements[elementIndex] = element;
    
    const newState: DiagramState = {
      ...currentState,
      elements: updatedElements,
      selectedElement: element // Actualizar también el elemento seleccionado
    };
    
    this.diagramStateSubject.next(newState);
    console.log('Estado actualizado en servicio:', property, value);
  } else {
    console.error('Elemento no encontrado para actualizar:', elementId);
  }
}

addElementFromData(elementData: DiagramElement): void {
  if (!elementData) {
    console.error('elementData es requerido');
    return;
  }

  try {
    const currentState = this.getCurrentState();
    
    // Crear una copia del elemento con nuevo ID y posición ligeramente desplazada
    const newElement: DiagramElement = {
      ...elementData,
      id: this.generateUniqueId(),
      position: {
        x: elementData.position.x + 20,
        y: elementData.position.y + 20
      }
    };
    
    const updatedState: DiagramState = {
      ...currentState,
      elements: [...currentState.elements, newElement]
    };

    this.updateDiagramState(updatedState);
    this.saveState();
  } catch (error) {
    console.error('Error agregando elemento desde datos:', error);
  }
}

resetZoom(): void {
  this.setZoomLevel(1);
}
resetDiagramState(): void {
  this.diagramStateSubject.next({
    elements: [],
    connections: [],
    zoomLevel: 1
  });
}




}