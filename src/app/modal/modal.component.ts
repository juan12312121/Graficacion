import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() isModalVisible = false;
  @Output() closeModalEvent = new EventEmitter<void>();

  closeModal() {
    this.isModalVisible = false;
    this.closeModalEvent.emit(); // Notifica al padre
  }
}
