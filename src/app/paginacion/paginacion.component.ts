import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginacion',
  standalone: true,
  imports: [],
  templateUrl: './paginacion.component.html',
  styleUrl: './paginacion.component.css'
})
export class PaginacionComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;

  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();

  onNext() {
    this.next.emit();
  }

  onPrev() {
    this.prev.emit();
  }
}
