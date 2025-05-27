import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent {

  onDragStart(event: DragEvent, tipo: string) {
    if (event.dataTransfer) {
      // Configurar el tipo de datos que se arrastra
      event.dataTransfer.setData('text/plain', tipo);
      event.dataTransfer.effectAllowed = 'copy';
      
      // Agregar clase visual durante el drag
      const target = event.target as HTMLElement;
      target.classList.add('dragging');
      
      console.log(`Iniciando drag de: ${tipo}`);
    }
  }

  onDragEnd(event: DragEvent) {
    // Remover clase visual al terminar el drag
    const target = event.target as HTMLElement;
    target.classList.remove('dragging');
  }


}
