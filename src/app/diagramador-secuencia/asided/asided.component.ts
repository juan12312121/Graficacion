import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-asided',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './asided.component.html',
  styleUrl: './asided.component.css'
})
export class AsidedComponent {
  router: any;
goHome() {
  // Lógica para navegar al inicio
  this.router.navigate(['/principal']);
}

 onDragStart(event: DragEvent, tipo: string) {
    event.dataTransfer?.setData('text/plain', tipo);
  }
}