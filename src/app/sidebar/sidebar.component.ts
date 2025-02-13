import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // Import this
import { BtnCrearDiagramaComponent } from '../btn-crear-diagrama/btn-crear-diagrama.component';
import { IconService } from '../services/icon-service.service';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FontAwesomeModule,RouterModule,BtnCrearDiagramaComponent], // Add this to the imports array
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  schemas: [NO_ERRORS_SCHEMA] 
})
export class SidebarComponent {
  constructor(public iconService: IconService, private router: Router) {}
}
