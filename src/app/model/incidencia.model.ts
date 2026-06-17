import { Tecnico } from './tecnico.model';

export type EstadoIncidencia = 'PENDIENTE' | 'SOLUCIONADO';
export type CanalRegistro = 'EMAIL' | 'TELEFONO';

export interface Incidencia {
  id: number;
  problema: string;
  estado: EstadoIncidencia;
  canalRegistro: CanalRegistro;
  fechaRegistro: string;
  equipo: { 
    codigo: string; 
    responsable: { 
      nombre: string; 
      area: string;
    } 
  };
  tecnicoAsignado?: Tecnico | null;
}
