import { CommonModule } from '@angular/common';
import { AfterViewInit, Component,ViewChild, ElementRef } from '@angular/core';
import { ToolbarComponent } from "../../toolbar/toolbar.component";
import { AsideComponent } from '../aside/aside.component';
import { DiagramaService } from '../../service/diagrama/diagrama.service';
import { ajustarAlturaDinamica } from '../../shared-class-components/resize-func';
import { getUMLSectionConfig } from '../../shared-class-components/resize-utils';
import { ClaseUML } from '../forms/clase-uml';
import { LinkService } from '../../service/figurasService/link-service';

@Component({
  selector: 'app-diagramador-clases',
  standalone: true,
  imports: [CommonModule, AsideComponent, ToolbarComponent], 
  templateUrl: './diagramador-clases.component.html',
  styleUrls: ['./diagramador-clases.component.css'] 
})
export class DiagramadorClasesComponent implements AfterViewInit{

  @ViewChild('paperContainer', { static: true }) paperContainer!: ElementRef;
  @ViewChild('floatingInput') floatingInput!: ElementRef;

  editingModel!: joint.dia.Element;
  editingSelector!: string;
  private origenSeleccionado: string | null = null;
  private destinoSeleccionado: string | null = null;

  constructor(private linkService: LinkService, private diagramaService: DiagramaService) {}

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


        paper.on('element:pointerclick', (elementView: joint.dia.ElementView) => {
          const id = elementView.model.id.toString();
          if (!this.origenSeleccionado) {
            this.origenSeleccionado = id;
            console.log('Origen seleccionado:', id);
          }else if (!this.destinoSeleccionado) {
            this.destinoSeleccionado = id;
            console.log('Destino seleccionado:', id);

            this.diagramaService.crearRelacion(this.origenSeleccionado, this.destinoSeleccionado);


            this.origenSeleccionado = null;
            this.destinoSeleccionado = null;
          }
        });

        console.log('target selector:', selector);

        if (selector?.endsWith('Label')) {
          const textoActual = model.attr(`${selector}/text`);
          const input = this.floatingInput.nativeElement;

          const { left, top } = this.paperContainer.nativeElement.getBoundingClientRect();
          
          console.log('entro al evento, ' + left + ', ' + top)
          input.value = textoActual;
          input.style.display = 'block';
          input.focus();

          this.editingModel = model;
          this.editingSelector = selector;
        }
      }
        
    );

      paper.on('link:connect', ({ model }) => {
      const source = model.get('source');
      const target = model.get('target');
      
      console.log(source.id,' 2.- ' ,source.port, ' 3.- ' ,target.id, ' 4.- ' , target.port)

      if (!source?.id || !target?.id) return;

        model.remove(); 
      
        const newLink = this.linkService.crearLink(source.id, source.port, target.id, target.port);
       this.diagramaService.getGraph().addCell(newLink);
        

        
            
    });

  }           // ESTE ES EL FINAL DEL AFTERVIEWINIT()

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
        nuevoTexto = '[nombre de clase]';
        break;
      case 'bodyLabel':
        nuevoTexto = '[atributos de clase]';
        break;
      case 'footerLabel':
        nuevoTexto = '[métodos de clase]';
        break;
      default:
        nuevoTexto = '[vacío]';
    }
  }

  if (this.editingModel && selector) {
    this.editingModel.attr(`${selector}/text`, nuevoTexto);

    const { selectorContenedor, siguienteBloque, alturaMinima } = getUMLSectionConfig(selector);

    ajustarAlturaDinamica(
      this.editingModel,
      selector,
      selectorContenedor,
      siguienteBloque,
      alturaMinima
    );
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