import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IncidenciaService } from '../../services/incidencia.service';
import { TecnicoService } from '../../services/tecnico.service';
import { Incidencia } from '../../model/incidencia.model';
import { Tecnico } from '../../model/tecnico.model';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.css'
})
export class TareasComponent implements OnInit {
  private readonly incidenciaService = inject(IncidenciaService);
  private readonly tecnicoService = inject(TecnicoService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  tecnicos: Tecnico[] = [];
  selectedTecnicoId: number = 1;
  tareas: Incidencia[] = [];

  tareasPendientes: Incidencia[] = [];
  tareasSolucionadas: Incidencia[] = [];

  selectedTareaId: number | null = null;

  ngOnInit(): void {
    this.tecnicoService.getTecnicos().subscribe({
      next: (data) => {
        this.tecnicos = data;
        if (data.length > 0) {
          this.selectedTecnicoId = data[0].id;
          this.cargarTareas();
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar técnicos:', err)
    });
  }

  cargarTareas(): void {
    this.incidenciaService.getTareas(this.selectedTecnicoId).subscribe({
      next: (data) => {
        this.tareas = data;
        this.tareasPendientes = data.filter(t => t.estado === 'PENDIENTE');
        this.tareasSolucionadas = data.filter(t => t.estado === 'SOLUCIONADO');
        this.selectedTareaId = null;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar tareas:', err)
    });
  }

  seleccionarTarea(id: number): void {
    this.selectedTareaId = id;
  }

  irASolicitarRepuesto(): void {
    if (!this.selectedTareaId) return;
    this.router.navigate(['/repuesto', this.selectedTareaId]);
  }

  irARegistrarInforme(): void {
    if (!this.selectedTareaId) return;
    this.router.navigate(['/informe', this.selectedTareaId]);
  }
}
