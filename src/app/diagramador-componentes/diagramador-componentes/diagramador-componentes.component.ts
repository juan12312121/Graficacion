import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as joint from 'jointjs';
import { Subscription } from 'rxjs';

import { DiagramService } from '../../service/diagramador-componentes/diagramador-componentes.service';
import { ToolbarAction, ToolbarComponent } from "../../toolbar/toolbar.component";
import { PropertiesPanelComponent, PropertyUpdate } from '../aside-propiedades-componentes/aside-propiedades-componentes.component';
import { AsideComponent } from '../aside/aside.component';
import {
  Connection,
  ConnectionMode,
  DiagramElement,
  DiagramState,
  DragDropData,
  Position,
  ZoomControls
} from '../interfaces/diagram.interfaces';

@Component({
  selector: 'app-diagramador-componentes',
  standalone: true,
  imports: [AsideComponent, ToolbarComponent, PropertiesPanelComponent, CommonModule],
  templateUrl: './diagramador-componentes.component.html',
  styleUrl: './diagramador-componentes.component.css'
})
export class DiagramadorComponentesComponent implements OnInit, OnDestroy, AfterViewInit {
closePropertiesPanel() {
throw new Error('Method not implemented.');
}
  
  @ViewChild('diagramContainer', { static: true }) diagramContainer!: ElementRef<HTMLDivElement>;
  
  // Joint.js instances
  private graph!: joint.dia.Graph;
  private paper!: joint.dia.Paper;
  
  // Estado del componente
  currentDiagramState: DiagramState = {
    elements: [],
    connections: [],
    zoomLevel: 1
  };
  
  connectionMode: ConnectionMode = {
    active: false,
    indicator: ''
  };
  
  zoomControls: ZoomControls = {
    level: 1,
    min: 0.1,
    max: 3,
    step: 0.1
  };

  // Properties panel state
  isPropertiesPanelVisible: boolean = false;
  selectedElement: DiagramElement | Connection | null = null;

  // Additional properties for connection mode
  private connectMode: boolean = false;
  private isConnecting: boolean = false;
  private connectingElement: joint.dia.Element | null = null;
  private selectedJointElement: joint.dia.Element | null = null;

  // Flag para evitar loops de actualización
  private isUpdatingFromJoint: boolean = false;

  // Toolbar configuration
  toolbarGroups: ToolbarAction[][] = [
    [
      { type: 'select', icon: 'fa-mouse-pointer', title: 'Seleccionar', active: true },
      { type: 'move', icon: 'fa-arrows-alt', title: 'Mover' },
      { type: 'delete', icon: 'fa-trash-alt', title: 'Eliminar' }
    ],
    [
      { type: 'undo', icon: 'fa-undo', title: 'Deshacer', disabled: true },
      { type: 'redo', icon: 'fa-redo', title: 'Rehacer', disabled: true },
      { type: 'export', icon: 'fa-file-export', title: 'Exportar' },
      { type: 'save', icon: 'fa-save', title: 'Guardar' }
    ]
  ];

  // Suscripciones
  private subscriptions: Subscription[] = [];
  
  // Elementos Joint.js mapeados
  private jointElements = new Map<string, joint.dia.Element>();
  private jointConnections = new Map<string, joint.dia.Link>();
hasSelectedElement: any;
selectedElementName: any;

  constructor(private diagramService: DiagramService) {}

  ngOnInit(): void {
    // No inicializar suscripciones aquí - esperamos a que Joint.js esté listo
  }

  ngAfterViewInit(): void {
    this.initializeJointJS();
    this.setupEventHandlers();
    // Ahora sí inicializamos las suscripciones después de que Joint.js esté listo
    this.initializeSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.cleanup();
  }

  /**
   * Inicializa las suscripciones a los observables del servicio
   */
  private initializeSubscriptions(): void {
    // Suscripción al estado del diagrama
    const diagramSub = this.diagramService.diagramState$.subscribe(state => {
      if (!this.isUpdatingFromJoint) {
        this.currentDiagramState = state;
        this.updateJointDiagram();
        // Actualizar elemento seleccionado si existe
        this.updateSelectedElement();
      }
    });

    // Suscripción al modo de conexión
    const connectionSub = this.diagramService.connectionMode$.subscribe(mode => {
      this.connectionMode = mode;
      this.updateConnectionModeUI();
    });

    // Suscripción a los controles de zoom
    const zoomSub = this.diagramService.zoomControls$.subscribe(controls => {
      this.zoomControls = controls;
      this.updateZoomLevel();
    });

    this.subscriptions.push(diagramSub, connectionSub, zoomSub);
  }

  /**
   * Actualiza el elemento seleccionado basado en el estado del servicio
   */
  private updateSelectedElement(): void {
    if (this.currentDiagramState.selectedElement) {
      this.selectedElement = this.currentDiagramState.selectedElement;
      this.showPropertiesPanel();
    } else {
      this.selectedElement = null;
      this.hidePropertiesPanel();
    }
  }

  /**
   * Inicializa Joint.js
   */
  private initializeJointJS(): void {
    // Crear el grafo
    this.graph = new joint.dia.Graph();

    // Crear el paper (lienzo)
    this.paper = new joint.dia.Paper({
      el: this.diagramContainer.nativeElement,
      model: this.graph,
      width: '100%',
      height: '100%',
      gridSize: 10,
      drawGrid: true,
      background: {
        color: '#f8f9fa'
      },
      interactive: true,
      defaultLink: () => new joint.shapes.standard.Link(),
      linkPinning: false,
      snapLinks: { radius: 20 },
      markAvailable: true,
      validateConnection: (cellViewS, magnetS, cellViewT, magnetT) => {
        return this.validateJointConnection(cellViewS, cellViewT);
      }
    });

    // Configurar zoom inicial
    this.paper.scale(this.zoomControls.level);
  }

  /**
   * Configura los event handlers de Joint.js
   */
private setupEventHandlers(): void {
  // Evento de clic en elemento
  this.paper.on('element:pointerclick', (elementView: joint.dia.ElementView) => {
    const element = this.findDiagramElementById(elementView.model.id as string);
    if (element) {
      this.diagramService.selectElement(element);
      this.selectedJointElement = elementView.model;
      this.selectedElement = element;
      // Solo seleccionar, no abrir panel para evitar conflicto con doble clic
      this.highlightSelectedElement(elementView);
    }
  });

  // NUEVO: Evento de doble clic en elemento
  this.paper.on('element:pointerdblclick', (elementView: joint.dia.ElementView) => {
    const element = this.findDiagramElementById(elementView.model.id as string);
    if (element) {
      this.diagramService.selectElement(element);
      this.selectedJointElement = elementView.model;
      this.selectedElement = element;
      this.showPropertiesPanel();
      console.log('Doble clic en elemento - Abriendo panel de propiedades:', element.id);
    }
  });

  // Evento de clic en conexión
  this.paper.on('link:pointerclick', (linkView: joint.dia.LinkView) => {
    const connection = this.findConnectionById(linkView.model.id as string);
    if (connection) {
      this.diagramService.selectElement(connection);
      this.selectedElement = connection;
      // Solo seleccionar, no abrir panel para evitar conflicto con doble clic
    }
  });

  // NUEVO: Evento de doble clic en conexión
  this.paper.on('link:pointerdblclick', (linkView: joint.dia.LinkView) => {
    const connection = this.findConnectionById(linkView.model.id as string);
    if (connection) {
      this.diagramService.selectElement(connection);
      this.selectedElement = connection;
      this.showPropertiesPanel();
      console.log('Doble clic en conexión - Abriendo panel de propiedades:', connection.id);
    }
  });

  // Evento de arrastrar elemento - Solo actualizar posición sin refrescar todo
  this.paper.on('element:pointermove', (elementView: joint.dia.ElementView) => {
    const jointElement = elementView.model;
    const position = jointElement.position();
    
    // Evitar loop de actualizaciones
    this.isUpdatingFromJoint = true;
    
    // Solo actualizar la posición en el servicio, no refrescar el diagrama completo
    this.diagramService.updateElementPosition(jointElement.id as string, {
      x: position.x,
      y: position.y
    });
    
    // Resetear flag después de un pequeño delay
    setTimeout(() => {
      this.isUpdatingFromJoint = false;
    }, 10);
  });

  // Evento cuando se termina de mover un elemento
  this.paper.on('element:pointerup', (elementView: joint.dia.ElementView) => {
    // Aquí podrías guardar el estado si es necesario
    console.log('Elemento movido:', elementView.model.id);
  });

  // Evento de clic en magnet para conexiones
  this.paper.on('element:magnet:pointerclick', (elementView: joint.dia.ElementView, evt: any, magnet: any) => {
    if (this.connectionMode.active) {
      const elementId = elementView.model.id as string;
      const portName = magnet.getAttribute('port') || 'center';
      
      if (!this.connectionMode.startPoint) {
        this.diagramService.setConnectionStart(elementId, portName);
      } else {
        this.diagramService.completeConnection(elementId, portName);
      }
    }
  });

  // Evento de clic en área vacía
  this.paper.on('blank:pointerclick', () => {
    this.diagramService.deselectElement();
    this.selectedJointElement = null;
    this.selectedElement = null;
    this.hidePropertiesPanel();
    this.removeAllHighlights();
    
    // Si está en modo conexión, cancelar la conexión
    if (this.connectionMode.active && this.connectionMode.startPoint) {
      this.diagramService.cancelConnection();
    }
  });

  // Eventos para mejorar las conexiones
  this.setupConnectionEventHandlers();

  // Eventos de drag & drop
  this.setupDragDropHandlers();
}

// NUEVO: Método para resaltar visualmente el elemento seleccionado
private highlightSelectedElement(elementView: joint.dia.ElementView): void {
  // Remover highlight anterior
  this.removeAllHighlights();
  
  // Agregar clase CSS para highlight
  elementView.el.classList.add('selected-element');
}

// NUEVO: Método para remover todos los highlights
private removeAllHighlights(): void {
  const highlightedElements = this.diagramContainer.nativeElement.querySelectorAll('.selected-element');
  highlightedElements.forEach(el => el.classList.remove('selected-element'));
}

  /**
   * Configura eventos específicos para las conexiones
   */
  private setupConnectionEventHandlers(): void {
    // Evento cuando se crea una nueva conexión
    this.graph.on('add', (cell: joint.dia.Cell) => {
      if (cell.isLink()) {
        const link = cell as joint.dia.Link;
        const source = link.getSourceElement();
        const target = link.getTargetElement();
        
        if (source && target) {
          // Solo crear la conexión si no existe en el estado
          const existingConnection = this.currentDiagramState.connections.find(
            conn => conn.source.elementId === source.id && conn.target.elementId === target.id
          );
          
          if (!existingConnection) {
            this.isUpdatingFromJoint = true;
            this.diagramService.addConnection(
              source.id as string,
              'right', // Puerto por defecto
              target.id as string,
              'left'   // Puerto por defecto
            );
            setTimeout(() => {
              this.isUpdatingFromJoint = false;
            }, 10);
          }
        }
      }
    });

    // Evento cuando se elimina una conexión
    this.graph.on('remove', (cell: joint.dia.Cell) => {
      if (cell.isLink()) {
        const linkId = cell.id as string;
        const existingConnection = this.currentDiagramState.connections.find(
          conn => conn.id === linkId
        );
        
        if (existingConnection) {
          this.isUpdatingFromJoint = true;
          this.diagramService.removeConnection(linkId);
          setTimeout(() => {
            this.isUpdatingFromJoint = false;
          }, 10);
        }
      }
    });
  }

  /**
   * Configura los handlers para drag & drop
   */
  private setupDragDropHandlers(): void {
    const container = this.diagramContainer.nativeElement;

    container.addEventListener('dragover', (event) => {
      event.preventDefault();
      event.dataTransfer!.dropEffect = 'copy';
    });

    container.addEventListener('drop', (event) => {
      event.preventDefault();
      const dragData = JSON.parse(event.dataTransfer!.getData('text/plain')) as DragDropData;
      
      const rect = container.getBoundingClientRect();
      const position: Position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };

      this.diagramService.addElement(dragData, position);
    });
  }

  /**
   * Actualiza el diagrama Joint.js basado en el estado del servicio
   * MEJORADO: Solo actualiza lo que ha cambiado
   */
  private updateJointDiagram(): void {
    if (!this.graph) {
      console.warn('Graph no está inicializado aún');
      return;
    }

    // Actualizar elementos existentes y agregar nuevos
    this.updateElements();
    
    // Actualizar conexiones existentes y agregar nuevas
    this.updateConnections();
    
    // Remover elementos que ya no existen
    this.removeObsoleteElements();
    
    // Remover conexiones que ya no existen
    this.removeObsoleteConnections();
  }

  /**
   * Actualiza solo los elementos que han cambiado
   */
  private updateElements(): void {
    this.currentDiagramState.elements.forEach(element => {
      const existingJointElement = this.jointElements.get(element.id);
      
      if (existingJointElement) {
        // Actualizar elemento existente solo si es necesario
        const currentPos = existingJointElement.position();
        if (currentPos.x !== element.position.x || currentPos.y !== element.position.y) {
          existingJointElement.position(element.position.x, element.position.y);
        }
        
        // Actualizar otros atributos si es necesario
        this.updateElementAttributes(existingJointElement, element);
      } else {
        // Crear nuevo elemento
        const jointElement = this.createJointElement(element);
        this.graph.addCell(jointElement);
        this.jointElements.set(element.id, jointElement);
      }
    });
  }

  /**
   * Actualiza solo las conexiones que han cambiado
   */
  private updateConnections(): void {
    this.currentDiagramState.connections.forEach(connection => {
      const existingJointConnection = this.jointConnections.get(connection.id);
      
      if (!existingJointConnection) {
        // Crear nueva conexión
        const jointLink = this.createJointLink(connection);
        if (jointLink) {
          this.graph.addCell(jointLink);
          this.jointConnections.set(connection.id, jointLink);
        }
      }
      // Las conexiones existentes generalmente no necesitan actualizarse
      // a menos que cambien sus atributos visuales
    });
  }

  /**
   * Remueve elementos que ya no existen en el estado
   */
  private removeObsoleteElements(): void {
    const currentElementIds = new Set(this.currentDiagramState.elements.map(el => el.id));
    
    for (const [elementId, jointElement] of this.jointElements.entries()) {
      if (!currentElementIds.has(elementId)) {
        jointElement.remove();
        this.jointElements.delete(elementId);
      }
    }
  }

  /**
   * Remueve conexiones que ya no existen en el estado
   */
  private removeObsoleteConnections(): void {
    const currentConnectionIds = new Set(this.currentDiagramState.connections.map(conn => conn.id));
    
    for (const [connectionId, jointConnection] of this.jointConnections.entries()) {
      if (!currentConnectionIds.has(connectionId)) {
        jointConnection.remove();
        this.jointConnections.delete(connectionId);
      }
    }
  }

  /**
   * Actualiza los atributos visuales de un elemento
   */
  private updateElementAttributes(jointElement: joint.dia.Element, element: DiagramElement): void {
    // Actualizar solo si hay cambios en los atributos visuales
    
    // Ejemplo de actualización de texto
    if (element.attributes.name) {
      jointElement.attr('label/text', element.attributes.name);
    }
    
    // Ejemplo de actualización de colores
    if (element.attributes.fill) {
      jointElement.attr('body/fill', element.attributes.fill);
    }
    
    if (element.attributes.stroke) {
      jointElement.attr('body/stroke', element.attributes.stroke);
    }

    // Actualizar tamaño
    const currentSize = jointElement.size();
    if (currentSize.width !== element.size.width || currentSize.height !== element.size.height) {
      jointElement.resize(element.size.width, element.size.height);
    }
  }

  /**
   * Crea un elemento Joint.js basado en DiagramElement
   */
  private createJointElement(element: DiagramElement): joint.dia.Element {
    const { position, size, attributes } = element;

    let jointElement: joint.dia.Element;

    switch (element.type) {
      case 'component':
        jointElement = new joint.shapes.standard.Rectangle({
          id: element.id,
          position: { x: position.x, y: position.y },
          size: { width: size.width, height: size.height },
          attrs: {
            root: {
              title: attributes.name || 'Component'
            },
            body: {
              fill: attributes.fill || '#ffffff',
              stroke: attributes.stroke || '#333333',
              strokeWidth: attributes.strokeWidth || 1
            },
            label: {
              text: attributes.headerText || attributes.name || 'Component',
              fontSize: 14,
              fontFamily: 'Arial',
              textWrap: {
                width: size.width - 20,
                height: size.height - 20
              }
            }
          },
          ports: {
            groups: {
              'in': {
                position: 'left',
                attrs: {
                  circle: {
                    fill: '#31d0c6',
                    stroke: '#31d0c6',
                    strokeWidth: 2,
                    r: 8,
                    magnet: true
                  }
                }
              },
              'out': {
                position: 'right',
                attrs: {
                  circle: {
                    fill: '#fe854f',
                    stroke: '#fe854f',
                    strokeWidth: 2,
                    r: 8,
                    magnet: true
                  }
                }
              }
            },
            items: [
              { group: 'in', id: 'left' },
              { group: 'out', id: 'right' }
            ]
          }
        });
        break;

      case 'interface':
        jointElement = new joint.shapes.standard.Circle({
          id: element.id,
          position: { x: position.x, y: position.y },
          size: { width: size.width, height: size.height },
          attrs: {
            body: {
              fill: attributes.fill || '#e3f2fd',
              stroke: attributes.stroke || '#2196f3',
              strokeWidth: attributes.strokeWidth || 2
            },
            label: {
              text: attributes.name || 'Interface',
              fontSize: 10,
              fontFamily: 'Arial'
            }
          },
          ports: {
            groups: {
              'default': {
                position: 'center',
                attrs: {
                  circle: {
                    fill: '#2196f3',
                    stroke: '#2196f3',
                    strokeWidth: 1,
                    r: 4,
                    magnet: true
                  }
                }
              }
            },
            items: [
              { group: 'default', id: 'center' }
            ]
          }
        });
        break;

      case 'port':
        jointElement = new joint.shapes.standard.Rectangle({
          id: element.id,
          position: { x: position.x, y: position.y },
          size: { width: size.width, height: size.height },
          attrs: {
            body: {
              fill: attributes.fill || '#fff9c4',
              stroke: attributes.stroke || '#f9a825',
              strokeWidth: attributes.strokeWidth || 1
            },
            label: {
              text: attributes.name || 'Port',
              fontSize: 8,
              fontFamily: 'Arial'
            }
          }
        });
        break;

      default:
        jointElement = new joint.shapes.standard.Rectangle({
          id: element.id,
          position: { x: position.x, y: position.y },
          size: { width: size.width, height: size.height }
        });
    }

    return jointElement;
  }

  /**
   * Crea un link Joint.js basado en Connection
   */
  private createJointLink(connection: Connection): joint.dia.Link | null {
    const sourceElement = this.jointElements.get(connection.source.elementId);
    const targetElement = this.jointElements.get(connection.target.elementId);

    if (!sourceElement || !targetElement) {
      console.warn('Elementos no encontrados para la conexión:', connection.id);
      return null;
    }

    const link = new joint.shapes.standard.Link({
      id: connection.id,
      source: { 
        id: connection.source.elementId,
        port: connection.source.port
      },
      target: { 
        id: connection.target.elementId,
        port: connection.target.port
      },
      attrs: {
        line: {
          stroke: connection.attributes.stroke || '#333333',
          strokeWidth: connection.attributes.strokeWidth || 2,
          strokeDasharray: connection.attributes.strokeDasharray || 'none'
        }
      }
    });

    // Configurar marcadores de flecha
    if (connection.attributes.arrowType !== 'none') {
      link.attr('line/targetMarker', {
        type: 'path',
        d: 'M 10 -5 0 0 10 5 z',
        fill: connection.attributes.stroke || '#333333'
      });
    }

    return link;
  }

  /**
   * Actualiza el nivel de zoom
   */
  private updateZoomLevel(): void {
    if (this.paper) {
      this.paper.scale(this.zoomControls.level);
    }
  }

  /**
   * Actualiza la UI del modo de conexión
   */
  private updateConnectionModeUI(): void {
    const container = this.diagramContainer.nativeElement;
    
    if (this.connectionMode.active) {
      container.classList.add('connection-mode');
      if (this.paper && this.paper.el) {
        this.paper.el.style.cursor = 'crosshair';
      }
    } else {
      container.classList.remove('connection-mode');
      if (this.paper && this.paper.el) {
        this.paper.el.style.cursor = 'default';
      }
    }
  }

  /**
   * Valida una conexión en Joint.js
   */
  private validateJointConnection(
    sourceView: joint.dia.CellView, 
    targetView: joint.dia.CellView
  ): boolean {
    // No permitir conexiones del mismo elemento a sí mismo
    if (sourceView.model.id === targetView.model.id) {
      return false;
    }

    const sourceElement = this.findDiagramElementById(sourceView.model.id as string);
    const targetElement = this.findDiagramElementById(targetView.model.id as string);
    
    if (!sourceElement || !targetElement) {
      return false;
    }

    // Verificar que no existe ya una conexión entre estos elementos
    const existingConnection = this.currentDiagramState.connections.find(
      conn => (conn.source.elementId === sourceElement.id && conn.target.elementId === targetElement.id) ||
               (conn.source.elementId === targetElement.id && conn.target.elementId === sourceElement.id)
    );

    return !existingConnection;
  }

  /**
   * Sale del modo de conexión
   */
  private exitConnectMode(): void {
    this.connectMode = false;
    this.isConnecting = false;
    this.connectingElement = null;
    
    if (this.diagramContainer?.nativeElement) {
      const connectingElements = this.diagramContainer.nativeElement.querySelectorAll('.connecting-element');
      connectingElements.forEach((el: Element) => el.classList.remove('connecting-element'));
    }
    
    const guide = document.getElementById('connection-guide');
    if (guide) {
      guide.classList.remove('active');
    }
    
    const btn = document.getElementById('connect-mode-btn');
    if (btn) {
      btn.classList.remove('active');
    }
    
    document.body.classList.remove('magnet-mode');
    
    this.diagramService.toggleConnectionMode();
  }

  /**
   * Muestra el panel de propiedades
   */
  private showPropertiesPanel(): void {
    this.isPropertiesPanelVisible = true;
  }

  /**
   * Oculta el panel de propiedades
   */
  private hidePropertiesPanel(): void {
    this.isPropertiesPanelVisible = false;
  }

  /**
   * Exporta el diagrama
   */
  private exportDiagram(): void {
    if (!this.paper) {
      console.warn('No hay diagrama para exportar');
      return;
    }

    try {
      const svg = this.paper.svg;
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `diagram-${new Date().toISOString().slice(0, 10)}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      console.log('Diagrama exportado exitosamente');
    } catch (error) {
      console.error('Error al exportar diagrama:', error);
    }
  }

  /**
   * Maneja acciones de la toolbar
   */
  onToolAction(action: ToolbarAction): void {
    switch (action.type) {
      case 'select':
        if (this.connectMode) {
          this.exitConnectMode();
        }
        break;
      
      case 'move':
        console.log('Modo mover activado');
        break;
      
      case 'delete':
        if (this.selectedJointElement) {
          this.selectedJointElement.remove();
          this.hidePropertiesPanel();
          this.selectedJointElement = null;
          this.selectedElement = null;
        }
        break;
      
      case 'undo':
        console.log('Deshacer acción');
        break;
      
      case 'redo':
        console.log('Rehacer acción');
        break;
      
      case 'export':
        this.exportDiagram();
        break;
      
      case 'save':
        console.log('Guardando diagrama');
        break;
      
      default:
        console.log('Acción no implementada:', action.type);
    }
  }

  /**
   * Maneja el toggle del modo de conexión desde el FAB
   */
  onConnectionToggle(): void {
    if (this.connectionMode.active) {
      this.exitConnectMode();
    } else {
      this.connectMode = true;
      this.diagramService.toggleConnectionMode();
    }
  }

  /**
   * Maneja las actualizaciones de propiedades desde el panel de propiedades
   */
  onPropertyUpdate(update: PropertyUpdate): void {
    this.diagramService.updateElementProperty(
      update.elementId, 
      update.property, 
      update.value
    );
  }

  /**
   * Maneja la eliminación de elementos desde el panel de propiedades
   */
  onElementDelete(elementId: string): void {
    this.diagramService.removeElement(elementId);
    this.hidePropertiesPanel();
    this.selectedElement = null;
    this.selectedJointElement = null;
  }

  /**
   * Maneja la duplicación de elementos desde el panel de propiedades
   */
  onElementDuplicate(element: DiagramElement): void {
    // Crear un offset para el elemento duplicado
    const offset = { x: 20, y: 20 };
    const duplicatedElement: DiagramElement = {
      ...element,
      id: this.generateId(), // Método para generar un ID único
      position: {
        x: element.position.x + offset.x,
        y: element.position.y + offset.y
      },
      attributes: {
        ...element.attributes,
        name: `${element.attributes.name || element.type} (Copia)`
      }
    };

    this.diagramService.addElementFromData(duplicatedElement);
  }

  /**
   * Maneja el cierre del panel de propiedades
   */
  onPropertiesPanelClose(): void {
    this.hidePropertiesPanel();
    this.diagramService.deselectElement();
    this.selectedElement = null;
    this.selectedJointElement = null;
  }

  /**
   * Genera un ID único para elementos
   */
  private generateId(): string {
    return 'element-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Busca un elemento del diagrama por ID
   */
  private findDiagramElementById(id: string): DiagramElement | null {
    return this.currentDiagramState.elements.find(el => el.id === id) || null;
  }

  /**
   * Busca una conexión por ID
   */
  private findConnectionById(id: string): Connection | null {
    return this.currentDiagramState.connections.find(conn => conn.id === id) || null;
  }

  /**
   * Limpia recursos
   */
  private cleanup(): void {
    if (this.paper) {
      this.paper.remove();
    }
    if (this.graph) {
      this.graph.clear();
    }
  }

  // Métodos públicos para el template
  
  get isConnectionModeActive(): boolean {
    return this.connectionMode.active;
  }

  get connectionIndicator(): string {
    return this.connectionMode.indicator;
  }

get currentZoomPercentage(): number {
    return Math.round(this.zoomControls.level * 100);
  }

  /**
   * Controles de zoom
   */
  onZoomIn(): void {
    this.diagramService.zoomIn();
  }

  onZoomOut(): void {
    this.diagramService.zoomOut();
  }

  onZoomReset(): void {
    this.diagramService.resetZoom();
  }

  onZoomFit(): void {
    if (this.paper) {
      this.paper.scaleContentToFit({ padding: 20 });
      const currentScale = this.paper.scale();
      this.diagramService.setZoomLevel(currentScale.sx);
    }
  }

  /**
   * Maneja el evento de rueda del mouse para zoom
   */
  onWheel(event: WheelEvent): void {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      
      const delta = event.deltaY > 0 ? -0.1 : 0.1;
      const newLevel = Math.max(
        this.zoomControls.min, 
        Math.min(this.zoomControls.max, this.zoomControls.level + delta)
      );
      
      this.diagramService.setZoomLevel(newLevel);
    }
  }

  /**
   * Maneja el evento de redimensionado de la ventana
   */
  onWindowResize(): void {
    if (this.paper) {
      const container = this.diagramContainer.nativeElement;
      this.paper.setDimensions(container.clientWidth, container.clientHeight);
    }
  }

  /**
   * Centra el diagrama en la vista
   */
centerDiagram(): void {
  if (!this.paper || !this.graph) {
    console.warn('Paper o Graph no están inicializados');
    return;
  }

  const cells = this.graph.getCells();
  if (cells.length === 0) {
    console.warn('No hay elementos en el diagrama para centrar');
    return;
  }

  try {
    const bbox = this.graph.getBBox();
    
    // Verificar que bbox no es null antes de usarlo
    if (!bbox || bbox.width === 0 || bbox.height === 0) {
      console.warn('No se pudo obtener un bounding box válido del diagrama');
      return;
    }
    
    const paperSize = this.paper.getComputedSize();
    
    // Verificar que el paper tiene dimensiones válidas
    if (paperSize.width === 0 || paperSize.height === 0) {
      console.warn('El paper no tiene dimensiones válidas');
      return;
    }
    
    const centerX = (paperSize.width - bbox.width) / 2 - bbox.x;
    const centerY = (paperSize.height - bbox.height) / 2 - bbox.y;
    
    // Mover todos los elementos para centrar el diagrama
    cells.forEach(cell => {
      if (cell.isElement()) {
        const currentPos = cell.position();
        cell.position(currentPos.x + centerX, currentPos.y + centerY);
      }
    });
    
    this.debugLog('Diagrama centrado exitosamente');
  } catch (error) {
    console.error('Error al centrar el diagrama:', error);
  }
}

  /**
   * Obtiene información del diagrama para debugging
   */
  getDiagramInfo(): any {
    return {
      elements: this.currentDiagramState.elements.length,
      connections: this.currentDiagramState.connections.length,
      zoomLevel: this.zoomControls.level,
      selectedElement: this.selectedElement?.id || null,
      connectionMode: this.connectionMode.active
    };
  }

  /**
   * Método para logging de debugging (puede ser removido en producción)
   */
  private debugLog(message: string, data?: any): void {
    if (data) {
      console.log(`[DiagramadorComponentes] ${message}`, data);
    } else {
      console.log(`[DiagramadorComponentes] ${message}`);
    }
  }
}