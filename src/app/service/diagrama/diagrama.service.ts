import { Injectable } from '@angular/core';
import * as joint from 'jointjs';
import { ClaseUML } from '../../diagramador-classe/forms/clase-uml';
import { InterfazUML } from '../../diagramador-classe/forms/interfaz-uml';
@Injectable({
  providedIn: 'root'
})
export class DiagramaService {
  private graph!: joint.dia.Graph;
  private paper!: joint.dia.Paper;

    initPaper(container: HTMLElement): joint.dia.Paper {
    this.graph = new joint.dia.Graph();

    this.paper = new joint.dia.Paper({
      el: container,
      model: this.graph,
      width: 1480,
      height: 820,
      gridSize: 10,
      drawGrid: true,
      background: { color: '#fafafa' }
    });

    return this.paper;
    }


    getGraph(): joint.dia.Graph {
    return this.graph;
    }

    getPaper(): joint.dia.Paper {
    return this.paper;
    }

    clear() {
    this.graph.clear();
    }

    createElement(tipo: string, x: number, y: number) {
    
      let element: joint.dia.Element;

      switch (tipo) {
      case 'Clase':
        element = new ClaseUML();
        element.resize(200, 130);
        break;
      case 'Interfaz':
        element = new InterfazUML();
        element.resize(200, 130);
        break;
      default: 
       throw new Error('Tipo de figura no soportado');
      }

      element.position(x, y);
      this.graph.addCell(element);
    }
}
