import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportesService } from '../../services/reportes.service';
import { TecnicoService } from '../../services/tecnico.service';
import { Monitoreo } from '../../model/monitoreo.model';
import { Tecnico } from '../../model/tecnico.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit {
  private readonly reportesService = inject(ReportesService);
  private readonly tecnicoService = inject(TecnicoService);
  private readonly cdr = inject(ChangeDetectorRef);

  monitoreo?: Monitoreo;
  tecnicos: Tecnico[] = [];

  ngOnInit(): void {
    this.reportesService.getMonitoreo().subscribe({
      next: (data) => {
        this.monitoreo = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar monitoreo:', err)
    });

    this.tecnicoService.getTecnicos().subscribe({
      next: (data) => {
        this.tecnicos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar técnicos:', err)
    });
  }

  getDisponibleCount(): number {
    return this.tecnicos.filter(t => t.disponible).length;
  }

  getActiveCount(): number {
    return this.tecnicos.filter(t => t.activo).length;
  }
}

