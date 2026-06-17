import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesService } from '../../services/reportes.service';
import { IncidenciaService } from '../../services/incidencia.service';
import { Monitoreo } from '../../model/monitoreo.model';
import { Incidencia } from '../../model/incidencia.model';

@Component({
  selector: 'app-monitorear',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monitorear.component.html'
})
export class MonitorearComponent implements OnInit {
  private readonly reportesService = inject(ReportesService);
  private readonly incidenciaService = inject(IncidenciaService);

  monitoreo?: Monitoreo;
  incidenciasComplicadas: Incidencia[] = [];

  ngOnInit(): void {
    this.reportesService.getMonitoreo().subscribe({
      next: (data) => this.monitoreo = data,
      error: (err) => console.error('Error al cargar monitoreo:', err)
    });

    this.incidenciaService.getIncidencias().subscribe({
      next: (data) => {
        // We filter for pending ones as "complicadas" or those that might have long duration
        this.incidenciasComplicadas = data.filter(i => i.estado === 'PENDIENTE');
      },
      error: (err) => console.error('Error al cargar incidencias:', err)
    });
  }

  getSaturadosCount(): number {
    if (!this.monitoreo) return 0;
    return this.monitoreo.productividadTecnicos.filter(t => !t.disponible).length;
  }
}
