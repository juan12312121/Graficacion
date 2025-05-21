import { CommonModule } from '@angular/common';
import { AfterViewInit, Component,ViewChild, ElementRef } from '@angular/core';
import { ToolbarComponent } from "../../toolbar/toolbar.component";
import { AsideComponent } from '../aside/aside.component';
import { DiagramaService } from '../../service/diagrama/diagrama.service';
import { ajustarAlturaDinamica } from '../../shared-class-components/resize-func';

@Component({
  selector: 'app-diagramador-clases',
  standalone: true,
  imports: [CommonModule, AsideComponent, ToolbarComponent], // Agregamos el componente aside y CommonModule
  templateUrl: './diagramador-clases.component.html',
  styleUrls: ['./diagramador-clases.component.css'] // Corrección en "styleUrls"
})
export class DiagramadorClasesComponent implements AfterViewInit{

  @ViewChild('paperContainer', { static: true }) paperContainer!: ElementRef;
  @ViewChild('floatingInput') floatingInput!: ElementRef;

  editingModel!: joint.dia.Element;
  editingSelector!: string;

  constructor(private diagramaService: DiagramaService) {}

  ngAfterViewInit(): void {
    const paper = this.diagramaService.initPaper(
      this.paperContainer.nativeElement
    );

    paper.on(
      'element:pointerdblclick',
      (elementView, evt, x, y) => {
        const model = elementView.model;
        
        let target = evt.target as SVGElement;
        let selector: string | null = null;
        while (target && !selector && target !== paper.svg) {
          selector = target.getAttribute('selector');

          const parent = target.parentElement;
          if (parent instanceof SVGElement) {
            target = parent;
            
          } else {
            break; 
          }
        }

        console.log('target selector:', selector);

        if (selector?.endsWith('Label')) {
          const textoActual = model.attr(`${selector}/text`);
          const input = this.floatingInput.nativeElement;

          const { left, top } = this.paperContainer.nativeElement.getBoundingClientRect();
          
          console.log('entro al evento, ' + left + ', ' + top)
          input.value = textoActual;
          input.style.left = `${x - left}px`;
          input.style.top = `${y - top}px`;
          input.style.display = 'block';
          input.focus();

          this.editingModel = model;
          this.editingSelector = selector;
        }
      }
    );
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const tipo = event.dataTransfer?.getData('text/plain');
    const { left, top } = this.paperContainer.nativeElement.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;

    if (tipo) {
      this.diagramaService.createElement(tipo, x, y);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  guardarTexto(): void {
    const input = this.floatingInput.nativeElement;
    let nuevoTexto = input.value.trim();

    const selector = this.editingSelector;

    if (!nuevoTexto) {
      switch (selector) {
        case 'headerLabel':
          nuevoTexto = '[Entidad]';
        break;
        case 'bodyLabel':
          nuevoTexto = '[atributos]';
        break;
        case 'footerLabel':
          nuevoTexto = '[métodos]';
        break;
        default:
          nuevoTexto = '[valor vacío]';
    }
  }

    if (this.editingModel && this.editingSelector) {
      this.editingModel.attr(`${this.editingSelector}/text`, nuevoTexto);

      if (nuevoTexto.includes('\n') || this.editingSelector === 'bodyLabel' || this.editingSelector === 'footerLabel') {
        ajustarAlturaDinamica(
          this.editingModel,
          this.editingSelector,
          this.editingSelector.replace('Label', ''),
          'footer' 
        );
      }
    }

    input.style.display = 'none';
    this.editingModel = null!;
    this.editingSelector = '';
  }

  onEnter(event: Event): void {
    if (event instanceof KeyboardEvent && event.key === 'Enter') {
      event.stopPropagation();
    }
  }

}