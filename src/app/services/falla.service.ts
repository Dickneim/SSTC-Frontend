import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Falla } from '../model/falla.model';

@Injectable({
  providedIn: 'root'
})
export class FallaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/diccionario-fallas';

  getFallas(): Observable<Falla[]> {
    return this.http.get<Falla[]>(this.apiUrl);
  }

  registrarFalla(falla: {
    titulo: string;
    sintomas: string;
    solucionRecomendada: string;
    categoria: string;
  }): Observable<unknown> {
    return this.http.post(this.apiUrl, falla);
  }
}
