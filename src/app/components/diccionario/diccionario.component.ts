import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FallaService } from '../../services/falla.service';
import { Falla } from '../../model/falla.model';

@Component({
  selector: 'app-diccionario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diccionario.component.html',
  styleUrl: './diccionario.component.css'
})
export class DiccionarioComponent implements OnInit {
  private readonly fallaService = inject(FallaService);
  private readonly cdr = inject(ChangeDetectorRef);

  fallas: Falla[] = [];
  searchText: string = '';

  nuevaFalla = {
    titulo: '',
    sintomas: '',
    solucionRecomendada: '',
    categoria: ''
  };

  mensaje = '';
  error = '';

  ngOnInit(): void {
    this.cargarFallas();
  }

  cargarFallas(): void {
    this.fallaService.getFallas().subscribe({
      next: (data) => {
        this.fallas = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar fallas:', err)
    });
  }

  get filteredFallas(): Falla[] {
    if (!this.searchText.trim()) return this.fallas;
    const q = this.searchText.toLowerCase();
    return this.fallas.filter(f => 
      f.titulo.toLowerCase().includes(q) || 
      (f.sintomas && f.sintomas.toLowerCase().includes(q)) || 
      f.solucionRecomendada.toLowerCase().includes(q) || 
      f.categoria.toLowerCase().includes(q)
    );
  }

  registrarFalla(): void {
    if (!this.nuevaFalla.categoria || !this.nuevaFalla.titulo || !this.nuevaFalla.solucionRecomendada) {
      this.error = 'Complete todos los campos obligatorios.';
      return;
    }
    // Match sintomas to title if it's empty
    if (!this.nuevaFalla.sintomas) {
      this.nuevaFalla.sintomas = this.nuevaFalla.titulo;
    }

    this.fallaService.registrarFalla(this.nuevaFalla).subscribe({
      next: () => {
        this.mensaje = 'La falla se ha registrado en el diccionario.';
        this.error = '';
        this.nuevaFalla = {
          titulo: '',
          sintomas: '',
          solucionRecomendada: '',
          categoria: ''
        };
        this.cargarFallas();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Error al guardar la falla';
        this.mensaje = '';
        this.cdr.detectChanges();
      }
    });
  }
}
