import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../services/reportes.service';
import { EquipoService } from '../../services/equipo.service';
import { Incidencia } from '../../model/incidencia.model';
import { Equipo } from '../../model/equipo.model';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements OnInit {
  private readonly reportesService = inject(ReportesService);
  private readonly equipoService = inject(EquipoService);
  private readonly cdr = inject(ChangeDetectorRef);

  codigoEquipo: string = 'PC-001';
  historial: Incidencia[] = [];
  equipos: Equipo[] = [];
  selectedEquipo?: Equipo;

  mensaje = '';
  error = '';

  ngOnInit(): void {
    this.equipoService.getEquipos().subscribe({
      next: (data) => {
        this.equipos = data;
        if (data.length > 0) {
          this.codigoEquipo = data[0].codigo;
          this.consultarHistorial();
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar equipos:', err)
    });
  }

  consultarHistorial(): void {
    if (!this.codigoEquipo) {
      this.error = 'Ingrese un código de equipo.';
      this.historial = [];
      return;
    }

    this.selectedEquipo = this.equipos.find(e => e.codigo.toLowerCase() === this.codigoEquipo.toLowerCase());

    this.reportesService.getHistorial(this.codigoEquipo).subscribe({
      next: (data) => {
        this.historial = data;
        this.error = '';
        if (data.length === 0) {
          this.mensaje = 'No se encontraron incidencias para este equipo.';
        } else {
          this.mensaje = '';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.historial = [];
        this.error = err?.error?.message || err?.message || 'Error al consultar el historial';
        this.mensaje = '';
        this.cdr.detectChanges();
      }
    });
  }
}
