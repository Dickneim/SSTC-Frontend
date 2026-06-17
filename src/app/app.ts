import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

type EstadoIncidencia = 'PENDIENTE' | 'SOLUCIONADO';
type CanalRegistro = 'EMAIL' | 'TELEFONO';

interface Tecnico {
  id: number;
  nombre: string;
  limiteAtencion: number;
  incidenciasPendientes: number;
  disponible: boolean;
}

interface Incidencia {
  id: number;
  problema: string;
  estado: EstadoIncidencia;
  canalRegistro: CanalRegistro;
  fechaRegistro: string;
  equipo: { codigo: string; responsable: { nombre: string; area: string } };
  tecnicoAsignado?: Tecnico | null;
}

interface Equipo {
  id: number;
  codigo: string;
  responsable: { nombre: string };
}

interface MiembroArea {
  id: number;
  nombre: string;
  rol: string;
}

interface Falla {
  id: number;
  titulo: string;
  sintomas: string;
  solucionRecomendada: string;
  categoria: string;
}

interface Monitoreo {
  incidenciasPendientes: number;
  incidenciasSolucionadas: number;
  productividadTecnicos: Array<{
    tecnicoId: number;
    tecnico: string;
    pendientes: number;
    atendidasHoy: number;
    disponible: boolean;
  }>;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1';

  incidencias: Incidencia[] = [];
  tecnicos: Tecnico[] = [];
  equipos: Equipo[] = [];
  miembros: MiembroArea[] = [];
  fallas: Falla[] = [];
  historial: Incidencia[] = [];
  tareas: Incidencia[] = [];
  monitoreo?: Monitoreo;

  mensaje = '';
  error = '';
  tecnicoTareasId = 1;
  codigoHistorial = 'PC-001';

  nuevaIncidencia = {
    codigoEquipo: 'PC-001',
    problema: '',
    canalRegistro: 'TELEFONO' as CanalRegistro,
    registradoPorId: 1,
    diagnosticoInicial: ''
  };

  asignacion = {
    incidenciaId: 1,
    tecnicoId: 1
  };

  repuesto = {
    incidenciaId: 1,
    repuesto: '',
    cantidad: 1
  };

  informe = {
    incidenciaId: 1,
    descripcionSolucion: '',
    requirioRepuesto: false
  };

  nuevaFalla = {
    titulo: '',
    sintomas: '',
    solucionRecomendada: '',
    categoria: ''
  };

  ngOnInit(): void {
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.cargarIncidencias();
    this.cargarTecnicos();
    this.cargarEquipos();
    this.cargarMiembros();
    this.cargarFallas();
    this.cargarMonitoreo();
  }

  cargarIncidencias(): void {
    this.get<Incidencia[]>('/incidencias', data => this.incidencias = data);
  }

  cargarTecnicos(): void {
    this.get<Tecnico[]>('/tecnicos', data => this.tecnicos = data);
  }

  cargarEquipos(): void {
    this.get<Equipo[]>('/equipos', data => this.equipos = data);
  }

  cargarMiembros(): void {
    this.get<MiembroArea[]>('/miembros-area', data => this.miembros = data);
  }

  cargarFallas(): void {
    this.get<Falla[]>('/diccionario-fallas', data => this.fallas = data);
  }

  cargarMonitoreo(): void {
    this.get<Monitoreo>('/reportes/monitoreo', data => this.monitoreo = data);
  }

  registrarIncidencia(): void {
    this.post('/incidencias', this.nuevaIncidencia, 'Incidencia registrada');
  }

  asignarIncidencia(): void {
    this.put(`/incidencias/${this.asignacion.incidenciaId}/asignacion`, { tecnicoId: this.asignacion.tecnicoId }, 'Incidencia asignada');
  }

  solicitarRepuesto(): void {
    this.post(`/incidencias/${this.repuesto.incidenciaId}/solicitudes-repuesto`, {
      repuesto: this.repuesto.repuesto,
      cantidad: this.repuesto.cantidad
    }, 'Solicitud de repuesto registrada');
  }

  registrarInforme(): void {
    this.post(`/incidencias/${this.informe.incidenciaId}/informe`, {
      descripcionSolucion: this.informe.descripcionSolucion,
      requirioRepuesto: this.informe.requirioRepuesto
    }, 'Informe tecnico registrado');
  }

  registrarFalla(): void {
    this.post('/diccionario-fallas', this.nuevaFalla, 'Falla agregada al diccionario');
  }

  consultarTareas(): void {
    this.get<Incidencia[]>(`/incidencias/tecnico/${this.tecnicoTareasId}/tareas`, data => this.tareas = data);
  }

  consultarHistorial(): void {
    this.get<Incidencia[]>(`/reportes/equipos/${this.codigoHistorial}/historial`, data => this.historial = data);
  }

  private get<T>(path: string, next: (data: T) => void): void {
    this.http.get<T>(`${this.apiUrl}${path}`).subscribe({
      next,
      error: err => this.mostrarError(err)
    });
  }

  private post(path: string, body: unknown, ok: string): void {
    this.http.post(`${this.apiUrl}${path}`, body).subscribe({
      next: () => this.operacionOk(ok),
      error: err => this.mostrarError(err)
    });
  }

  private put(path: string, body: unknown, ok: string): void {
    this.http.put(`${this.apiUrl}${path}`, body).subscribe({
      next: () => this.operacionOk(ok),
      error: err => this.mostrarError(err)
    });
  }

  private operacionOk(ok: string): void {
    this.mensaje = ok;
    this.error = '';
    this.cargarTodo();
  }

  private mostrarError(err: any): void {
    this.error = err?.error?.message || err?.message || 'No se pudo conectar con el backend';
    this.mensaje = '';
  }
}
