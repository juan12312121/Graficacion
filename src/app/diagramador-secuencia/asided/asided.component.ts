import { Component } from '@angular/core';

@Component({
  selector: 'app-asided',
  standalone: true,
  imports: [],
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