import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IncidenciaService } from '../../services/incidencia.service';
import { FallaService } from '../../services/falla.service';
import { Incidencia } from '../../model/incidencia.model';

@Component({
  selector: 'app-informe',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './informe.component.html'
})
export class InformeComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly incidenciaService = inject(IncidenciaService);
  private readonly fallaService = inject(FallaService);
  private readonly cdr = inject(ChangeDetectorRef);

  incidenciaId!: number;
  incidencia?: Incidencia;

  diagnosticoFinal = '';
  descripcionSolucion = '';
  requirioRepuesto = false;
  publicarDiccionario = false;

  mensaje = '';
  error = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.incidenciaId = +idParam;
      this.cargarIncidencia();
    } else {
      this.router.navigate(['/tareas']);
    }
  }

  cargarIncidencia(): void {
    this.incidenciaService.getIncidencias().subscribe({
      next: (data) => {
        this.incidencia = data.find(i => i.id === this.incidenciaId);
        if (!this.incidencia) {
          this.error = 'No se encontró la incidencia.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar incidencia:', err)
    });
  }

  cerrarTicket(): void {
    if (!this.descripcionSolucion) {
      this.error = 'Debe detallar la solución aplicada.';
      return;
    }

    this.incidenciaService.registrarInforme(this.incidenciaId, {
      descripcionSolucion: this.descripcionSolucion,
      requirioRepuesto: this.requirioRepuesto
    }).subscribe({
      next: () => {
        if (this.publicarDiccionario && this.incidencia) {
          this.fallaService.registrarFalla({
            titulo: `Falla en ${this.incidencia.equipo.codigo}: ${this.incidencia.problema}`,
            sintomas: this.diagnosticoFinal || this.incidencia.problema,
            solucionRecomendada: this.descripcionSolucion,
            categoria: 'Hardware'
          }).subscribe({
            next: () => this.finalizarRegistro(),
            error: () => this.finalizarRegistro() // Proceed anyway if dictionary fails
          });
        } else {
          this.finalizarRegistro();
        }
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Error al cerrar el ticket';
      }
    });
  }

  private finalizarRegistro(): void {
    alert('El informe técnico se ha registrado correctamente y el ticket ha sido cerrado.');
    this.router.navigate(['/tareas']);
  }
}
