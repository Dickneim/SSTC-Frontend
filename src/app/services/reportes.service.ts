import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Monitoreo } from '../model/monitoreo.model';
import { Incidencia } from '../model/incidencia.model';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/reportes';

  getMonitoreo(): Observable<Monitoreo> {
    return this.http.get<Monitoreo>(`${this.apiUrl}/monitoreo`);
  }

  getHistorial(codigoEquipo: string): Observable<Incidencia[]> {
    return this.http.get<Incidencia[]>(`${this.apiUrl}/equipos/${codigoEquipo}/historial`);
  }
}
