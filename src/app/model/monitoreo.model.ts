export interface Monitoreo {
  incidenciasPendientes: number;
  incidenciasSolucionadas: number;
  productividadTecnicos: Array<{
    tecnicoId: number;
    tecnico: string;
    pendientes: number;
    atendidasHoy: number;
    disponible: boolean;
  }>;
}
