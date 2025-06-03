import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { AsidedComponent } from '../asided/asided.component';

// Importaciones correctas de Joint.js
import { dia, shapes } from 'jointjs';

// Tipo más flexible que funciona con Joint.js
type DiagramElement = dia.Element | dia.Link;

@Component({
  selector: 'app-diagramador-secuencia',
  standalone: true,
  imports: [CommonModule, AsidedComponent, ToolbarComponent, FormsModule],
  templateUrl: './diagramador-secuencia.component.html',
  styleUrls: ['./diagramador-secuencia.component.css']
})
export class DiagramadorSecuenciaComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef;

  private graph!: dia.Graph;
  private paper!: dia.Paper;
  private selectedElement: DiagramElement | null = null;
  private connectMode = false;
  private connectingElement: DiagramElement | null = null;
  private isConnecting = false;
  private draggedElementType: string | null = null;

  // Definir formas personalizadas como propiedades estáticas
  private customShapes: any = {};

  ngAfterViewInit(): void {
    this.initializeJointJS();
    this.setupEventListeners();
    this.setupDragAndDrop();
    this.setupKeyboardShortcuts();
    this.resizeCanvas();
  }

  

  private initializeJointJS(): void {
    // Inicialización de Joint.js
    this.graph = new dia.Graph();
    this.paper = new dia.Paper({
      el: this.canvasRef.nativeElement,
      model: this.graph,
      width: '100%',
      height: '100%',
      gridSize: 20,
      drawGrid: true,
      background: {
        color: '#fafafa'
      },
      interactive: {
        linkMove: false
      },
      defaultLink: () => new shapes.standard.Link({
        attrs: {
          line: {
            stroke: '#1565c0',
            strokeWidth: 2,
            targetMarker: {
              type: 'path',
              d: 'M 10 -5 0 0 10 5 z',
              fill: '#1565c0'
            }
          }
        },
        labels: [{
          position: 0.5,
          attrs: {
            text: {
              text: 'mensaje()',
              fill: '#333',
              fontSize: 12,
              fontFamily: 'Poppins'
            },
            rect: {
              fill: 'white',
              stroke: '#ccc',
              strokeWidth: 1,
              rx: 3,
              ry: 3
            }
          }
        }]
      }),
      linkPinning: false,
      snapLabels: true,
      markAvailable: true,
      magnetThreshold: 'onleave',
      highlighting: {
        magnetAvailability: {
          name: 'addClass',
          options: {
            className: 'available-magnet'
          }
        }
      }
    });

    this.defineCustomShapes();
  }

  private defineCustomShapes(): void {
    // Definir formas personalizadas para diagramas de secuencia
    const sequenceShapes = {} as any;

    // Actor (Stickman)
    sequenceShapes.Actor = dia.Element.define('sequence.Actor', {
      size: { width: 100, height: 120 },
      ports: {
        groups: {
          'in': {
            position: { name: 'left' },
            attrs: {
              circle: {
                magnet: true,
                r: 6,
                fill: '#2962ff',
                stroke: 'white',
                strokeWidth: 2
              }
            }
          },
          'out': {
            position: { name: 'right' },
            attrs: {
              circle: {
                magnet: true,
                r: 6,
                fill: '#2962ff',
                stroke: 'white',
                strokeWidth: 2
              }
            }
          },
          'bottom': {
            position: { name: 'bottom' },
            attrs: {
              circle: {
                magnet: true,
                r: 6,
                fill: '#ff6b35',
                stroke: 'white',
                strokeWidth: 2
              }
            }
          }
        },
        items: [
          { group: 'in', id: 'in1' },
          { group: 'out', id: 'out1' },
          { group: 'bottom', id: 'bottom1' }
        ]
      },
      attrs: {
        head: {
          cx: 50, cy: 20, r: 15,
          stroke: '#2962ff', strokeWidth: 2, fill: '#ffffff'
        },
        body: {
          x1: 50, y1: 35, x2: 50, y2: 70,
          stroke: '#2962ff', strokeWidth: 2
        },
        leftArm: {
          x1: 50, y1: 45, x2: 30, y2: 60,
          stroke: '#2962ff', strokeWidth: 2
        },
        rightArm: {
          x1: 50, y1: 45, x2: 70, y2: 60,
          stroke: '#2962ff', strokeWidth: 2
        },
        leftLeg: {
          x1: 50, y1: 70, x2: 35, y2: 95,
          stroke: '#2962ff', strokeWidth: 2
        },
        rightLeg: {
          x1: 50, y1: 70, x2: 65, y2: 95,
          stroke: '#2962ff', strokeWidth: 2
        },
        label: {
          textVerticalAnchor: 'top', textAnchor: 'middle',
          x: 50, y: 105, fontSize: 12, fontFamily: 'Poppins', fill: '#333'
        }
      }
    }, {
      markup: [
        { tagName: 'circle', selector: 'head' },
        { tagName: 'line', selector: 'body' },
        { tagName: 'line', selector: 'leftArm' },
        { tagName: 'line', selector: 'rightArm' },
        { tagName: 'line', selector: 'leftLeg' },
        { tagName: 'line', selector: 'rightLeg' },
        { tagName: 'text', selector: 'label' }
      ]
    });

    // Sistema (Caja 3D)
    sequenceShapes.System = dia.Element.define('sequence.System', {
      size: { width: 120, height: 80 },
      ports: {
        groups: {
          'in': {
            position: { name: 'left' },
            attrs: {
              circle: {
                magnet: true, r: 6, fill: '#2962ff',
                stroke: 'white', strokeWidth: 2
              }
            }
          },
          'out': {
            position: { name: 'right' },
            attrs: {
              circle: {
                magnet: true, r: 6, fill: '#2962ff',
                stroke: 'white', strokeWidth: 2
              }
            }
          },
          'bottom': {
            position: { name: 'bottom' },
            attrs: {
              circle: {
                magnet: true, r: 6, fill: '#ff6b35',
                stroke: 'white', strokeWidth: 2
              }
            }
          }
        },
        items: [
          { group: 'in', id: 'in1' },
          { group: 'out', id: 'out1' },
          { group: 'bottom', id: 'bottom1' }
        ]
      },
      attrs: {
        frontFace: {
          width: 120, height: 80, stroke: '#2962ff', strokeWidth: 2,
          fill: '#e3f2fd', rx: 4, ry: 4
        },
        topFace: {
          points: '0,0 15,-10 135,-10 120,0',
          stroke: '#2962ff', strokeWidth: 2, fill: '#bbdefb'
        },
        rightFace: {
          points: '120,0 135,-10 135,70 120,80',
          stroke: '#2962ff', strokeWidth: 2, fill: '#90caf9'
        },
        label: {
          textVerticalAnchor: 'middle', textAnchor: 'middle',
          x: 60, y: 40, fontSize: 12, fontFamily: 'Poppins',
          fill: '#333', fontWeight: '500'
        }
      }
    }, {
      markup: [
        { tagName: 'rect', selector: 'frontFace' },
        { tagName: 'polygon', selector: 'topFace' },
        { tagName: 'polygon', selector: 'rightFace' },
        { tagName: 'text', selector: 'label' }
      ]
    });

    // Base de Datos (Cilindro)
    sequenceShapes.Database = dia.Element.define('sequence.Database', {
      size: { width: 100, height: 120 },
      ports: {
        groups: {
          'in': {
            position: { name: 'left' },
            attrs: {
              circle: {
                magnet: true, r: 6, fill: '#2962ff',
                stroke: 'white', strokeWidth: 2
              }
            }
          },
          'out': {
            position: { name: 'right' },
            attrs: {
              circle: {
                magnet: true, r: 6, fill: '#2962ff',
                stroke: 'white', strokeWidth: 2
              }
            }
          },
          'bottom': {
            position: { name: 'bottom' },
            attrs: {
              circle: {
                magnet: true, r: 6, fill: '#ff6b35',
                stroke: 'white', strokeWidth: 2
              }
            }
          }
        },
        items: [
          { group: 'in', id: 'in1' },
          { group: 'out', id: 'out1' },
          { group: 'bottom', id: 'bottom1' }
        ]
      },
      attrs: {
        topEllipse: {
          cx: 50, cy: 15, rx: 45, ry: 15,
          stroke: '#2962ff', strokeWidth: 2, fill: '#e3f2fd'
        },
        cylinder: {
          x: 5, y: 15, width: 90, height: 80,
          stroke: '#2962ff', strokeWidth: 2, fill: '#e3f2fd'
        },
        bottomEllipse: {
          cx: 50, cy: 95, rx: 45, ry: 15,
          stroke: '#2962ff', strokeWidth: 2, fill: '#bbdefb'
        },
        label: {
          textVerticalAnchor: 'top', textAnchor: 'middle',
          x: 50, y: 105, fontSize: 12, fontFamily: 'Poppins', fill: '#333'
        }
      }
    }, {
      markup: [
        { tagName: 'ellipse', selector: 'topEllipse' },
        { tagName: 'rect', selector: 'cylinder' },
        { tagName: 'ellipse', selector: 'bottomEllipse' },
        { tagName: 'text', selector: 'label' }
      ]
    });

    // Objeto Simple
    sequenceShapes.Object = dia.Element.define('sequence.Object', {
      size: { width: 120, height: 60 },
      ports: {
        groups: {
          'in': {
            position: { name: 'left' },
            attrs: {
              circle: {
                magnet: true, r: 6, fill: '#2962ff',
                stroke: 'white', strokeWidth: 2
              }
            }
          },
          'out': {
            position: { name: 'right' },
            attrs: {
              circle: {
                magnet: true, r: 6, fill: '#2962ff',
                stroke: 'white', strokeWidth: 2
              }
            }
          },
          'bottom': {
            position: { name: 'bottom' },
            attrs: {
              circle: {
                magnet: true, r: 6, fill: '#ff6b35',
                stroke: 'white', strokeWidth: 2
              }
            }
          }
        },
        items: [
          { group: 'in', id: 'in1' },
          { group: 'out', id: 'out1' },
          { group: 'bottom', id: 'bottom1' }
        ]
      },
      attrs: {
        body: {
          width: 120, height: 60, stroke: '#2962ff', strokeWidth: 2,
          fill: '#ffffff', rx: 8, ry: 8
        },
        label: {
          textVerticalAnchor: 'middle', textAnchor: 'middle',
          x: 60, y: 30, fontSize: 12, fontFamily: 'Poppins',
          fill: '#333', fontWeight: '500'
        }
      }
    }, {
      markup: [
        { tagName: 'rect', selector: 'body' },
        { tagName: 'text', selector: 'label' }
      ]
    });

    // Guardar las formas personalizadas
    this.customShapes = { sequence: sequenceShapes };
  }

  private setupEventListeners(): void {
    // Manejo de selección de elementos - Firma correcta con x, y coordinates
    this.paper.on('element:pointerclick', (elementView: dia.ElementView, evt: dia.Event, x: number, y: number) => {
      evt.stopPropagation();
      
      if (this.connectMode) {
        this.handleConnectMode(elementView);
        return;
      }

      this.selectElement(elementView.model);
    });

    // Manejo de clicks en enlaces - Firma correcta
    this.paper.on('link:pointerclick', (linkView: dia.LinkView, evt: dia.Event, x: number, y: number) => {
      evt.stopPropagation();
      this.selectElement(linkView.model);
    });

    // Manejo de clicks en área vacía - Sin coordenadas adicionales
    this.paper.on('blank:pointerclick', (evt: dia.Event, x: number, y: number) => {
      if (this.connectMode) {
        this.exitConnectMode();
        return;
      }
      this.deselectAllElements();
    });
  }

  private setupDragAndDrop(): void {
    // Configurar canvas para drop
    const canvas = this.canvasRef.nativeElement;
    
    canvas.addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault();
    });

    canvas.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault();
      const elementType = e.dataTransfer?.getData('text/plain');
      
      if (elementType) {
        // Obtener posición relativa al canvas
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.createElementAtPosition(elementType, x, y);
      }
    });
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'c' || e.key === 'C') {
        this.toggleConnectMode();
      } else if (e.key === 'Escape') {
        if (this.connectMode) {
          this.exitConnectMode();
        } else {
          this.deselectAllElements();
        }
      } else if (e.key === 'Delete' && this.selectedElement) {
        this.selectedElement.remove();
        this.hidePropertiesPanel();
      }
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const elementType = event.dataTransfer?.getData('text/plain');
    
    if (elementType) {
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      this.createElementAtPosition(elementType, x, y);
    }
  }

  private createElementAtPosition(type: string, x: number, y: number): void {
    let element: any;
    const position = { x: x - 60, y: y - 40 }; // Centrar elemento

    switch(type) {
      case 'actor':
        element = new this.customShapes.sequence.Actor({
          position: position,
          attrs: { label: { text: 'Actor' } }
        });
        break;
      case 'system':
        element = new this.customShapes.sequence.System({
          position: position,
          attrs: { label: { text: 'Sistema' } }
        });
        break;
      case 'database':
        element = new this.customShapes.sequence.Database({
          position: position,
          attrs: { label: { text: 'BD' } }
        });
        break;
      case 'object':
        element = new this.customShapes.sequence.Object({
          position: position,
          attrs: { label: { text: 'Objeto' } }
        });
        break;
      case 'lifeline':
        element = new shapes.standard.Rectangle({
          position: position,
          size: { width: 5, height: 300 },
          attrs: {
            body: {
              fill: 'none',
              stroke: '#2962ff',
              strokeWidth: 2,
              strokeDasharray: '5,5'
            }
          }
        });
        break;
      case 'activation':
        element = new shapes.standard.Rectangle({
          position: position,
          size: { width: 20, height: 80 },
          attrs: {
            body: {
              fill: '#e3f2fd',
              stroke: '#2962ff',
              strokeWidth: 2
            }
          }
        });
        break;
      case 'note':
        element = new shapes.standard.Rectangle({
          position: position,
          size: { width: 150, height: 80 },
          attrs: {
            body: {
              fill: '#fff3cd',
              stroke: '#856404',
              strokeWidth: 1,
              rx: 4,
              ry: 4
            },
            label: {
              text: 'Nota',
              fill: '#856404',
              fontSize: 12,
              fontFamily: 'Poppins'
            }
          }
        });
        break;
      case 'fragment':
        element = new shapes.standard.Rectangle({
          position: position,
          size: { width: 200, height: 150 },
          attrs: {
            body: {
              fill: 'rgba(41, 98, 255, 0.1)',
              stroke: '#2962ff',
              strokeWidth: 2,
              strokeDasharray: '10,5',
              rx: 8,
              ry: 8
            },
            label: {
              text: 'alt',
              fill: '#2962ff',
              fontSize: 14,
              fontFamily: 'Poppins',
              fontWeight: 'bold'
            }
          }
        });
        break;
    }

    if (element) {
      this.graph.addCell(element);
    }
  }

  private selectElement(element: DiagramElement): void {
    this.deselectAllElements();
    this.selectedElement = element;
    
    // Añadir clase de selección visual
    const elementView = this.paper.findViewByModel(element);
    if (elementView) {
      elementView.$el.addClass('selected');
    }
    
    this.showPropertiesPanel(element);
  }

  private deselectAllElements(): void {
    this.selectedElement = null;
    const elements = this.canvasRef.nativeElement.querySelectorAll('.joint-element, .joint-link');
    elements.forEach((el: Element) => el.classList.remove('selected'));
    this.hidePropertiesPanel();
  }

  private handleConnectMode(elementView: dia.ElementView): void {
    if (!this.isConnecting) {
      // Iniciar conexión
      this.connectingElement = elementView.model;
      this.isConnecting = true;
      elementView.$el.addClass('connecting-element');
      const guide = document.getElementById('connection-guide');
      if (guide) {
        guide.classList.add('active');
      }
    } else {
      // Completar conexión
      if (this.connectingElement && this.connectingElement !== elementView.model) {
        this.createConnection(this.connectingElement, elementView.model);
      }
      this.exitConnectMode();
    }
  }

  private createConnection(sourceElement: DiagramElement, targetElement: DiagramElement): void {
    const link = new shapes.standard.Link({
      source: { id: sourceElement.id },
      target: { id: targetElement.id },
      attrs: {
        line: {
          stroke: '#1565c0',
          strokeWidth: 2,
          targetMarker: {
            type: 'path',
            d: 'M 10 -5 0 0 10 5 z',
            fill: '#1565c0'
          }
        }
      },
      labels: [{
        position: 0.5,
        attrs: {
          text: {
            text: 'mensaje()',
            fill: '#333',
            fontSize: 12,
            fontFamily: 'Poppins'
          },
          rect: {
            fill: 'white',
            stroke: '#ccc',
            strokeWidth: 1,
            rx: 3,
            ry: 3
          }
        }
      }]
    });

    this.graph.addCell(link);
  }

  private exitConnectMode(): void {
    this.connectMode = false;
    this.isConnecting = false;
    this.connectingElement = null;
    const connectingElements = this.canvasRef.nativeElement.querySelectorAll('.connecting-element');
    connectingElements.forEach((el: Element) => el.classList.remove('connecting-element'));
    
    const guide = document.getElementById('connection-guide');
    if (guide) {
      guide.classList.remove('active');
    }
    
    const btn = document.getElementById('connect-mode-btn');
    if (btn) {
      btn.classList.remove('active');
    }
    
    document.body.classList.remove('magnet-mode');
  }

private showPropertiesPanel(element: DiagramElement): void {
  const panel = document.getElementById('properties-panel');
  if (panel) {
    panel.classList.add('active');
  }

  const noSelection = document.querySelector('.no-selection') as HTMLElement;
  const linkProperties = document.querySelector('.link-properties') as HTMLElement;
  const elementProperties = document.querySelector('.element-properties') as HTMLElement;
  const deleteButton = document.getElementById('delete-element') as HTMLElement;

  if (noSelection && linkProperties && elementProperties && deleteButton) {
    // Ocultar el mensaje de no selección
    noSelection.style.display = 'none';
    
    // Mostrar el botón de eliminar
    deleteButton.style.display = 'block';

    if (element instanceof dia.Link) {
      // Mostrar propiedades de enlace
      linkProperties.style.display = 'block';
      elementProperties.style.display = 'none';
      
      // Actualizar valores
      const messageText = document.getElementById('message-text') as HTMLInputElement;
      const labels = element.labels();
      if (messageText) {
        messageText.value = (labels && labels[0]?.attrs?.['text']?.text) || 'mensaje()';
      }
      
    } else if (element instanceof dia.Element) {
      // Mostrar propiedades de elemento
      elementProperties.style.display = 'block';
      linkProperties.style.display = 'none';
      
      // Actualizar valores
      const labelText = document.getElementById('element-label') as HTMLInputElement;
      const posX = document.getElementById('position-x') as HTMLInputElement;
      const posY = document.getElementById('position-y') as HTMLInputElement;
      const width = document.getElementById('size-width') as HTMLInputElement;
      const height = document.getElementById('size-height') as HTMLInputElement;
      
      if (labelText) labelText.value = element.attr('label/text') || 'Elemento';
      if (posX) posX.value = element.position().x.toString();
      if (posY) posY.value = element.position().y.toString();
      if (width) width.value = element.size().width.toString();
      if (height) height.value = element.size().height.toString();
    }
  }

  // Configurar eventos para los inputs
  this.setupPropertyEvents(element);
}

private hidePropertiesPanel(): void {
  const panel = document.getElementById('properties-panel');
  if (panel) {
    panel.classList.remove('active');
  }

  const noSelection = document.querySelector('.no-selection') as HTMLElement;
  const linkProperties = document.querySelector('.link-properties') as HTMLElement;
  const elementProperties = document.querySelector('.element-properties') as HTMLElement;
  const deleteButton = document.getElementById('delete-element') as HTMLElement;

  if (noSelection && linkProperties && elementProperties && deleteButton) {
    noSelection.style.display = 'block';
    linkProperties.style.display = 'none';
    elementProperties.style.display = 'none';
    deleteButton.style.display = 'none';
  }
}
 

  private setupPropertyEvents(element: DiagramElement): void {
    // Evento para cambiar etiqueta (solo para elementos)
    const labelInput = document.getElementById('element-label') as HTMLInputElement;
    if (labelInput && element instanceof dia.Element) {
      labelInput.addEventListener('input', () => {
        element.attr('label/text', labelInput.value);
      });
    }

    // Eventos para texto de mensaje (solo para links)
    const messageInput = document.getElementById('message-text') as HTMLInputElement;
    if (messageInput && element instanceof dia.Link) {
      messageInput.addEventListener('input', () => {
        element.label(0, { attrs: { text: { text: messageInput.value } } });
      });
    }

    // Eventos para posición (solo para elementos)
    const posXInput = document.getElementById('position-x') as HTMLInputElement;
    const posYInput = document.getElementById('position-y') as HTMLInputElement;
    if (posXInput && posYInput && element instanceof dia.Element) {
      posXInput.addEventListener('input', () => {
        const currentPos = element.position();
        element.position(parseInt(posXInput.value), currentPos.y);
      });
      posYInput.addEventListener('input', () => {
        const currentPos = element.position();
        element.position(currentPos.x, parseInt(posYInput.value));
      });
    }

    // Eventos para tamaño (solo para elementos)
    const widthInput = document.getElementById('size-width') as HTMLInputElement;
    const heightInput = document.getElementById('size-height') as HTMLInputElement;
    if (widthInput && heightInput && element instanceof dia.Element) {
      widthInput.addEventListener('input', () => {
        const currentSize = element.size();
        element.resize(parseInt(widthInput.value), currentSize.height);
      });
      heightInput.addEventListener('input', () => {
        const currentSize = element.size();
        element.resize(currentSize.width, parseInt(heightInput.value));
      });
    }

    // Eventos para colores (solo para elementos)
    const fillColorInput = document.getElementById('fill-color') as HTMLInputElement;
    if (fillColorInput && element instanceof dia.Element) {
      fillColorInput.addEventListener('input', () => {
        // Determinar el selector correcto basado en el tipo de elemento
        let selector = 'body';
        const elementType = element.get('type');
        if (elementType && elementType.includes('Actor')) selector = 'head';
        else if (elementType && elementType.includes('System')) selector = 'frontFace';
        else if (elementType && elementType.includes('Database')) selector = 'topEllipse';
        
        element.attr(`${selector}/fill`, fillColorInput.value);
      });
    }

    // Eventos para color de borde (solo para elementos)
    const strokeColorInput = document.getElementById('stroke-color') as HTMLInputElement;
    if (strokeColorInput && element instanceof dia.Element) {
      strokeColorInput.addEventListener('input', () => {
        // Determinar el selector correcto basado en el tipo de elemento
        let selector = 'body';
        const elementType = element.get('type');
        if (elementType && elementType.includes('Actor')) selector = 'head';
        else if (elementType && elementType.includes('System')) selector = 'frontFace';
        else if (elementType && elementType.includes('Database')) selector = 'topEllipse';
        
        element.attr(`${selector}/stroke`, strokeColorInput.value);
      });
    }

    // Eventos para color de línea (solo para links)
    const lineColorInput = document.getElementById('line-color') as HTMLInputElement;
    if (lineColorInput && element instanceof dia.Link) {
      lineColorInput.addEventListener('input', () => {
        element.attr('line/stroke', lineColorInput.value);
        element.attr('line/targetMarker/fill', lineColorInput.value);
      });
    }

    // Eventos para grosor de línea (solo para links)
    const lineWidthInput = document.getElementById('line-width') as HTMLInputElement;
    if (lineWidthInput && element instanceof dia.Link) {
      const rangeValue = lineWidthInput.parentElement?.querySelector('.range-value');
      lineWidthInput.addEventListener('input', () => {
        element.attr('line/strokeWidth', parseInt(lineWidthInput.value));
        if (rangeValue) {
          rangeValue.textContent = `${lineWidthInput.value}px`;
        }
      });
    }

    // Eventos para estilo de línea (solo para links)
    const lineStyleSelect = document.getElementById('line-style') as HTMLSelectElement;
    if (lineStyleSelect && element instanceof dia.Link) {
      lineStyleSelect.addEventListener('change', () => {
        if (lineStyleSelect.value === 'dashed') {
          element.attr('line/strokeDasharray', '5,5');
        } else {
          element.attr('line/strokeDasharray', 'none');
        }
      });
    }

    // Evento para eliminar elemento
    const deleteBtn = document.getElementById('delete-element');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
          element.remove();
          this.hidePropertiesPanel();
          this.selectedElement = null;
        }
      });
    }
  }

  toggleConnectMode(): void {
    this.connectMode = !this.connectMode;
    
    const btn = document.getElementById('connect-mode-btn');
    if (btn) {
      btn.classList.toggle('active', this.connectMode);
    }
    
    if (this.connectMode) {
      document.body.classList.add('magnet-mode');
      const guide = document.getElementById('connection-guide');
      if (guide) {
        guide.textContent = 'Modo conexión activo: Haz clic en dos elementos para conectarlos';
        guide.classList.add('active');
      }
    } else {
      this.exitConnectMode();
    }
  }

  zoomIn(): void {
    this.paper.scale(this.paper.scale().sx * 1.2, this.paper.scale().sy * 1.2);
  }

  zoomOut(): void {
    this.paper.scale(this.paper.scale().sx * 0.8, this.paper.scale().sy * 0.8);
  }

  resetZoom(): void {
    this.paper.scale(1, 1);
  }

  fitToContent(): void {
    this.paper.scaleContentToFit({ padding: 20 });
  }

  clearCanvas(): void {
    if (confirm('¿Estás seguro de que quieres limpiar todo el canvas?')) {
      this.graph.clear();
      this.hidePropertiesPanel();
      this.selectedElement = null;
    }
  }

  exportDiagram(): void {
    try {
      const json = this.graph.toJSON();
      const dataStr = JSON.stringify(json, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'diagrama-secuencia.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar el diagrama');
    }
  }

  importDiagram(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const json = JSON.parse(e.target.result);
          this.graph.fromJSON(json);
          this.hidePropertiesPanel();
          this.selectedElement = null;
        } catch (error) {
          console.error('Error al importar:', error);
          alert('Error al importar el diagrama. Verifica que el archivo sea válido.');
        }
      };
      reader.readAsText(file);
    }
    // Limpiar el input para permitir importar el mismo archivo nuevamente
    event.target.value = '';
  }

  exportAsImage(): void {
    try {
      // Obtener el SVG del paper
      const svg = this.paper.svg;
      const svgData = new XMLSerializer().serializeToString(svg);
      
      // Crear un canvas temporal
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Descargar como PNG
        const link = document.createElement('a');
        link.download = 'diagrama-secuencia.png';
        link.href = canvas.toDataURL();
        link.click();
      };
      
      const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
      const svgUrl = URL.createObjectURL(svgBlob);
      img.src = svgUrl;
    } catch (error) {
      console.error('Error al exportar imagen:', error);
      alert('Error al exportar como imagen');
    }
  }

  private resizeCanvas(): void {
    // Configurar el canvas para que se ajuste al contenedor
    const container = this.canvasRef.nativeElement.parentElement;
    if (container) {
      const resizeObserver = new ResizeObserver(() => {
        this.paper.setDimensions(container.clientWidth, container.clientHeight);
      });
      resizeObserver.observe(container);
    }
  }

  // Métodos para manejo de elementos desde la toolbar
  onElementDragStart(event: DragEvent, elementType: string): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', elementType);
      event.dataTransfer.effectAllowed = 'copy';
    }
    this.draggedElementType = elementType;
  }

  // Getters para el template
  get isConnectModeActive(): boolean {
    return this.connectMode;
  }

  get hasSelectedElement(): boolean {
    return this.selectedElement !== null;
  }

  get selectedElementType(): string {
    if (!this.selectedElement) return '';
    if (this.selectedElement instanceof dia.Link) return 'link';
    return 'element';
  }

  onToolAction(action: { type: string }): void {
  switch (action.type) {
    case 'select':
      // Desactivar modo conexión si está activo
      if (this.connectMode) {
        this.exitConnectMode();
      }
      break;
    
    case 'move':
      // Implementar lógica para modo mover
      break;
    
    case 'delete':
      if (this.selectedElement) {
        this.selectedElement.remove();
        this.hidePropertiesPanel();
        this.selectedElement = null;
      }
      break;
    
    case 'undo':
      // Implementar deshacer
      break;
    
    case 'redo':
      // Implementar rehacer
      break;
    
    case 'export':
      this.exportDiagram();
      break;
    
    case 'save':
      // Implementar guardar
      break;
    
    default:
      console.log('Acción no implementada:', action.type);
  }
}
}