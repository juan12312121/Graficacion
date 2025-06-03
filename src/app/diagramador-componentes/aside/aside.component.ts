import { Component } from '@angular/core';


@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {
 onDragStart(event: DragEvent, tipo: string) {
    event.dataTransfer?.setData('text/plain', tipo);
  }
}
