import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tecnico } from '../model/tecnico.model';
import { MiembroArea } from '../model/miembro-area.model';

@Injectable({
  providedIn: 'root'
})
export class TecnicoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1';

  getTecnicos(): Observable<Tecnico[]> {
    return this.http.get<Tecnico[]>(`${this.apiUrl}/tecnicos`);
  }

  getMiembros(): Observable<MiembroArea[]> {
    return this.http.get<MiembroArea[]>(`${this.apiUrl}/miembros-area`);
  }
}
