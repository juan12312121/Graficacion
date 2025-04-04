import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event, NavigationEnd, NavigationError, NavigationStart, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() isModalVisible = false;
  @Output() closeModalEvent = new EventEmitter<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los eventos del router para ver los logs en consola
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        console.log('NavigationStart:', event);
      }
      if (event instanceof NavigationEnd) {
        console.log('NavigationEnd:', event);
      }
      if (event instanceof NavigationError) {
        console.error('NavigationError:', event);
      }
    });
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.closeModalEvent.emit();
  }

  toggleDescription(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const descriptionEl = target.previousElementSibling;
    if (descriptionEl) {
      descriptionEl.classList.toggle('expanded');
    }
  }
  
}
