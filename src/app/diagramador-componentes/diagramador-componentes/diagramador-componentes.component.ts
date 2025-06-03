import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as joint from 'jointjs';
import { Subscription } from 'rxjs';

import { DiagramService } from '../../service/diagramador-componentes/diagramador-componentes.service';
import { ToolbarComponent } from "../../toolbar/toolbar.component";
import { AsideComponent } from '../aside/aside.component';
import {
  Connection,
  ConnectionMode,
  DiagramElement,
  DiagramState,
  DragDropData,
  Position,
  ToolAction,
  ZoomControls
} from '../interfaces/diagram.interfaces';

@Component({
  selector: 'app-diagramador-componentes',
  standalone: true,
  imports: [AsideComponent, ToolbarComponent, CommonModule],
  templateUrl: './diagramador-componentes.component.html',
  styleUrl: './diagramador-componentes.component.css'
})
export class DiagramadorComponentesComponent implements OnInit, OnDestroy, AfterViewInit {
  
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

  // Suscripciones
  private subscriptions: Subscription[] = [];
  
  // Elementos Joint.js mapeados
  private jointElements = new Map<string, joint.dia.Element>();
  private jointConnections = new Map<string, joint.dia.Link>();

  constructor(private diagramService: DiagramService) {}

  ngOnInit(): void {
    this.initializeSubscriptions();
  }

  ngAfterViewInit(): void {
    this.initializeJointJS();
    this.setupEventHandlers();
      this.initializeSubscriptions(); // Mover esto aquí, después de que Joint.js esté inicializado

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
      this.currentDiagramState = state;
      this.updateJointDiagram();
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
      }
    });

    // Evento de clic en conexión
    this.paper.on('link:pointerclick', (linkView: joint.dia.LinkView) => {
      const connection = this.findConnectionById(linkView.model.id as string);
      if (connection) {
        this.diagramService.selectElement(connection);
      }
    });

    // Evento de arrastrar elemento
    this.paper.on('element:pointermove', (elementView: joint.dia.ElementView) => {
      const jointElement = elementView.model;
      const position = jointElement.position();
      
      this.diagramService.updateElement(jointElement.id as string, {
        position: { x: position.x, y: position.y }
      });
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
    });

    // Eventos de drag & drop
    this.setupDragDropHandlers();
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
   */
  private updateJointDiagram(): void {
    this.graph.clear();
    this.jointElements.clear();
    this.jointConnections.clear();

    // Agregar elementos
    this.currentDiagramState.elements.forEach(element => {
      const jointElement = this.createJointElement(element);
      this.graph.addCell(jointElement);
      this.jointElements.set(element.id, jointElement);
    });

    // Agregar conexiones
    this.currentDiagramState.connections.forEach(connection => {
      const jointLink = this.createJointLink(connection);
      if (jointLink) {
        this.graph.addCell(jointLink);
        this.jointConnections.set(connection.id, jointLink);
      }
    });
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
    // Verificar que paper.el existe antes de usarlo
    if (this.paper && this.paper.el) {
      this.paper.el.style.cursor = 'crosshair';
    }
  } else {
    container.classList.remove('connection-mode');
    // Verificar que paper.el existe antes de usarlo
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
    const sourceElement = this.findDiagramElementById(sourceView.model.id as string);
    const targetElement = this.findDiagramElementById(targetView.model.id as string);
    
    if (!sourceElement || !targetElement) {
      return false;
    }

    return this.diagramService.getCurrentState().elements
      .some(el => el.id === sourceElement.id) && 
      this.diagramService.getCurrentState().elements
      .some(el => el.id === targetElement.id);
  }

  /**
   * Maneja acciones de la toolbar
   */
  onToolAction(action: ToolAction): void {
    this.diagramService.handleToolAction(action);
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

  /**
   * Métodos públicos para el template
   */
  
  get isConnectionModeActive(): boolean {
    return this.connectionMode.active;
  }

  get connectionIndicator(): string {
    return this.connectionMode.indicator;
  }

  get currentZoomPercentage(): string {
    return Math.round(this.zoomControls.level * 100) + '%';
  }

  get hasSelectedElement(): boolean {
    return !!this.currentDiagramState.selectedElement;
  }

  get selectedElementName(): string {
    const selected = this.currentDiagramState.selectedElement;
    if (selected && 'type' in selected) {
      return selected.attributes?.name || selected.type;
    }
    return '';
  }

  
}