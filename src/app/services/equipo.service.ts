import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipo } from '../model/equipo.model';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.url}/equipos`;

  getEquipos(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.apiUrl);
  }
}
