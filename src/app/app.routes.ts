import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { AsignarComponent } from './components/asignar/asignar.component';
import { DisponibilidadComponent } from './components/disponibilidad/disponibilidad.component';
import { TareasComponent } from './components/tareas/tareas.component';
import { HistorialComponent } from './components/historial/historial.component';
import { DiccionarioComponent } from './components/diccionario/diccionario.component';
import { MonitorearComponent } from './components/monitorear/monitorear.component';
import { InformeComponent } from './components/informe/informe.component';
import { RepuestoComponent } from './components/repuesto/repuesto.component';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'registrar', component: RegistrarComponent },
  { path: 'asignar', component: AsignarComponent },
  { path: 'disponibilidad', component: DisponibilidadComponent },
  { path: 'tareas', component: TareasComponent },
  { path: 'historial', component: HistorialComponent },
  { path: 'diccionario', component: DiccionarioComponent },
  { path: 'monitorear', component: MonitorearComponent },
  { path: 'informe/:id', component: InformeComponent },
  { path: 'repuesto/:id', component: RepuestoComponent },
  { path: '**', redirectTo: 'landing' }
];
