import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidenciaService } from '../../services/incidencia.service';
import { TecnicoService } from '../../services/tecnico.service';
import { Incidencia } from '../../model/incidencia.model';
import { Tecnico } from '../../model/tecnico.model';

@Component({
  selector: 'app-asignar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asignar.component.html'
})
export class AsignarComponent implements OnInit {
  private readonly incidenciaService = inject(IncidenciaService);
  private readonly tecnicoService = inject(TecnicoService);
  private readonly cdr = inject(ChangeDetectorRef);

  incidencias: Incidencia[] = [];
  tecnicos: Tecnico[] = [];

  selectedIncidenciaId: number | null = null;
  selectedTecnicoId: number | null = null;

  mensaje = '';
  error = '';

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.incidenciaService.getIncidencias().subscribe({
      next: (data) => {
        // filter out already assigned incidents
        this.incidencias = data.filter(inc => !inc.tecnicoAsignado);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar incidencias:', err)
    });

    this.tecnicoService.getTecnicos().subscribe({
      next: (data) => {
        this.tecnicos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar técnicos:', err)
    });
  }

  seleccionarIncidencia(id: number): void {
    this.selectedIncidenciaId = id;
    this.mensaje = '';
    this.error = '';
  }

  asignarIncidencia(): void {
    if (!this.selectedIncidenciaId) {
      this.error = 'Seleccione una incidencia de la bandeja.';
      this.mensaje = '';
      return;
    }
    if (!this.selectedTecnicoId) {
      this.error = 'Seleccione un técnico.';
      this.mensaje = '';
      return;
    }

    this.incidenciaService.asignarIncidencia(this.selectedIncidenciaId, this.selectedTecnicoId).subscribe({
      next: () => {
        this.mensaje = '¡Incidencia asignada correctamente!';
        this.error = '';
        this.selectedIncidenciaId = null;
        this.selectedTecnicoId = null;
        this.cargarDatos();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Error al asignar la incidencia';
        this.mensaje = '';
        this.cdr.detectChanges();
      }
    });
  }
}
