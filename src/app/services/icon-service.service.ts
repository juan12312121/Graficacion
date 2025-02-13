import { Injectable } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faBox,
  faBrain,
  faClipboard, // Added faClipboard
  faClock,
  faCogs,
  faDatabase,
  faEdit,
  faEllipsisV,
  faEnvelope,
  faFilter,
  faHome,
  faList,
  faLock,
  faNetworkWired,
  faProjectDiagram,
  faQuestionCircle,
  faRandom,
  faSearch,
  faShareAlt,
  faSitemap,
  faSort,
  faStar,
  faTags,
  faTimesCircle,
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
    tags: faTags,
    search: faSearch,
    filter: faFilter,
    sort: faSort,
    ellipsisV: faEllipsisV,
    cogs: faCogs,
    database: faDatabase,
    list: faList,
    box: faBox,
    clipboard: faClipboard,
    timesCircle: faTimesCircle
  };

  constructor(private library: FaIconLibrary) {
    // Register icons in the library
    this.library.addIcons(
      faHome, faEnvelope, faLock, faProjectDiagram, faQuestionCircle,
      faTrash, faStar, faShareAlt, faSitemap, faRandom, faNetworkWired,
      faBrain, faEdit, faClock, faUser, faTags, faSearch, faFilter,
      faSort, faEllipsisV, faCogs, faDatabase, faList, faBox, faClipboard, faTimesCircle
    );
  }

  getIcon(name: keyof typeof this.icons) {
    return this.icons[name];
  }
}
