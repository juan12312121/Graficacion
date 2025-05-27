import { Injectable } from '@angular/core';
import * as joint from 'jointjs';
import { DatabaseField } from '../../diagramador/interfaces/database-field.interfaces';
import { defineCustomTableShape } from '../../diagramador/interfaces/sql-table.shape';
import { TableData } from '../../diagramador/interfaces/table-data-interfaces';
import { areFieldTypesCompatible } from '../../diagramador/interfaces/ultils';

interface LinkStyle {
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  markerTarget?: {
    fill?: string;
    d?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class DiagramService {
  graph: joint.dia.Graph = new joint.dia.Graph();
  paper: joint.dia.Paper | null = null;
  currentUser: string = 'juan12312121';
  currentDate: string = '2025-05-27 05:46:19';

  constructor() {
    defineCustomTableShape();
  }

  createPaper(canvas: HTMLElement): joint.dia.Paper {
    this.paper = new joint.dia.Paper({
      el: canvas,
      model: this.graph,
      width: '100%',
      height: '100%',
      gridSize: 10,
      drawGrid: true,
      background: {
        color: 'rgba(43, 87, 154, 0.05)'
      },
      defaultLink: new joint.dia.Link({
        attrs: {
          '.connection': {
            stroke: '#2b579a',
            'stroke-width': 2
          },
          '.marker-target': {
            fill: '#2b579a',
            d: 'M 10 0 L 0 5 L 10 10 z'
          }
        },
        router: { name: 'manhattan' },
        connector: { name: 'rounded' }
      }),
      interactive: { vertexAdd: false },
      linkPinning: false,
      markAvailable: true,
      snapLinks: true,
      defaultConnectionPoint: { name: 'boundary' },
      validateConnection: this.validateConnection.bind(this)  // Agregamos validación de conexiones
    });
    return this.paper;
  }

  addTable(x: number, y: number, tableData?: Partial<TableData>): any {
    const table = new (joint.shapes as any).sql.Table({
      position: { x, y },
      size: { width: 240, height: 100 },
      fields: tableData?.fields || [
        {
          name: 'id',
          type: 'INT',
          pk: true,
          notNull: true,
          autoIncrement: true,
          comment: 'Primary key identifier'
        }
      ],
      name: tableData?.name || 'Tabla',
      comment: tableData?.comment || 'New table description',
      engine: tableData?.engine || 'InnoDB',
      charset: tableData?.charset || 'utf8mb4'
    });
    this.graph.addCell(table);
    return table;
  }

  validateFieldConnection(sourceField: DatabaseField, targetField: DatabaseField): boolean {
    return areFieldTypesCompatible(sourceField.type, targetField.type);
  }

  private validateConnection(cellViewS: any, magnetS: any, cellViewT: any, magnetT: any): boolean {
    // Prevenir autoconexiones
    if (cellViewS === cellViewT) return false;
    if (!magnetS || !magnetT) return false;

    const sourceFieldIndex = parseInt(magnetS.getAttribute('data-field-index'));
    const targetFieldIndex = parseInt(magnetT.getAttribute('data-field-index'));

    if (isNaN(sourceFieldIndex) || isNaN(targetFieldIndex)) return false;

    const sourceTable = cellViewS.model;
    const targetTable = cellViewT.model;
    const sourceFields = sourceTable.get('fields') || [];
    const targetFields = targetTable.get('fields') || [];

    if (sourceFieldIndex >= sourceFields.length || targetFieldIndex >= targetFields.length) {
      return false;
    }

    const sourceField = sourceFields[sourceFieldIndex];
    const targetField = targetFields[targetFieldIndex];

    return this.validateFieldConnection(sourceField, targetField);
  }

  connectTables(
    sourceTable: any,
    sourceFieldIndex: number,
    targetTable: any,
    targetFieldIndex: number,
    options?: LinkStyle
  ): joint.dia.Link | null {
    const sourceFields = sourceTable.get('fields') || [];
    const targetFields = targetTable.get('fields') || [];
    
    if (!sourceFields[sourceFieldIndex] || !targetFields[targetFieldIndex]) {
      return null;
    }

    const sourceField = sourceFields[sourceFieldIndex];
    const targetField = targetFields[targetFieldIndex];

    // Validar compatibilidad de tipos
    if (!this.validateFieldConnection(sourceField, targetField)) {
      return null;
    }

    // Marcar como FK en el destino
    targetField.fk = true;
    targetField.referencedTable = sourceTable.get('name');
    targetField.referencedField = sourceField.name;
    targetTable.set('fields', targetFields);

    // Crear el enlace visualmente atractivo
    const link = new joint.dia.Link({
      source: { id: sourceTable.id, port: `field-${sourceFieldIndex}-right` },
      target: { id: targetTable.id, port: `field-${targetFieldIndex}-left` },
      attrs: {
        '.connection': {
          stroke: options?.stroke || '#2196f3',
          'stroke-width': options?.strokeWidth ?? 3,
          'stroke-dasharray': options?.strokeDasharray || '10,6',
          'stroke-linecap': 'round',
          filter: 'drop-shadow(0px 2px 6px #1976d299)',
          opacity: 0.9
        },
        '.marker-target': {
          fill: options?.markerTarget?.fill || '#1976d2',
          d: options?.markerTarget?.d || 'M 14 0 L 0 7 L 14 14 z',
          stroke: options?.markerTarget?.fill || '#1976d2',
          'stroke-width': 1
        }
      },
      router: { name: 'smooth' },
      connector: { name: 'rounded' }
    });

    this.graph.addCell(link);
    return link;
  }

  // Métodos auxiliares para el diagrama
  updateTableView(table: any, fields: DatabaseField[]): void {
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

  generateSQL(): string {
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

    // Agregar Foreign Keys
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
}