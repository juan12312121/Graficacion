import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // Import this
import { IconService } from '../services/icon-service.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FontAwesomeModule], // Add this to the imports array
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  schemas: [NO_ERRORS_SCHEMA]  // Keep this line for error-free rendering
})
export class SidebarComponent {
  constructor(public iconService: IconService) {}
}
