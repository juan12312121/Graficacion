// services/diagram.service.ts

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
    const currentState = this.getCurrentState();
    const newElement = this.createElementFromDragData(dragData, position);
    
    const updatedState: DiagramState = {
      ...currentState,
      elements: [...currentState.elements, newElement]
    };

    this.updateDiagramState(updatedState);
    this.saveState();
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

  private createElementFromDragData(dragData: DragDropData, position: Position): DiagramElement {
    const baseElement = DiagramUtils.createDefaultElement(dragData.elementType, position);
    
    // Aplicar configuraciones específicas según el tipo
    if (dragData.elementType === 'component' && dragData.componentType) {
      const config = DiagramUtils.getComponentTypeConfig(dragData.componentType);
      if (config) {
        baseElement.attributes = {
          ...baseElement.attributes,
          headerText: config.headerText,
          stereotypeText: config.stereotype,
          fill: config.fill,
          stroke: config.stroke
        };
      }
    } else if (dragData.elementType === 'interface' && dragData.interfaceType) {
      const config = DiagramUtils.getInterfaceTypeConfig(dragData.interfaceType);
      if (config) {
        baseElement.attributes = {
          ...baseElement.attributes,
          name: config.headerText,
          fill: config.fill,
          stroke: config.stroke
        };
      }
    }

    return baseElement;
  }
}