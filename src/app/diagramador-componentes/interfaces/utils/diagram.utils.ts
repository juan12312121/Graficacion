// utils/diagram.utils.ts

import { ConnectionAttributes, DiagramElement, ElementTypeConfig, Position, Size } from '../diagram.interfaces';

export class DiagramUtils {
  
  // Configuraciones de tipos de componentes
  static readonly COMPONENT_TYPE_CONFIGS: Record<string, ElementTypeConfig> = {
    servidor: {
      headerText: 'Servidor',
      stereotype: '«servidor»',
      fill: '#f3e5f5',
      stroke: '#9c27b0'
    },
    cliente: {
      headerText: 'Cliente',
      stereotype: '«cliente»',
      fill: '#e8f5e8',
      stroke: '#2e7d32'
    },
    database: {
      headerText: 'Base de Datos',
      stereotype: '«database»',
      fill: '#fff3e0',
      stroke: '#f57c00'
    },
    servicio: {
      headerText: 'Servicio',
      stereotype: '«servicio»',
      fill: '#fce4ec',
      stroke: '#c2185b'
    }
  };

  // Configuraciones de tipos de interfaces
  static readonly INTERFACE_TYPE_CONFIGS: Record<string, ElementTypeConfig> = {
    provided: {
      headerText: 'Proveída',
      stereotype: '',
      fill: '#e8f5e8',
      stroke: '#2e7d32'
    },
    required: {
      headerText: 'Requerida',
      stereotype: '',
      fill: '#ffebee',
      stroke: '#d32f2f'
    },
    bidirectional: {
      headerText: 'Bidireccional',
      stereotype: '',
      fill: '#fff3e0',
      stroke: '#f57c00'
    }
  };

  // Tamaños por defecto
  static readonly DEFAULT_SIZES = {
    component: { width: 200, height: 120 },
    interface: { width: 60, height: 60 },
    port: { width: 14, height: 14 }
  };

  // Posiciones de magnets
  static readonly MAGNET_POSITIONS = {
    component: [
      { name: 'left', x: 0, y: 0.5 },
      { name: 'right', x: 1, y: 0.5 },
      { name: 'top', x: 0.5, y: 0 },
      { name: 'bottom', x: 0.5, y: 1 }
    ],
    interface: [
      { name: 'center', x: 0.5, y: 0.5 }
    ],
    port: [
      { name: 'center', x: 0.5, y: 0.5 }
    ]
  };

  /**
   * Convierte RGB a formato hexadecimal
   */
  static rgbToHex(rgb: string): string {
    if (rgb.charAt(0) === '#') return rgb;
    
    const result = rgb.match(/\d+/g);
    if (!result) return '#ffffff';
    
    return '#' + result.map(x => {
      const hex = parseInt(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * Genera un ID único para elementos
   */
  static generateId(): string {
    return 'elem_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Calcula la distancia entre dos puntos
   */
  static calculateDistance(point1: Position, point2: Position): number {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Verifica si un punto está dentro de un rectángulo
   */
  static isPointInRect(point: Position, rectPos: Position, size: Size): boolean {
    return point.x >= rectPos.x && 
           point.x <= rectPos.x + size.width &&
           point.y >= rectPos.y && 
           point.y <= rectPos.y + size.height;
  }

  /**
   * Calcula el centro de un elemento
   */
  static getElementCenter(element: DiagramElement): Position {
    return {
      x: element.position.x + element.size.width / 2,
      y: element.position.y + element.size.height / 2
    };
  }

  /**
   * Obtiene las posiciones de los magnets de un elemento
   */
  static getMagnetPositions(element: DiagramElement): Position[] {
    const magnets = this.MAGNET_POSITIONS[element.type] || [];
    return magnets.map(magnet => ({
      x: element.position.x + (element.size.width * magnet.x),
      y: element.position.y + (element.size.height * magnet.y)
    }));
  }

  /**
   * Valida si una conexión es válida
   */
  static validateConnection(sourceElement: DiagramElement, targetElement: DiagramElement): boolean {
    // No permitir auto-conexiones
    if (sourceElement.id === targetElement.id) {
      return false;
    }
    
    // Aquí se pueden agregar más reglas de validación
    return true;
  }

  /**
   * Calcula el zoom óptimo para mostrar todos los elementos
   */
  static calculateOptimalZoom(elements: DiagramElement[], containerSize: Size): number {
    if (elements.length === 0) return 1;

    // Calcular bounding box de todos los elementos
    const bounds = this.calculateBoundingBox(elements);
    
    // Calcular zoom para que quepa todo con un margen
    const margin = 50;
    const scaleX = (containerSize.width - margin * 2) / bounds.width;
    const scaleY = (containerSize.height - margin * 2) / bounds.height;
    
    return Math.min(scaleX, scaleY, 2); // Máximo zoom 2x
  }

  /**
   * Calcula el bounding box de una lista de elementos
   */
  static calculateBoundingBox(elements: DiagramElement[]): { x: number, y: number, width: number, height: number } {
    if (elements.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    elements.forEach(element => {
      minX = Math.min(minX, element.position.x);
      minY = Math.min(minY, element.position.y);
      maxX = Math.max(maxX, element.position.x + element.size.width);
      maxY = Math.max(maxY, element.position.y + element.size.height);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * Serializa el estado del diagrama para guardado
   */
  static serializeDiagram(elements: DiagramElement[], connections: any[]): string {
    return JSON.stringify({
      version: '1.0',
      timestamp: new Date().toISOString(),
      elements,
      connections
    }, null, 2);
  }

  /**
   * Deserializa el estado del diagrama desde JSON
   */
  static deserializeDiagram(jsonString: string): { elements: DiagramElement[], connections: any[] } | null {
    try {
      const data = JSON.parse(jsonString);
      return {
        elements: data.elements || [],
        connections: data.connections || []
      };
    } catch (error) {
      console.error('Error deserializing diagram:', error);
      return null;
    }
  }

  /**
   * Obtiene la configuración de estilo para un tipo de componente
   */
  static getComponentTypeConfig(type: string): ElementTypeConfig | null {
    return this.COMPONENT_TYPE_CONFIGS[type] || null;
  }

  /**
   * Obtiene la configuración de estilo para un tipo de interfaz
   */
  static getInterfaceTypeConfig(type: string): ElementTypeConfig | null {
    return this.INTERFACE_TYPE_CONFIGS[type] || null;
  }

  /**
   * Crea atributos de conexión por defecto
   */
  static createDefaultConnectionAttributes(): ConnectionAttributes {
    return {
      stroke: '#2962ff',
      strokeWidth: 2,
      strokeDasharray: 'none',
      markerTarget: 'M 10 0 L 0 5 L 10 10 z',
      arrowType: 'target',
      connectionType: 'solid'
    };
  }

  /**
   * Valida las coordenadas de posición
   */
  static validatePosition(position: Position): boolean {
    return typeof position.x === 'number' && 
           typeof position.y === 'number' && 
           !isNaN(position.x) && 
           !isNaN(position.y);
  }

  /**
   * Valida las dimensiones de tamaño
   */
  static validateSize(size: Size): boolean {
    return typeof size.width === 'number' && 
           typeof size.height === 'number' && 
           size.width > 0 && 
           size.height > 0;
  }

  /**
   * Crea un elemento con valores por defecto
   */
  static createDefaultElement(type: 'component' | 'interface' | 'port', position: Position): DiagramElement {
    const size = this.DEFAULT_SIZES[type];
    
    return {
      id: this.generateId(),
      type,
      position,
      size,
      attributes: {
        name: type.charAt(0).toUpperCase() + type.slice(1),
        description: `Descripción del ${type}`,
        fill: '#ffffff',
        stroke: '#90caf9',
        strokeWidth: 1
      }
    };
  }

  /**
   * Clona profundamente un elemento
   */
  static cloneElement(element: DiagramElement): DiagramElement {
    return JSON.parse(JSON.stringify(element));
  }

  /**
   * Formatea el porcentaje de zoom
   */
  static formatZoomPercentage(zoomLevel: number): string {
    return Math.round(zoomLevel * 100) + '%';
  }
}