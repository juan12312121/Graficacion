import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ToolbarAction {
  type: 'select' | 'move' | 'delete' | 'undo' | 'redo' | 'export' | 'save' | 'custom';
  icon: string;
  title: string;
  active?: boolean;
  disabled?: boolean;
  customClass?: string;
}

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toolbar">
      <div class="tool-group" *ngFor="let group of tools">
        <div 
          *ngFor="let tool of group" 
          class="tool" 
          [class.active]="tool.active"
          [class.disabled]="tool.disabled"
          [title]="tool.title"
          (click)="onToolClick(tool)">
          <i class="fas {{ tool.icon }}"></i>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  @Input() tools: ToolbarAction[][] = [];
  @Input() currentDate: string = '2025-05-27 06:19:10';
  @Input() currentUser: string = 'juan12312121';
  @Output() toolClick = new EventEmitter<ToolbarAction>();

  onToolClick(tool: ToolbarAction) {
    if (tool.disabled) return;

    // Si es una herramienta de selección, desactivar las demás del mismo grupo
    if (['select', 'move'].includes(tool.type)) {
      this.tools.forEach(group => {
        group.forEach(t => {
          if (['select', 'move'].includes(t.type)) {
            t.active = t === tool;
          }
        });
      });
    }

    this.toolClick.emit(tool);
  }
}