import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidenciaService } from '../../services/incidencia.service';
import { EquipoService } from '../../services/equipo.service';
import { TecnicoService } from '../../services/tecnico.service';
import { Equipo } from '../../model/equipo.model';
import { MiembroArea } from '../../model/miembro-area.model';
import { CanalRegistro } from '../../model/incidencia.model';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css'
})
export class RegistrarComponent implements OnInit {
  private readonly incidenciaService = inject(IncidenciaService);
  private readonly equipoService = inject(EquipoService);
  private readonly tecnicoService = inject(TecnicoService);
  private readonly cdr = inject(ChangeDetectorRef);

  equipos: Equipo[] = [];
  miembros: MiembroArea[] = [];

  nuevaIncidencia = {
    codigoEquipo: '',
    problema: '',
    canalRegistro: 'TELEFONO' as CanalRegistro,
    registradoPorId: 0,
    diagnosticoInicial: ''
  };

  mensaje = '';
  error = '';

  ngOnInit(): void {
    this.equipoService.getEquipos().subscribe({
      next: (data) => {
        this.equipos = data;
        if (data.length > 0) {
          this.nuevaIncidencia.codigoEquipo = data[0].codigo;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar equipos:', err)
    });

    this.tecnicoService.getMiembros().subscribe({
      next: (data) => {
        this.miembros = data;
        if (data.length > 0) {
          this.nuevaIncidencia.registradoPorId = data[0].id;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar miembros:', err)
    });
  }

  registrarIncidencia(): void {
    if (!this.nuevaIncidencia.codigoEquipo || !this.nuevaIncidencia.problema) {
      this.error = 'Complete todos los campos obligatorios.';
      this.mensaje = '';
      return;
    }

    this.incidenciaService.registrarIncidencia(this.nuevaIncidencia).subscribe({
      next: () => {
        this.mensaje = '¡Incidencia registrada correctamente!';
        this.error = '';
        // Reset form
        this.nuevaIncidencia.problema = '';
        this.nuevaIncidencia.diagnosticoInicial = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Error al conectar con el servidor';
        this.mensaje = '';
        this.cdr.detectChanges();
      }
    });
  }
}
