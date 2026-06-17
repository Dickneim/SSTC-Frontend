import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incidencia, CanalRegistro } from '../model/incidencia.model';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/incidencias';

  getIncidencias(): Observable<Incidencia[]> {
    return this.http.get<Incidencia[]>(this.apiUrl);
  }

  registrarIncidencia(incidencia: {
    codigoEquipo: string;
    problema: string;
    canalRegistro: CanalRegistro;
    registradoPorId: number;
    diagnosticoInicial: string;
  }): Observable<unknown> {
    return this.http.post(this.apiUrl, incidencia);
  }

  asignarIncidencia(incidenciaId: number, tecnicoId: number): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${incidenciaId}/asignacion`, { tecnicoId });
  }

  solicitarRepuesto(incidenciaId: number, solicitud: {
    repuesto: string;
    cantidad: number;
  }): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/${incidenciaId}/solicitudes-repuesto`, solicitud);
  }

  registrarInforme(incidenciaId: number, informe: {
    descripcionSolucion: string;
    requirioRepuesto: boolean;
  }): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/${incidenciaId}/informe`, informe);
  }

  getTareas(tecnicoId: number): Observable<Incidencia[]> {
    return this.http.get<Incidencia[]>(`${this.apiUrl}/tecnico/${tecnicoId}/tareas`);
  }
}
