// src/app/diagramador-componentes/diagram.interfaces.ts

/**
 * Alias que restringe estrictamente los valores permitidos para `type`.
 */
export type ElementType =
  | 'component'
  | 'interface'
  | 'port'
  | 'connector'
  | 'relation'
  | 'annotation';

export interface DiagramElement {
  id: string;
  /** Solo puede valer uno de los literales definidos en ElementType */
  type: ElementType;
  subType?: string; // Ej. 'servidor', 'cliente', etc.
  position: Position;
  size: Size;
  attributes: ElementAttributes;
  metadata?: any;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ElementAttributes {
  name?: string;
  description?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  headerText?: string;
  bodyText?: string;
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
  tags?: string[];                  // Ahora sí permitimos un arreglo de cadenas
  stereotypeText?: string;
  stereotype?: string;
  content?: string;
  icon?: string;
  shape?: 'rectangle' | 'circle' | 'diamond' | 'ellipse' | 'cylinder' | 'hexagon';
  properties?: Record<string, any>;  // Para permitir un objeto vacío u otras propiedades arbitrarias
}

// Interfaces especializadas que heredan DiagramElement:

export interface ComponentElement extends DiagramElement {
  type: 'component';
  subType: 'servidor' | 'cliente' | 'database' | 'servicio' | 'subsistema' | 'basic';
}

export interface InterfaceElement extends DiagramElement {
  type: 'interface';
  subType: 'provided' | 'required' | 'bidirectional' | 'basic';
}

export interface PortElement extends DiagramElement {
  type: 'port';
}

export interface ConnectorElement extends DiagramElement {
  type: 'connector';
}

export interface RelationElement extends DiagramElement {
  type: 'relation';
}

export interface AnnotationElement extends DiagramElement {
  type: 'annotation';
  subType: 'note' | 'comment' | 'constraint' | 'stereotype';
}

export interface Connection {
  id: string;
  source: ConnectionPoint;
  target: ConnectionPoint;
  attributes: ConnectionAttributes;
}

export interface ConnectionPoint {
  elementId: string;
  port: string;
  magnet?: string;
}

export interface ConnectionAttributes {
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  markerTarget?: string;
  arrowType?: 'none' | 'source' | 'target' | 'both';
  connectionType?: 'solid' | 'dashed';
}

export interface DiagramState {
  elements: DiagramElement[];
  connections: Connection[];
  zoomLevel: number;
  selectedElement?: DiagramElement | Connection;
}

export interface DragDropData {
  /**
   * Ahora `elementType` está tipado como ElementType (p.ej. 'component', 'interface', etc.),
   * nunca como un string genérico.
   */
  elementType: ElementType;
  subType?: string; // Para variantes como 'servidor', 'cliente', etc.
  componentType?: string; // Para compatibilidad con código previo
  interfaceType?: string; // Para compatibilidad con código previo
  icon?: string;
  label?: string;
}

export interface ToolAction {
  type:
    | 'undo'
    | 'redo'
    | 'connect'
    | 'connection'
    | 'delete'
    | 'clear'
    | 'save'
    | 'load'
    | 'export'
    | 'zoom-in'
    | 'zoom-out';
  action?: string;
  payload?: any;
}

export interface ElementTypeConfig {
  headerText: string;
  stereotype: string;
  fill: string;
  stroke: string;
  shape?: 'rectangle' | 'circle' | 'diamond' | 'ellipse' | 'cylinder' | 'hexagon';
  icon?: string;
  size?: Size;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  /** También restringimos a ElementType */
  elementType: ElementType;
  subType?: string;
  componentType?: string; // Compatibilidad
  interfaceType?: string; // Compatibilidad
}

export interface PropertiesFormData {
  name: string;
  description: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface ConnectionPropertiesFormData {
  connectionType: 'solid' | 'dashed';
  color: string;
  width: number;
  arrowType: 'none' | 'source' | 'target' | 'both';
}

export interface ZoomControls {
  level: number;
  min: number;
  max: number;
  step: number;
}

export interface DiagramExportOptions {
  format: 'svg' | 'png' | 'json';
  filename: string;
  quality?: number;
}

export interface MagnetPoint {
  position: 'left' | 'right' | 'top' | 'bottom' | 'center';
  element: DiagramElement;
  coordinates: Position;
}

export interface ConnectionMode {
  active: boolean;
  startPoint?: MagnetPoint;
  indicator: string;
}


export interface PortDefinition {
  id: string;
  type: 'input' | 'output' | 'bidirectional';
  position: 'left' | 'right' | 'top' | 'bottom';
  name?: string;
  description?: string;
}