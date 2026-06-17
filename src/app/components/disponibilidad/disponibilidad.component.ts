import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TecnicoService } from '../../services/tecnico.service';
import { Tecnico } from '../../model/tecnico.model';

@Component({
  selector: 'app-disponibilidad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './disponibilidad.component.html'
})
export class DisponibilidadComponent implements OnInit {
  private readonly tecnicoService = inject(TecnicoService);

  tecnicos: Tecnico[] = [];

  ngOnInit(): void {
    this.tecnicoService.getTecnicos().subscribe({
      next: (data) => this.tecnicos = data,
      error: (err) => console.error('Error al cargar técnicos:', err)
    });
  }

  getLoadPercent(tecnico: Tecnico): number {
    if (tecnico.limiteAtencion <= 0) return 0;
    return Math.min(100, (tecnico.incidenciasPendientes / tecnico.limiteAtencion) * 100);
  }

  getStatusClass(tecnico: Tecnico): string {
    const ratio = tecnico.incidenciasPendientes / tecnico.limiteAtencion;
    if (tecnico.incidenciasPendientes >= tecnico.limiteAtencion) {
      return 'text-red-700 bg-red-100';
    } else if (ratio >= 0.6) {
      return 'text-amber-700 bg-amber-100';
    } else {
      return 'text-emerald-700 bg-emerald-100';
    }
  }

  getStatusLabel(tecnico: Tecnico): string {
    const ratio = tecnico.incidenciasPendientes / tecnico.limiteAtencion;
    if (tecnico.incidenciasPendientes >= tecnico.limiteAtencion) {
      return 'Al límite';
    } else if (ratio >= 0.6) {
      return 'Carga alta';
    } else {
      return 'Disponible';
    }
  }

  getFillColorClass(tecnico: Tecnico): string {
    const ratio = tecnico.incidenciasPendientes / tecnico.limiteAtencion;
    if (tecnico.incidenciasPendientes >= tecnico.limiteAtencion) {
      return 'bg-red-500';
    } else if (ratio >= 0.6) {
      return 'bg-amber-500';
    } else {
      return 'bg-emerald-500';
    }
  }
}
