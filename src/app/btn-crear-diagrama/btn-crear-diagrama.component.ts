import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-btn-crear-diagrama',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ModalComponent],
  templateUrl: './btn-crear-diagrama.component.html',
  styleUrls: ['./btn-crear-diagrama.component.css']
})
export class BtnCrearDiagramaComponent {
  isModalVisible = false;

  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }
}
