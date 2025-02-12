import { Injectable } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faBrain,
  faClock,
  faEdit,
  faEllipsisV,
  faEnvelope,
  faFilter,
  faHome, faLock, faNetworkWired, faProjectDiagram,
  faQuestionCircle, faRandom,
  faSearch,
  faShareAlt, faSitemap,
  faSort,
  faStar,
  faTags,
  faTrash,
  faUser
} from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  private icons = {
    home: faHome,
    envelope: faEnvelope,
    lock: faLock,
    questionCircle: faQuestionCircle,
    projectDiagram: faProjectDiagram,
    trash: faTrash,
    star: faStar,
    shareAlt: faShareAlt,
    sitemap: faSitemap,
    random: faRandom,
    networkWired: faNetworkWired,
    brain: faBrain,
    edit: faEdit,
    clock: faClock,
    user: faUser,
    tags: faTags, // Asegúrate de que este icono está en la lista
    search: faSearch,
    filter: faFilter,
    sort: faSort,
    ellipsisV: faEllipsisV
  };


  constructor(private library: FaIconLibrary) {
    // Register icons
    this.library.addIcons(faHome, faEnvelope, faLock, faProjectDiagram, faQuestionCircle, 
                          faTrash, faStar, faShareAlt, faSitemap, faRandom, faNetworkWired, 
                          faBrain, faEdit, faClock, faUser, faTags, faSearch, faFilter, 
                          faSort, faEllipsisV);
  }

  getIcon(name: keyof typeof this.icons) {
    return this.icons[name];
  }
}
