// utils/diagram.utils.ts - VERSIÓN CORREGIDA CON TIPOS SEGUROS

import { ConnectionAttributes, DiagramElement, ElementTypeConfig, Position, Size } from '../diagram.interfaces';

export class DiagramUtils {
  static mapSidebarTypeToElement(tipo: string): {
    elementType: 'component' | 'interface' | 'port' | 'connector' | 'relation' | 'annotation';
    subType: string;
  } {
    // Dividimos sobre EL ÚLTIMO guión
    const lastDashIndex = tipo.lastIndexOf('-');
    let elementType: string;
    let subType: string;

    if (lastDashIndex > 0) {
      // Ejemplo: "server-component" => prefix = "server", suffix = "component"
      subType = tipo.substring(0, lastDashIndex);
      elementType = tipo.substring(lastDashIndex + 1);
    } else {
      // Ejemplo: "component" => elementType = "component", subType = "basic"
      elementType = tipo;
      subType = 'basic';
    }

    // Validamos que sea uno de los seis element types permitidos
    const validElementTypes = ['component', 'interface', 'port', 'connector', 'relation', 'annotation'];
    if (!validElementTypes.includes(elementType)) {
      throw new Error(
        `DiagramUtils.mapSidebarTypeToElement: tipo="${tipo}" no es un elementType válido.`
      );
    }

    return {
      elementType: elementType as 'component' | 'interface' | 'port' | 'connector' | 'relation' | 'annotation',
      subType,
    };
  }

  
  // Configuraciones de tipos de componentes con formas personalizadas
  static readonly COMPONENT_TYPE_CONFIGS: Record<string, ElementTypeConfig> = {
    servidor: {
      headerText: 'Servidor',
      stereotype: '«servidor»',
      fill: '#f3e5f5',
      stroke: '#9c27b0',
      shape: 'rectangle',
      icon: 'fas fa-server',
      size: { width: 180, height: 140 }
    },
    cliente: {
      headerText: 'Cliente',
      stereotype: '«cliente»',
      fill: '#e8f5e8',
      stroke: '#2e7d32',
      shape: 'hexagon',
      icon: 'fas fa-desktop',
      size: { width: 160, height: 120 }
    },
    database: {
      headerText: 'Base de Datos',
      stereotype: '«database»',
      fill: '#fff3e0',
      stroke: '#f57c00',
      shape: 'cylinder',
      icon: 'fas fa-database',
      size: { width: 140, height: 160 }
    },
    servicio: {
      headerText: 'Servicio',
      stereotype: '«servicio»',
      fill: '#fce4ec',
      stroke: '#c2185b',
      shape: 'ellipse',
      icon: 'fas fa-cogs',
      size: { width: 170, height: 110 }
    },
    subsistema: {
      headerText: 'Subsistema',
      stereotype: '«subsistema»',
      fill: '#e3f2fd',
      stroke: '#1976d2',
      shape: 'rectangle',
      icon: 'fas fa-cubes',
      size: { width: 200, height: 150 }
    },
    basic: {
      headerText: 'Componente',
      stereotype: '«componente»',
      fill: '#ffffff',
      stroke: '#90caf9',
      shape: 'rectangle',
      icon: 'fas fa-puzzle-piece',
      size: { width: 160, height: 100 }
    }
  };

  // Configuraciones de tipos de interfaces con formas específicas
  static readonly INTERFACE_TYPE_CONFIGS: Record<string, ElementTypeConfig> = {
    provided: {
      headerText: 'Proveída',
      stereotype: '«provided»',
      fill: '#e8f5e8',
      stroke: '#2e7d32',
      shape: 'circle',
      icon: 'fas fa-plus-circle',
      size: { width: 70, height: 70 }
    },
    required: {
      headerText: 'Requerida',
      stereotype: '«required»',
      fill: '#ffebee',
      stroke: '#d32f2f',
      shape: 'circle',
      icon: 'fas fa-minus-circle',
      size: { width: 70, height: 70 }
    },
    bidirectional: {
      headerText: 'Bidireccional',
      stereotype: '«bidirectional»',
      fill: '#fff3e0',
      stroke: '#f57c00',
      shape: 'diamond',
      icon: 'fas fa-exchange-alt',
      size: { width: 80, height: 80 }
    },
    basic: {
      headerText: 'Interfaz',
      stereotype: '«interface»',
      fill: '#e3f2fd',
      stroke: '#2196f3',
      shape: 'circle',
      icon: 'fas fa-circle',
      size: { width: 60, height: 60 }
    }
  };

  // Configuraciones para puertos con formas específicas
  static readonly PORT_TYPE_CONFIGS: Record<string, ElementTypeConfig> = {
    input: {
      headerText: 'Puerto Entrada',
      stereotype: '«input»',
      fill: '#e8f5e8',
      stroke: '#4caf50',
      shape: 'diamond',
      icon: 'fas fa-arrow-right',
      size: { width: 20, height: 20 }
    },
    output: {
      headerText: 'Puerto Salida',
      stereotype: '«output»',
      fill: '#ffebee',
      stroke: '#f44336',
      shape: 'diamond',
      icon: 'fas fa-arrow-left',
      size: { width: 20, height: 20 }
    },
    bidirectional: {
      headerText: 'Puerto Bidireccional',
      stereotype: '«bidirectional»',
      fill: '#fff3e0',
      stroke: '#ff9800',
      shape: 'diamond',
      icon: 'fas fa-arrows-alt-h',
      size: { width: 22, height: 22 }
    },
    basic: {
      headerText: 'Puerto',
      stereotype: '«port»',
      fill: '#fff9c4',
      stroke: '#f9a825',
      shape: 'circle',
      icon: 'fas fa-dot-circle',
      size: { width: 16, height: 16 }
    }
  };

  // Configuraciones para conectores con formas específicas
  static readonly CONNECTOR_TYPE_CONFIGS: Record<string, ElementTypeConfig> = {
    assembly: {
      headerText: 'Conector Assembly',
      stereotype: '«assembly»',
      fill: '#f1f8e9',
      stroke: '#689f38',
      shape: 'diamond',
      icon: 'fas fa-plug',
      size: { width: 90, height: 90 }
    },
    delegation: {
      headerText: 'Conector Delegación',
      stereotype: '«delegation»',
      fill: '#e8eaf6',
      stroke: '#3f51b5',
      shape: 'hexagon',
      icon: 'fas fa-share-alt',
      size: { width: 100, height: 80 }
    },
    basic: {
      headerText: 'Conector',
      stereotype: '«connector»',
      fill: '#f1f8e9',
      stroke: '#689f38',
      shape: 'diamond',
      icon: 'fas fa-plug',
      size: { width: 80, height: 80 }
    }
  };

  // Configuraciones para relaciones con formas específicas
  static readonly RELATION_TYPE_CONFIGS: Record<string, ElementTypeConfig> = {
    dependency: {
      headerText: 'Dependencia',
      stereotype: '«dependency»',
      fill: '#fce4ec',
      stroke: '#e91e63',
      shape: 'diamond',
      icon: 'fas fa-long-arrow-alt-right',
      size: { width: 120, height: 60 }
    },
    association: {
      headerText: 'Asociación',
      stereotype: '«association»',
      fill: '#e1f5fe',
      stroke: '#0277bd',
      shape: 'ellipse',
      icon: 'fas fa-link',
      size: { width: 100, height: 70 }
    },
    composition: {
      headerText: 'Composición',
      stereotype: '«composition»',
      fill: '#f3e5f5',
      stroke: '#7b1fa2',
      shape: 'diamond',
      icon: 'fas fa-cube',
      size: { width: 110, height: 65 }
    },
    aggregation: {
      headerText: 'Agregación',
      stereotype: '«aggregation»',
      fill: '#fff8e1',
      stroke: '#f57f17',
      shape: 'diamond',
      icon: 'fas fa-cubes',
      size: { width: 110, height: 65 }
    },
    basic: {
      headerText: 'Relación',
      stereotype: '«relation»',
      fill: '#fce4ec',
      stroke: '#e91e63',
      shape: 'ellipse',
      icon: 'fas fa-project-diagram',
      size: { width: 100, height: 60 }
    }
  };

  // Configuraciones para anotaciones con formas específicas
  static readonly ANNOTATION_TYPE_CONFIGS: Record<string, ElementTypeConfig> = {
    note: {
      headerText: 'Nota',
      stereotype: '«note»',
      fill: '#fffde7',
      stroke: '#fbc02d',
      shape: 'rectangle',
      icon: 'fas fa-sticky-note',
      size: { width: 150, height: 100 }
    },
    comment: {
      headerText: 'Comentario',
      stereotype: '«comment»',
      fill: '#f3e5f5',
      stroke: '#9c27b0',
      shape: 'ellipse',
      icon: 'fas fa-comment',
      size: { width: 140, height: 90 }
    },
    constraint: {
      headerText: 'Restricción',
      stereotype: '«constraint»',
      fill: '#ffebee',
      stroke: '#f44336',
      shape: 'hexagon',
      icon: 'fas fa-exclamation-triangle',
      size: { width: 130, height: 80 }
    },
    stereotype: {
      headerText: 'Estereotipo',
      stereotype: '«stereotype»',
      fill: '#e8f5e8',
      stroke: '#4caf50',
      shape: 'rectangle',
      icon: 'fas fa-tag',
      size: { width: 120, height: 70 }
    }
  };

  // Tamaños por defecto actualizados
  static readonly DEFAULT_SIZES = {
    component: { width: 180, height: 120 },
    interface: { width: 70, height: 70 },
    port: { width: 18, height: 18 },
    connector: { width: 85, height: 85 },
    relation: { width: 105, height: 65 },
    annotation: { width: 140, height: 85 }
  };

  // Posiciones de magnets mejoradas para cada forma
  static readonly MAGNET_POSITIONS = {
    component: [
      { name: 'left', x: 0, y: 0.5 },
      { name: 'right', x: 1, y: 0.5 },
      { name: 'top', x: 0.5, y: 0 },
      { name: 'bottom', x: 0.5, y: 1 },
      { name: 'top-left', x: 0.2, y: 0 },
      { name: 'top-right', x: 0.8, y: 0 },
      { name: 'bottom-left', x: 0.2, y: 1 },
      { name: 'bottom-right', x: 0.8, y: 1 }
    ],
    interface: [
      { name: 'center', x: 0.5, y: 0.5 },
      { name: 'left', x: 0, y: 0.5 },
      { name: 'right', x: 1, y: 0.5 },
      { name: 'top', x: 0.5, y: 0 },
      { name: 'bottom', x: 0.5, y: 1 }
    ],
    port: [
      { name: 'center', x: 0.5, y: 0.5 }
    ],
    connector: [
      { name: 'left', x: 0, y: 0.5 },
      { name: 'right', x: 1, y: 0.5 },
      { name: 'top', x: 0.5, y: 0 },
      { name: 'bottom', x: 0.5, y: 1 },
      { name: 'center', x: 0.5, y: 0.5 }
    ],
    relation: [
      { name: 'left', x: 0, y: 0.5 },
      { name: 'right', x: 1, y: 0.5 },
      { name: 'center', x: 0.5, y: 0.5 }
    ],
    annotation: [
      { name: 'center', x: 0.5, y: 0.5 },
      { name: 'left', x: 0, y: 0.5 },
      { name: 'right', x: 1, y: 0.5 }
    ]
  };

  // Configuraciones de estilos de conexión mejoradas
  static readonly CONNECTION_STYLES = {
    assembly: {
      stroke: '#4caf50',
      strokeWidth: 3,
      strokeDasharray: 'none',
      markerTarget: 'M 12 0 L 0 6 L 12 12 z',
      arrowType: 'target' as const,
      connectionType: 'solid' as const
    },
    delegation: {
      stroke: '#2196f3',
      strokeWidth: 2,
      strokeDasharray: '8,4',
      markerTarget: 'M 10 0 L 0 5 L 10 10 z',
      arrowType: 'target' as const,
      connectionType: 'dashed' as const
    },
    dependency: {
      stroke: '#ff9800',
      strokeWidth: 2,
      strokeDasharray: '6,3',
      markerTarget: 'M 10 0 L 0 5 L 10 10 z',
      arrowType: 'target' as const,
      connectionType: 'dashed' as const
    },
    association: {
      stroke: '#9c27b0',
      strokeWidth: 2,
      strokeDasharray: 'none',
      markerTarget: 'none',
      arrowType: 'none' as const,
      connectionType: 'solid' as const
    },
    composition: {
      stroke: '#f44336',
      strokeWidth: 3,
      strokeDasharray: 'none',
      markerTarget: 'M 0 5 L 10 0 L 20 5 L 10 10 z',
      arrowType: 'target' as const,
      connectionType: 'solid' as const
    },
    aggregation: {
      stroke: '#607d8b',
      strokeWidth: 2,
      strokeDasharray: 'none',
      markerTarget: 'M 0 5 L 10 0 L 20 5 L 10 10 z',
      arrowType: 'target' as const,
      connectionType: 'solid' as const
    },
    default: {
      stroke: '#2962ff',
      strokeWidth: 2,
      strokeDasharray: 'none',
      markerTarget: 'M 10 0 L 0 5 L 10 10 z',
      arrowType: 'target' as const,
      connectionType: 'solid' as const
    }
  };

  /**
   * Genera un path SVG para formas personalizadas
   */
  static generateShapePath(shape: string, width: number, height: number): string {
    const cx = width / 2;
    const cy = height / 2;
    const rx = width / 2;
    const ry = height / 2;

    switch (shape) {
      case 'rectangle':
        return `M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z`;
      
      case 'circle':
        return `M ${cx} 0 A ${rx} ${ry} 0 1 1 ${cx - 0.1} 0 Z`;
      
      case 'ellipse':
        return `M ${cx} 0 A ${rx} ${ry} 0 1 1 ${cx - 0.1} 0 Z`;
      
      case 'diamond':
        return `M ${cx} 0 L ${width} ${cy} L ${cx} ${height} L 0 ${cy} Z`;
      
      case 'hexagon':
        const hexPoints = [
          [width * 0.25, 0],
          [width * 0.75, 0],
          [width, height * 0.5],
          [width * 0.75, height],
          [width * 0.25, height],
          [0, height * 0.5]
        ];
        return `M ${hexPoints.map(p => p.join(' ')).join(' L ')} Z`;
      
      case 'cylinder':
        const ellipseHeight = height * 0.15;
        return `
          M 0 ${ellipseHeight} 
          A ${rx} ${ellipseHeight} 0 0 1 ${width} ${ellipseHeight}
          L ${width} ${height - ellipseHeight}
          A ${rx} ${ellipseHeight} 0 0 1 0 ${height - ellipseHeight}
          Z
          M 0 ${ellipseHeight}
          A ${rx} ${ellipseHeight} 0 0 0 ${width} ${ellipseHeight}
        `;
      
      default:
        return `M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z`;
    }
  }

  /**
   * Calcula puntos de conexión inteligentes basados en la forma
   */
  static getSmartConnectionPoint(element: DiagramElement, targetPosition: Position): Position {
    const elementCenter = this.getElementCenter(element);
    const shape = element.attributes.shape || 'rectangle';
    
    // Calcular el ángulo desde el centro del elemento hacia el punto objetivo
    const dx = targetPosition.x - elementCenter.x;
    const dy = targetPosition.y - elementCenter.y;
    const angle = Math.atan2(dy, dx);
    
    const { width, height } = element.size;
    const { x, y } = element.position;
    
    switch (shape) {
      case 'circle':
      case 'ellipse':
        const rx = width / 2;
        const ry = height / 2;
        return {
          x: elementCenter.x + Math.cos(angle) * rx,
          y: elementCenter.y + Math.sin(angle) * ry
        };
      
      case 'diamond':
        // Calcular intersección con los bordes del diamante
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        const diamondRatio = (width / 2) / (height / 2);
        
        if (absY * diamondRatio > absX) {
          // Intersección con bordes superior/inferior
          const t = (height / 2) / absY;
          return {
            x: elementCenter.x + dx * t,
            y: elementCenter.y + (dy > 0 ? height / 2 : -height / 2)
          };
        } else {
          // Intersección con bordes izquierdo/derecho
          const t = (width / 2) / absX;
          return {
            x: elementCenter.x + (dx > 0 ? width / 2 : -width / 2),
            y: elementCenter.y + dy * t
          };
        }
      
      case 'hexagon':
        // Simplificado: usar el punto más cercano de los 6 vértices
        const hexPoints = [
          { x: x + width * 0.25, y: y },
          { x: x + width * 0.75, y: y },
          { x: x + width, y: y + height * 0.5 },
          { x: x + width * 0.75, y: y + height },
          { x: x + width * 0.25, y: y + height },
          { x: x, y: y + height * 0.5 }
        ];
        
        let closestPoint = hexPoints[0];
        let minDistance = this.calculateDistance(targetPosition, closestPoint);
        
        for (const point of hexPoints) {
          const distance = this.calculateDistance(targetPosition, point);
          if (distance < minDistance) {
            minDistance = distance;
            closestPoint = point;
          }
        }
        
        return closestPoint;
      
      default: // rectangle y cylinder
        // Intersección con rectángulo
        const t = Math.min(
          (width / 2) / Math.abs(dx),
          (height / 2) / Math.abs(dy)
        );
        
        return {
          x: elementCenter.x + dx * t,
          y: elementCenter.y + dy * t
        };
    }
  }

  /**
   * Genera una ruta de conexión mejorada con curvas
   */
  static generateConnectionPath(
    startPoint: Position, 
    endPoint: Position, 
    connectionType: string = 'default'
  ): string {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Para conexiones cortas, usar línea recta
    if (distance < 50) {
      return `M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`;
    }
    
    // Para conexiones largas, usar curvas suaves
    const controlOffset = Math.min(distance * 0.3, 100);
    
    // Determinar la dirección principal
    if (Math.abs(dx) > Math.abs(dy)) {
      // Conexión principalmente horizontal
      const cp1x = startPoint.x + controlOffset * Math.sign(dx);
      const cp1y = startPoint.y;
      const cp2x = endPoint.x - controlOffset * Math.sign(dx);
      const cp2y = endPoint.y;
      
      return `M ${startPoint.x} ${startPoint.y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${endPoint.x} ${endPoint.y}`;
    } else {
      // Conexión principalmente vertical
      const cp1x = startPoint.x;
      const cp1y = startPoint.y + controlOffset * Math.sign(dy);
      const cp2x = endPoint.x;
      const cp2y = endPoint.y - controlOffset * Math.sign(dy);
      
      return `M ${startPoint.x} ${startPoint.y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${endPoint.x} ${endPoint.y}`;
    }
  }

  /**
   * Crea atributos de conexión mejorados según el tipo
   */
  static createConnectionAttributes(connectionType: string = 'default'): ConnectionAttributes {
    const style = (this.CONNECTION_STYLES as any)[connectionType] || this.CONNECTION_STYLES.default;
    return { ...style };
  }

  /**
   * Valida conexiones con reglas mejoradas
   */
  static validateConnection(sourceElement: DiagramElement, targetElement: DiagramElement): boolean {
    // No permitir auto-conexiones
    if (sourceElement.id === targetElement.id) {
      return false;
    }
    
    // Reglas específicas según tipo
    if (sourceElement.type === 'annotation' || targetElement.type === 'annotation') {
      return false;
    }
    
    // Reglas específicas para interfaces
    if (sourceElement.type === 'interface' && targetElement.type === 'interface') {
      // Solo permitir conexiones entre interfaces complementarias
      const sourceSubType = sourceElement.subType;
      const targetSubType = targetElement.subType;
      
      return (sourceSubType === 'provided' && targetSubType === 'required') ||
             (sourceSubType === 'required' && targetSubType === 'provided') ||
             (sourceSubType === 'bidirectional' || targetSubType === 'bidirectional');
    }
    
    // Puertos solo pueden conectarse a interfaces o componentes
    if (sourceElement.type === 'port') {
      return targetElement.type === 'interface' || targetElement.type === 'component';
    }
    
    if (targetElement.type === 'port') {
      return sourceElement.type === 'interface' || sourceElement.type === 'component';
    }
    
    return true;
  }

  // Mantener todos los métodos existentes...
  static rgbToHex(rgb: string): string {
    if (rgb.charAt(0) === '#') return rgb;
    
    const result = rgb.match(/\d+/g);
    if (!result) return '#ffffff';
    
    return '#' + result.map(x => {
      const hex = parseInt(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  static generateId(): string {
    return 'elem_' + Math.random().toString(36).substr(2, 9);
  }

  static calculateDistance(point1: Position, point2: Position): number {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static isPointInRect(point: Position, rectPos: Position, size: Size): boolean {
    return point.x >= rectPos.x && 
           point.x <= rectPos.x + size.width &&
           point.y >= rectPos.y && 
           point.y <= rectPos.y + size.height;
  }

  static getElementCenter(element: DiagramElement): Position {
    return {
      x: element.position.x + element.size.width / 2,
      y: element.position.y + element.size.height / 2
    };
  }

  static getMagnetPositions(element: DiagramElement): Position[] {
    const magnets = this.MAGNET_POSITIONS[element.type] || [];
    return magnets.map(magnet => ({
      x: element.position.x + (element.size.width * magnet.x),
      y: element.position.y + (element.size.height * magnet.y)
    }));
  }

  static calculateOptimalZoom(elements: DiagramElement[], containerSize: Size): number {
    if (elements.length === 0) return 1;

    const bounds = this.calculateBoundingBox(elements);
    const margin = 50;
    const scaleX = (containerSize.width - margin * 2) / bounds.width;
    const scaleY = (containerSize.height - margin * 2) / bounds.height;
    
    return Math.min(scaleX, scaleY, 2);
  }

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

  static serializeDiagram(elements: DiagramElement[], connections: any[]): string {
    return JSON.stringify({
      version: '1.0',
      timestamp: new Date().toISOString(),
      elements,
      connections
    }, null, 2);
  }

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

  static getElementTypeConfig(elementType: string, subType: string = 'basic'): ElementTypeConfig | null {
    switch (elementType) {
      case 'component':
        return this.COMPONENT_TYPE_CONFIGS[subType] || this.COMPONENT_TYPE_CONFIGS['basic'];
      case 'interface':
        return this.INTERFACE_TYPE_CONFIGS[subType] || this.INTERFACE_TYPE_CONFIGS['basic'];
      case 'port':
        return this.PORT_TYPE_CONFIGS[subType] || this.PORT_TYPE_CONFIGS['basic'];
      case 'connector':
        return this.CONNECTOR_TYPE_CONFIGS[subType] || this.CONNECTOR_TYPE_CONFIGS['basic'];
      case 'relation':
        return this.RELATION_TYPE_CONFIGS[subType] || this.RELATION_TYPE_CONFIGS['basic'];
      case 'annotation':
        return this.ANNOTATION_TYPE_CONFIGS[subType] || this.ANNOTATION_TYPE_CONFIGS['note'];
      default:
        return null;
    }
  }

  static getComponentTypeConfig(type: string): ElementTypeConfig | null {
    return this.COMPONENT_TYPE_CONFIGS[type] || null;
  }

  static getInterfaceTypeConfig(type: string): ElementTypeConfig | null {
    return this.INTERFACE_TYPE_CONFIGS[type] || null;
  }

  static createDefaultConnectionAttributes(): ConnectionAttributes {
    return this.createConnectionAttributes('default');
  }

  // Completar la función validatePosition que estaba incompleta
  static validatePosition(position: Position): boolean {
    return typeof position.x === 'number' && 
           typeof position.y === 'number' && 
           !isNaN(position.x) && 
           !isNaN(position.y) &&
           position.x >= 0 && 
           position.y >= 0;
  }

  /**
   * Valida el tamaño de un elemento
   */
 /**
   * Valida el tamaño de un elemento
   */
  static validateSize(size: Size): boolean {
    return typeof size.width === 'number' && 
           typeof size.height === 'number' && 
           !isNaN(size.width) && 
           !isNaN(size.height) &&
           size.width > 0 &&
           size.height > 0;
  }

  /**
   * Valida un elemento completo del diagrama
   */
  static validateElement(element: DiagramElement): boolean {
    return element &&
           typeof element.id === 'string' &&
           element.id.length > 0 &&
           typeof element.type === 'string' &&
           element.type.length > 0 &&
           this.validatePosition(element.position) &&
           this.validateSize(element.size);
  }

  /**
   * Encuentra el punto de magnet más cercano a una posición dada
   */
  static findClosestMagnet(element: DiagramElement, targetPosition: Position): Position {
    const magnets = this.getMagnetPositions(element);
    
    if (magnets.length === 0) {
      return this.getElementCenter(element);
    }

    let closestMagnet = magnets[0];
    let minDistance = this.calculateDistance(targetPosition, closestMagnet);

    for (const magnet of magnets) {
      const distance = this.calculateDistance(targetPosition, magnet);
      if (distance < minDistance) {
        minDistance = distance;
        closestMagnet = magnet;
      }
    }

    return closestMagnet;
  }

  /**
   * Normaliza un ángulo entre 0 y 2π
   */
  static normalizeAngle(angle: number): number {
    while (angle < 0) angle += 2 * Math.PI;
    while (angle >= 2 * Math.PI) angle -= 2 * Math.PI;
    return angle;
  }

  /**
   * Convierte grados a radianes
   */
  static degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Convierte radianes a grados
   */
  static radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  /**
   * Clona profundamente un elemento del diagrama
   */
  static cloneElement(element: DiagramElement): DiagramElement {
    return {
      ...element,
      id: this.generateId(), // Nuevo ID para el clon
      position: { ...element.position },
      size: { ...element.size },
      attributes: { ...element.attributes }
    };
  }

  /**
   * Calcula el área de un elemento
   */
  static calculateElementArea(element: DiagramElement): number {
    return element.size.width * element.size.height;
  }

  /**
   * Verifica si dos elementos se superponen
   */
  static elementsOverlap(element1: DiagramElement, element2: DiagramElement): boolean {
    const rect1 = {
      left: element1.position.x,
      right: element1.position.x + element1.size.width,
      top: element1.position.y,
      bottom: element1.position.y + element1.size.height
    };

    const rect2 = {
      left: element2.position.x,
      right: element2.position.x + element2.size.width,
      top: element2.position.y,
      bottom: element2.position.y + element2.size.height
    };

    return !(rect1.right < rect2.left || 
             rect2.right < rect1.left || 
             rect1.bottom < rect2.top || 
             rect2.bottom < rect1.top);
  }

  /**
   * Encuentra una posición libre para un nuevo elemento
   */
/**
 * Encuentra una posición libre para un nuevo elemento
 */
static findFreePosition(
  existingElements: DiagramElement[], 
  newElementSize: Size, 
  preferredPosition?: Position
): Position {
  const startPos = preferredPosition || { x: 100, y: 100 };
  const gridSize = 20;
  
  for (let offsetY = 0; offsetY < 1000; offsetY += gridSize) {
    for (let offsetX = 0; offsetX < 1000; offsetX += gridSize) {
      const testPosition = {
        x: startPos.x + offsetX,
        y: startPos.y + offsetY
      };

      const testElement: DiagramElement = {
        id: 'temp',
        type: 'component',
        subType: 'basic',
        position: testPosition,
        size: newElementSize,
        attributes: {}
      };

      const hasCollision = existingElements.some(existing => 
        this.elementsOverlap(testElement, existing)
      );

      if (!hasCollision) {
        return testPosition;
      }
    }
  }

  // Si no se encuentra posición libre, usar la preferida o por defecto
  return startPos;
}


}