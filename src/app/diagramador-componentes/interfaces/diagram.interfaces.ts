// interfaces/diagram.interfaces.ts

export interface DiagramElement {
  id: string;
  type: 'component' | 'interface' | 'port';
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
  stereotypeText?: string;
}

export interface ComponentElement extends DiagramElement {
  type: 'component';
  componentType?: 'servidor' | 'cliente' | 'database' | 'servicio';
}

export interface InterfaceElement extends DiagramElement {
  type: 'interface';
  interfaceType?: 'provided' | 'required' | 'bidirectional';
}

export interface PortElement extends DiagramElement {
  type: 'port';
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
  elementType: 'component' | 'interface' | 'port';
  componentType?: string;
  interfaceType?: string;
}

export interface ToolAction {
  // add 'connection' alongside 'connect'
  type:
    | 'undo'
    | 'redo'
    | 'connect'
    | 'connection'      // ← newly allowed
    | 'delete'
    | 'clear'
    | 'save'
    | 'load'
    | 'export'
    | 'zoom-in'
    | 'zoom-out';

  // allow passing an 'action' property for things like toggling connection mode
  action?: string;

  // keep payload if you still use it elsewhere
  payload?: any;
}

export interface ElementTypeConfig {
  headerText: string;
  stereotype: string;
  fill: string;
  stroke: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  elementType: 'component' | 'interface' | 'port';
  componentType?: string;
  interfaceType?: string;
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