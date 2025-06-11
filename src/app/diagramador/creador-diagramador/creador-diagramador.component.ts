import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToolbarAction, ToolbarComponent } from "../../toolbar/toolbar.component";
import { AsideComponent } from '../aside/aside.component';
import { AtributosComponent } from '../atributos/atributos.component';
import { PropiedaadesAsideComponent } from "../propiedaades-aside/propiedaades-aside.component";
import { RouterModule, ActivatedRoute } from '@angular/router';

import * as joint from 'jointjs';
import 'jointjs/dist/joint.css';

import { DatabaseField } from '../../diagramador/interfaces/database-field.interfaces';
import { TableData } from '../../diagramador/interfaces/table-data-interfaces';
import { DiagramService } from '../../service/diagrama-base/diagrama-base.service';

@Component({
  selector: 'app-creador-diagramador',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AsideComponent,
    AtributosComponent,
    ToolbarComponent,
    PropiedaadesAsideComponent,
    RouterModule
  ],
  templateUrl: './creador-diagramador.component.html',
  styleUrl: './creador-diagramador.component.css'
})
export class CreadorDiagramadorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;

  // Variables del diagramador usando el servicio
  private get graph() { return this.diagramService.graph; }
  private get paper() { return this.diagramService.paper; }
  
  public currentTable: joint.shapes.basic.Generic | null = null;
  public connectionStatus: string = 'Haz clic en los puertos de campo para crear conexiones';
  public showPropertiesSidebar: boolean = false;
  public selectedTableName: string = '';
  public selectedTableFields: DatabaseField[] = [];
  public selectedTableData: TableData | null = null;
  
  public showFieldDialog: boolean = false;
  public editingFieldIndex: number | undefined;
  public fieldFormData: DatabaseField = {
    name: '',
    type: 'VARCHAR(255)',
    pk: false,
    fk: false,
    notNull: false,
    autoIncrement: false,
    unique: false,
    defaultValue: '',
    comment: ''
  };

  public editingTableName: boolean = false;
  public tempTableName: string = '';
  public zoomLevel: number = 100;

  constructor(
    private diagramService: DiagramService,
    private route: ActivatedRoute
  ) {}

ngOnInit() {
  // Detectar si hay un :id en la ruta
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.loadDiagramById(id); // Modo edición: cargar diagrama existente
    }
  });
}

  ngAfterViewInit() {
    this.diagramService.createPaper(this.canvasRef.nativeElement);
    this.setupEventListeners();
    this.loadSampleData();
  }

  ngOnDestroy() {
    this.graph.clear();
    this.diagramService.paper?.remove();
  }

 
// Para cargar diagrama por ID (por si implementas edición):
public loadDiagramById(id: string) {
  const token = localStorage.getItem('token');
  if (!id || !token) return;
  
  fetch(`http://localhost:4000/api/diagramas/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      console.log('DATA DEL BACKEND', data);
      
      try {
        this.graph.clear();
        
        // Verificar que existe 'elementos' y que tiene 'cells'
        if (data.elementos && Array.isArray(data.elementos.cells)) {
          
          // DEBUG: Mostrar células originales
          console.log('Células originales:', data.elementos.cells);
          
          // MÉTODO SEGURO: Cargar una por una para identificar cuál falla
          this.loadCellsOneByOne(data.elementos.cells);
          
        } else {
          this.updateConnectionStatus('❌ Error: El formato de elementos no es válido');
          console.error('Formato elementos:', data.elementos);
        }
      } catch (error) {
        console.error('Error al cargar el diagrama:', error);
        this.updateConnectionStatus('❌ Error al procesar el diagrama');
      }
    })
    .catch(err => {
      this.updateConnectionStatus('❌ Error al cargar diagrama');
      console.error('Error en loadDiagramById:', err);
    });
}

// NUEVO MÉTODO: Procesa los elementos antes de cargarlos
private processElementsForLoad(cells: any[]): any[] {
  return cells.map(cell => {
    console.log('Procesando célula:', cell);
    
    // Si es un enlace (link), mantenerlo como está
    if (cell.type === 'link' || (cell.source && cell.target)) {
      return cell;
    }
    
    // Si es una tabla con tipo sql.Table, convertirla a formato compatible
    if (cell.type === 'sql.Table' || cell.type?.includes('sql.Table')) {
      return this.convertSqlTableToBasic(cell);
    }
    
    // Si no tiene tipo o tiene un tipo desconocido, convertir a básico
    if (!cell.type || !this.isValidJointJSType(cell.type)) {
      console.warn(`Tipo desconocido: ${cell.type}, convirtiendo a basic.Rect`);
      return this.convertToBasicRect(cell);
    }
    
    return cell;
  });
}

// NUEVO MÉTODO: Convierte sql.Table a formato básico compatible
private convertSqlTableToBasic(sqlTableCell: any): any {
  console.log('Convirtiendo sql.Table a basic.Rect:', sqlTableCell);
  console.log('Datos originales completos:', JSON.stringify(sqlTableCell, null, 2));
  
  // Crear un elemento básico completamente válido
  const basicElement = {
    type: 'basic.Rect',
    id: sqlTableCell.id || this.generateUniqueId(),
    position: sqlTableCell.position || { x: 100, y: 100 },
    size: sqlTableCell.size || { width: 240, height: 120 },
    angle: sqlTableCell.angle || 0,
    attrs: {
      rect: { 
        fill: '#ffffff', 
        stroke: '#2b579a', 
        'stroke-width': 2,
        rx: 3,
        ry: 3
      },
      text: { 
        text: sqlTableCell.name || sqlTableCell.attrs?.text?.text || 'Table',
        'font-size': 14,
        'font-family': 'Arial, sans-serif',
        fill: '#333333',
        'ref-x': '50%',
        'ref-y': '50%',
        'text-anchor': 'middle',
        'y-alignment': 'middle'
      }
    },
    // Preservar datos personalizados de la tabla
    name: sqlTableCell.name,
    fields: sqlTableCell.fields || [],
    comment: sqlTableCell.comment || '',
    engine: sqlTableCell.engine || 'InnoDB',
    charset: sqlTableCell.charset || 'utf8mb4'
  };
  
  console.log('Elemento convertido:', basicElement);
  return basicElement;
}

// NUEVO MÉTODO: Convierte elementos desconocidos a basic.Rect
private convertToBasicRect(cell: any): any {
  return {
    type: 'basic.Rect',
    id: cell.id || this.generateUniqueId(),
    position: cell.position || { x: 50, y: 50 },
    size: cell.size || { width: 100, height: 50 },
    attrs: {
      rect: { 
        fill: '#ffffff', 
        stroke: '#000000', 
        'stroke-width': 1 
      },
      text: { 
        text: cell.attrs?.text?.text || 'Element',
        'font-size': 12
      }
    }
  };
}

// NUEVO MÉTODO: Verifica si un tipo de JointJS es válido
private isValidJointJSType(type: string): boolean {
  try {
    const TypeClass = joint.util.getByPath(joint.shapes, type);
    return !!TypeClass;
  } catch (error) {
    return false;
  }
}

// NUEVO MÉTODO: Genera ID único
private generateUniqueId(): string {
  return 'element_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// NUEVO MÉTODO: Carga células una por una para identificar problemas
private loadCellsOneByOne(cells: any[]) {
  console.log('=== CARGANDO CÉLULAS EN DOS PASOS ===');
  let successCount = 0;
  let errorCount = 0;

  // 1. AGREGAR PRIMERO TODAS LAS TABLAS
  const tablaCells = cells.filter(cell => cell.type === 'sql.Table');
  tablaCells.forEach((cell, index) => {
    try {
      console.log(`Agregando tabla ${index}:`, cell);
      const position = cell.position || { x: 100 + (index * 30), y: 100 + (index * 30) };
      const newTable = this.addTable(position.x, position.y);

      // Aplicar propiedades
      if (cell.name) newTable.set('name', cell.name);
      if (cell.fields && Array.isArray(cell.fields)) newTable.set('fields', cell.fields);
      if (cell.comment) newTable.set('comment', cell.comment);
      if (cell.engine) newTable.set('engine', cell.engine);
      if (cell.charset) newTable.set('charset', cell.charset);
      if (cell.size) newTable.resize(cell.size.width, cell.size.height);

      this.updateTableView(newTable);
      successCount++;
    } catch (error) {
      console.error('❌ Error al agregar tabla:', error, cell);
      errorCount++;
    }
  });

  // 2. LUEGO AGREGAR TODOS LOS LINKS
  const linkCells = cells.filter(cell => cell.type === 'link');
  linkCells.forEach((cell, index) => {
    try {
      console.log(`Agregando link ${index}:`, cell);
      const link = new joint.dia.Link({
        id: cell.id || this.generateUniqueId(),
        source: cell.source,
        target: cell.target,
        router: cell.router,
        connector: cell.connector,
        attrs: cell.attrs
      });
      this.graph.addCell(link);
      successCount++;
    } catch (error) {
      console.error('❌ Error al agregar link:', error, cell);
      errorCount++;
    }
  });

  console.log(`=== RESUMEN ===`);
  console.log(`Exitosas: ${successCount}`);
  console.log(`Errores: ${errorCount}`);
  console.log(`Total: ${cells.length}`);

  if (successCount > 0) {
    this.updateConnectionStatus(`✅ Diagrama cargado: ${successCount}/${cells.length} elementos`);
  } else {
    this.updateConnectionStatus(`❌ Error: No se pudieron cargar elementos`);
  }
}

// OPCIONAL: Método para debug - muestra información de las células
public debugCells(cells: any[]) {
  console.log('=== DEBUG CÉLULAS ===');
  cells.forEach((cell, index) => {
    console.log(`Célula ${index}:`, {
      type: cell.type,
      id: cell.id,
      hasPosition: !!cell.position,
      hasSize: !!cell.size,
      hasAttrs: !!cell.attrs,
      isLink: !!(cell.source && cell.target),
      customFields: {
        name: cell.name,
        fields: cell.fields?.length || 0,
        comment: cell.comment
      }
    });
  });
  console.log('=== FIN DEBUG ===');
}


//aparte
  private setupEventListeners() {
    if (this.paper) {
      // Click en tabla
      this.paper.on('cell:pointerclick', (cellView: any, evt: any) => {
        const cell = cellView.model;
        if (cell instanceof (joint.shapes as any).sql.Table) {
          this.selectTable(cell);
        }
      });

      // Click en el canvas vacío
      this.paper.on('blank:pointerclick', () => {
        this.deselectTable();
      });
    }

    // Drag and drop
    this.canvasRef.nativeElement.addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault();
    });

    this.canvasRef.nativeElement.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer?.getData('text/plain');
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (type === 'table') {
        this.addTable(x, y);
      }
    });
  }

 public addTable(x: number, y: number): any {
  // ¡Usa SIEMPRE el servicio para no perder la lógica base!
  const table = this.diagramService.addTable(x, y);
  this.updateTableView(table);
  return table;
}
  private updateTableView(table: any) {
    const fields = table.get('fields') || [];
    const headerHeight = 30;
    const fieldHeight = 24;
    const totalHeight = Math.max(100, headerHeight + (fields.length * fieldHeight) + 10);
    
    table.resize(240, totalHeight);
    
    table.attr({
      '.table-header': { height: headerHeight },
      '.table-name': { text: table.get('name') || 'Table' },
      '.table-body': { height: totalHeight }
    });

    let fieldMarkup = '';
    let portMarkup = '';
    
    fields.forEach((field: DatabaseField, index: number) => {
      const yPos = headerHeight + (index * fieldHeight) + 12;
      const constraints = [];
      
      if (field.pk) constraints.push('🔑');
      if (field.fk) constraints.push('🔗');
      if (field.unique) constraints.push('🔹');
      if (field.notNull) constraints.push('NN');
      if (field.autoIncrement) constraints.push('AI');
      
      const fieldColor = field.fk ? '#0066cc' : (field.pk ? '#cc6600' : '#333');
      
      fieldMarkup += `
        <g class="field" transform="translate(0,${yPos})">
          <text x="15" class="field-name" fill="${fieldColor}" font-family="Consolas, monospace" font-size="12" font-weight="${field.pk || field.fk ? 'bold' : 'normal'}">
            ${constraints.join(' ')} ${field.name}
          </text>
          <text x="225" class="field-type" text-anchor="end" fill="#666" font-family="Consolas, monospace" font-size="11">
            ${field.type}
          </text>
        </g>
      `;

      portMarkup += `
        <g class="port-group" transform="translate(0,${yPos})">
          <circle class="port port-left" cx="-2" cy="0" r="4" 
            data-field-index="${index}" data-port-side="left"
            magnet="true" port="field-${index}-left"/>
          <circle class="port port-right" cx="242" cy="0" r="4" 
            data-field-index="${index}" data-port-side="right"
            magnet="true" port="field-${index}-right"/>
        </g>
      `;
    });

    table.attr('.fields', { html: fieldMarkup });
    table.attr('.field-ports', { html: portMarkup });
  }

  public selectTable(table: any) {
    if (this.currentTable) {
      this.currentTable.attr('.table-body', { stroke: '#2b579a', 'stroke-width': 2 });
    }

    this.currentTable = table;
    this.showPropertiesSidebar = true;
    this.selectedTableName = table.get('name') || '';
    this.updateSelectedTableData();
    table.attr('.table-body', { stroke: '#ff6b35', 'stroke-width': 3 });
  }

  public deselectTable() {
    if (this.currentTable) {
      this.currentTable.attr('.table-body', { stroke: '#2b579a', 'stroke-width': 2 });
    }
    
    this.currentTable = null;
    this.showPropertiesSidebar = false;
    this.selectedTableData = null;
    this.editingTableName = false;
  }

  private updateSelectedTableData() {
    if (this.currentTable) {
      this.selectedTableFields = [...(this.currentTable.get('fields') || [])];
      const tableId = this.currentTable.id;
      const tableIdString = typeof tableId === 'string' ? tableId : String(tableId);
      const position = this.currentTable.get('position') || { x: 0, y: 0 };
      
      this.selectedTableData = {
        id: tableIdString,
        name: this.currentTable.get('name') || '',
        fields: this.selectedTableFields,
        position: position,
        comment: this.currentTable.get('comment') || '',
        engine: this.currentTable.get('engine') || 'InnoDB',
        charset: this.currentTable.get('charset') || 'utf8mb4'
      };
    }
  }

  public updateConnectionStatus(message: string) {
    this.connectionStatus = message;
    setTimeout(() => {
      this.connectionStatus = 'Haz clic en los puertos de campo para crear conexiones';
    }, 3000);
  }

  // Métodos para edición de nombre de tabla
  public startEditingTableName() {
    this.editingTableName = true;
    this.tempTableName = this.selectedTableName;
  }

  public cancelEditingTableName() {
    this.editingTableName = false;
    this.tempTableName = '';
  }

  public saveTableName() {
    if (this.currentTable && this.tempTableName.trim()) {
      this.currentTable.set('name', this.tempTableName.trim());
      this.selectedTableName = this.tempTableName.trim();
      this.updateTableView(this.currentTable);
      this.updateSelectedTableData();
    }
    this.editingTableName = false;
    this.tempTableName = '';
  }

  // Métodos para campos
  public addNewField() {
    this.showFieldDialog = true;
    this.editingFieldIndex = undefined;
    this.fieldFormData = {
      name: '',
      type: 'VARCHAR(255)',
      pk: false,
      fk: false,
      notNull: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      comment: ''
    };
  }

  public editField(index: number) {
    if (this.currentTable) {
      const fields = this.currentTable.get('fields') || [];
      const field = fields[index];
      this.showFieldDialog = true;
      this.editingFieldIndex = index;
      this.fieldFormData = { ...field };
    }
  }

  public saveField() {
    if (!this.currentTable || !this.fieldFormData.name.trim()) return;

    const fields = this.currentTable.get('fields') || [];
    
    if (this.editingFieldIndex !== undefined) {
      const existingField = fields[this.editingFieldIndex];
      if (existingField.fk) {
        this.fieldFormData.fk = existingField.fk;
        this.fieldFormData.referencedTable = existingField.referencedTable;
        this.fieldFormData.referencedField = existingField.referencedField;
      }
      fields[this.editingFieldIndex] = { ...this.fieldFormData };
    } else {
      fields.push({ ...this.fieldFormData });
    }
    
    this.currentTable.set('fields', fields);
    this.updateTableView(this.currentTable);
    this.updateSelectedTableData();
    this.closeFieldDialog();
  }

  public closeFieldDialog() {
    this.showFieldDialog = false;
    this.editingFieldIndex = undefined;
    this.fieldFormData = {
      name: '',
      type: 'VARCHAR(255)',
      pk: false,
      fk: false,
      notNull: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      comment: ''
    };
  }

  public deleteField(index: number) {
    if (this.currentTable) {
      const fields = this.currentTable.get('fields') || [];
      fields.splice(index, 1);
      this.currentTable.set('fields', fields);
      this.updateTableView(this.currentTable);
      this.updateSelectedTableData();
    }
  }

  // Métodos de tabla
  public deleteCurrentTable() {
    if (this.currentTable) {
      const links = this.graph.getLinks();
      links.forEach((link: any) => {
        const sourceId = link.get('source').id;
        const targetId = link.get('target').id;
        if (sourceId === this.currentTable!.id || targetId === this.currentTable!.id) {
          link.remove();
        }
      });
      
      this.currentTable.remove();
      this.deselectTable();
    }
  }

  public duplicateCurrentTable() {
    if (this.currentTable) {
      const position = this.currentTable.get('position') || { x: 0, y: 0 };
      const newTable = this.addTable(position.x + 260, position.y);
      
      newTable.set('name', this.currentTable.get('name') + '_copy');
      newTable.set('fields', JSON.parse(JSON.stringify(this.currentTable.get('fields'))));
      newTable.set('comment', this.currentTable.get('comment'));
      newTable.set('engine', this.currentTable.get('engine'));
      newTable.set('charset', this.currentTable.get('charset'));
      
      this.updateTableView(newTable);
      this.selectTable(newTable);
    }
  }

  // Métodos utilitarios
  public getFieldIcon(field: DatabaseField): string {
    if (field.pk) return '🔑';
    if (field.fk) return '🔗';
    if (field.unique) return '🔹';
    return '📄';
  }

  public getFieldBadges(field: DatabaseField): string[] {
    const badges = [];
    if (field.pk) badges.push('PK');
    if (field.fk) badges.push('FK');
    if (field.unique) badges.push('UQ');
    if (field.notNull) badges.push('NN');
    if (field.autoIncrement) badges.push('AI');
    return badges;
  }

  // Métodos de exportación
  public generateSQL(): string {
    let sql = '';
    const tables = this.graph.getElements();
    
    tables.forEach((table: any) => {
      if (!(table instanceof (joint.shapes as any).sql.Table)) return;
      
      const name = table.get('name');
      const fields = table.get('fields') || [];
      const comment = table.get('comment') || '';
      const engine = table.get('engine') || 'InnoDB';
      const charset = table.get('charset') || 'utf8mb4';
      
      sql += `-- Table: ${name}\n`;
      if (comment) sql += `-- ${comment}\n`;
      sql += `CREATE TABLE ${name} (\n`;
      
      const fieldDefinitions = fields.map((field: DatabaseField) => {
        let definition = `    ${field.name} ${field.type}`;
        if (field.pk) definition += ' PRIMARY KEY';
        if (field.autoIncrement) definition += ' AUTO_INCREMENT';
        if (field.notNull && !field.pk) definition += ' NOT NULL';
        if (field.unique && !field.pk) definition += ' UNIQUE';
        if (field.defaultValue) definition += ` DEFAULT '${field.defaultValue}'`;
        if (field.comment) definition += ` COMMENT '${field.comment}'`;
        return definition;
      });
      
      sql += fieldDefinitions.join(',\n');
      sql += `\n) ENGINE=${engine} DEFAULT CHARSET=${charset}`;
      if (comment) sql += ` COMMENT='${comment}'`;
      sql += ';\n\n';
    });

    const links = this.graph.getLinks();
    if (links.length > 0) {
      sql += '-- Foreign Key Constraints\n';
      links.forEach((link: any) => {
        const sourceId = link.get('source').id;
        const targetId = link.get('target').id;
        const sourcePort = link.get('source').port;
        const targetPort = link.get('target').port;
        
        const sourceTable = this.graph.getCell(sourceId);
        const targetTable = this.graph.getCell(targetId);
        
        if (sourcePort && targetPort) {
          const sourceFieldIndex = parseInt(sourcePort.split('-')[1]);
          const targetFieldIndex = parseInt(targetPort.split('-')[1]);
          
          const sourceField = sourceTable.get('fields')[sourceFieldIndex];
          const targetField = targetTable.get('fields')[targetFieldIndex];
          
          if (sourceField && targetField) {
            sql += `ALTER TABLE ${targetTable.get('name')} ADD CONSTRAINT FK_${targetTable.get('name')}_${targetField.name} `;
            sql += `FOREIGN KEY (${targetField.name}) REFERENCES ${sourceTable.get('name')}(${sourceField.name});\n`;
          }
        }
      });
    }
    
    return sql;
  }

  public exportSQL() {
    const sql = this.generateSQL();
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database.sql';
    a.click();
    
    this.updateConnectionStatus('✅ SQL exported successfully!');
  }

  public exportDiagram() {
    if (this.paper?.svg) {
      const svgDoc = this.paper.svg;
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgDoc);
      
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.svg';
      a.click();
      
      this.updateConnectionStatus('✅ Diagram exported successfully!');
    }
  }

public saveDiagram() {
  const token = localStorage.getItem('token');
  const nombre = prompt("Ingresa un nombre para el diagrama:");
  if (!nombre || !token) {
    this.updateConnectionStatus('❌ Error: faltan datos para guardar el diagrama.');
    return;
  }
  const body = {
    nombre: nombre,
    tipo: 'bd',
    elementos: this.graph.toJSON()
  };
  fetch('http://localhost:4000/api/diagramas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })
    .then(response => {
      if (!response.ok) throw new Error('Error al guardar el diagrama');
      return response.json();
    })
    .then(data => {
      this.updateConnectionStatus('✅ Diagrama guardado correctamente');
    })
    .catch(error => {
      this.updateConnectionStatus('❌ Error al guardar el diagrama');
    });
}

  // Métodos de zoom
  public zoomIn() {
    if (this.paper) {
      this.zoomLevel = Math.min(200, this.zoomLevel + 25);
      this.paper.scale(this.zoomLevel / 100);
    }
  }

  public zoomOut() {
    if (this.paper) {
      this.zoomLevel = Math.max(25, this.zoomLevel - 25);
      this.paper.scale(this.zoomLevel / 100);
    }
  }

  public zoomToFit() {
    if (this.paper) {
      this.paper.scaleContentToFit();
      this.zoomLevel = 100;
    }
  }

  public resetZoom() {
    if (this.paper) {
      this.zoomLevel = 100;
      this.paper.scale(1);
    }
  }

  private loadSampleData() {
    // Se eliminaron las tablas de ejemplo
  }

  onToolAction(action: ToolbarAction) {
    switch (action.type) {
      case 'select':
        this.enableSelectionMode();
        break;
      case 'move':
        this.enableMoveMode();
        break;
      case 'delete':
        if (this.currentTable) {
          this.deleteCurrentTable();
        }
        break;
      case 'undo':
        // Implementar undo
        break;
      case 'redo':
        // Implementar redo
        break;
      case 'export':
        this.exportDiagram();
        break;
      case 'save':
        this.saveDiagram();
        break;
    }
  }

  private enableSelectionMode() {
    if (this.paper) {
      this.paper.setInteractivity({ vertexAdd: false });
    }
  }

  private enableMoveMode() {
    if (this.paper) {
      this.paper.setInteractivity({ vertexAdd: true });
    }
  }
}
