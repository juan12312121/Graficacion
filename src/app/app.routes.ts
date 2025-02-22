import { Routes } from '@angular/router';
import { CompartidosComponent } from './compartidos/compartidos.component';
import { FavoritosComponent } from './favoritos/favoritos.component';
import { LoginComponent } from './login/login.component';
import { MisDiagramasComponent } from './mis-diagramas/mis-diagramas.component';
import { PapeleraComponent } from './papelera/papelera.component';
import { PrincipalComponent } from './principal/principal.component';
import { RegistroComponent } from './registro/registro.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {path: 'registro', component: RegistroComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'principal', component: PrincipalComponent },
    { path: 'mis-diagramas', component: MisDiagramasComponent },
    {path: 'compartidos', component: CompartidosComponent},
    {path: 'favoritos', component: FavoritosComponent},
    {path: 'papelera', component: PapeleraComponent}
];
