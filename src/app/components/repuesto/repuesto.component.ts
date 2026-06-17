import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IncidenciaService } from '../../services/incidencia.service';
import { Incidencia } from '../../model/incidencia.model';

@Component({
  selector: 'app-repuesto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './repuesto.component.html'
})
export class RepuestoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly incidenciaService = inject(IncidenciaService);

  incidenciaId!: number;
  incidencia?: Incidencia;

  repuesto = '';
  cantidad = 1;
  justificacion = ''; // Local display only

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
      },
      error: (err) => console.error('Error al cargar incidencia:', err)
    });
  }

  enviarSolicitud(): void {
    if (!this.repuesto) {
      this.error = 'Seleccione un repuesto.';
      return;
    }

    this.incidenciaService.solicitarRepuesto(this.incidenciaId, {
      repuesto: this.repuesto,
      cantidad: this.cantidad
    }).subscribe({
      next: () => {
        alert('La solicitud se envió correctamente. Por favor, espere la respuesta de Logística.');
        this.router.navigate(['/tareas']);
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Error al enviar la solicitud';
      }
    });
  }
}
