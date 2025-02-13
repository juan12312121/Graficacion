import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconService } from '../services/icon-service.service';


@Component({
  selector: 'app-btn-crear-diagrama',
  standalone: true,
  imports: [FontAwesomeModule,CommonModule],
  templateUrl: './btn-crear-diagrama.component.html',
  styleUrls: ['./btn-crear-diagrama.component.css']
})
export class BtnCrearDiagramaComponent {
  
  isModalVisible = false;

  constructor(public iconService: IconService) {}

  // Open modal
  openModal() {
    this.isModalVisible = true;
  }

  // Close modal
  closeModal() {
    this.isModalVisible = false;
  }
}
