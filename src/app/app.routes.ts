import { Routes } from '@angular/router';
import { CompartidosComponent } from './compartidos/compartidos.component';
import { DiagramadorClasesComponent } from './diagramador-classe/diagramador-clases/diagramador-clases.component';
import { DiagramadorComponentesComponent } from './diagramador-componentes/diagramador-componentes/diagramador-componentes.component';
import { DiagramadorPaquetesComponent } from './diagramador-paquetes/diagramador-paquetes/diagramador-paquetes.component';
import { DiagramadorSecuenciaComponent } from './diagramador-secuencia/diagramador-secuencia/diagramador-secuencia.component';
import { CreadorDiagramadorComponent } from './diagramador/creador-diagramador/creador-diagramador.component';
import { FavoritosComponent } from './favoritos/favoritos.component';
import { LoginComponent } from './login/login.component';
import { MisDiagramasComponent } from './mis-diagramas/mis-diagramas.component';
import { PapeleraComponent } from './papelera/papelera.component';
import { PrincipalComponent } from './principal/principal.component';
import { RegistroComponent } from './registro/registro.component';
import {ExampleDClaseComponent} from './example-diagrams/example-d-clase/example-d-clase.component';
import {ExampleDComponentesComponent} from './example-diagrams/example-d-componentes/example-d-componentes.component';
import { ExampleDPaquetesComponent } from './example-diagrams/example-d-paquetes/example-d-paquetes.component';
import { ExampleDSecuenciaComponent } from './example-diagrams/example-d-secuencia/example-d-secuencia.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {path: 'registro', component: RegistroComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'principal', component: PrincipalComponent },
    { path: 'mis-diagramas', component: MisDiagramasComponent },
    {path: 'compartidos', component: CompartidosComponent},
    {path: 'favoritos', component: FavoritosComponent},
    {path: 'papelera', component: PapeleraComponent},
    {path: 'diagramador-base', component:CreadorDiagramadorComponent},
    {path: 'diagramador-clases', component: DiagramadorClasesComponent},
    {path: 'diagramador-paquetes', component:DiagramadorPaquetesComponent},
    {path: 'diagramador-componentes', component:DiagramadorComponentesComponent},
    {path: 'diagramador-secuencias', component:DiagramadorSecuenciaComponent},
    {path: 'example-d-clase', component:ExampleDClaseComponent},
    {path: 'example-d-componentes', component:ExampleDComponentesComponent},
    {path: 'example-d-paquetes',component:ExampleDPaquetesComponent},
    {path: 'example-d-secuencia',component:ExampleDSecuenciaComponent}
];