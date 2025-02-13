import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MisDiagramasComponent } from './mis-diagramas/mis-diagramas.component';
import { PrincipalComponent } from './principal/principal.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'principal', component: PrincipalComponent },
    { path: 'mis-diagramas', component: MisDiagramasComponent }
];
