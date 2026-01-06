/**
 * Datos de mock para todas las entidades
 * Estos datos simulan lo que vendría de SharePoint
 */

import { mockDelay } from './mockConfig';

// =====================
// USUARIOS
// =====================
export const mockUsers = [
  { Id: 1, Title: 'Juan Pérez', EMail: 'juan.perez@empresa.com' },
  { Id: 2, Title: 'María García', EMail: 'maria.garcia@empresa.com' },
  { Id: 3, Title: 'Carlos López', EMail: 'carlos.lopez@empresa.com' },
  { Id: 4, Title: 'Ana Martínez', EMail: 'ana.martinez@empresa.com' },
  { Id: 5, Title: 'Pedro Sánchez', EMail: 'pedro.sanchez@proveedor.com' },
];

// =====================
// LOCACIONES
// =====================
export const mockLocaciones = [
  { Id: 1, Title: 'Locación Norte A', Bloque: 'Bloque Norte', AREA: 'Área Norte' },
  { Id: 2, Title: 'Locación Norte B', Bloque: 'Bloque Norte', AREA: 'Área Norte' },
  { Id: 3, Title: 'Locación Sur A', Bloque: 'Bloque Sur', AREA: 'Área Sur' },
  { Id: 4, Title: 'Locación Sur B', Bloque: 'Bloque Sur', AREA: 'Área Sur' },
  { Id: 5, Title: 'Locación Centro', Bloque: 'Bloque Centro', AREA: 'Área Centro' },
];

// =====================
// EQUIPOS
// =====================
export const mockEquipos = [
  { Id: 1, Title: 'Equipo Alpha', Activo: true },
  { Id: 2, Title: 'Equipo Beta', Activo: true },
  { Id: 3, Title: 'Equipo Gamma', Activo: true },
  { Id: 4, Title: 'Equipo Delta', Activo: false },
];

// =====================
// ETIQUETAS
// =====================
export const mockEtiquetas = [
  { Id: 1, Title: 'Seguridad', Etapa: 'Todas' },
  { Id: 2, Title: 'Calidad', Etapa: 'Todas' },
  { Id: 3, Title: 'Medio Ambiente', Etapa: 'Todas' },
  { Id: 4, Title: 'Operaciones', Etapa: 'Construcción' },
  { Id: 5, Title: 'Mantenimiento', Etapa: 'Producción' },
];

// =====================
// SUB KPIs
// =====================
export const mockSubKPIs = [
  { Id: 1, Title: 'KPI Seguridad 1', Etapa: 'Construcción de Locación - E10' },
  { Id: 2, Title: 'KPI Seguridad 2', Etapa: 'Conexión de Pozos - E40' },
  { Id: 3, Title: 'KPI Calidad 1', Etapa: 'Inicio Prod - E40' },
  { Id: 4, Title: 'KPI Ambiental 1', Etapa: 'Todas' },
];

// =====================
// PROVEEDORES
// =====================
export const mockProveedores = [
  { 
    Id: 1, 
    Title: 'SERVICIOS_DELTA', 
    Activo: true, 
    Contacto: 'contacto@delta.com',
    ListaAsociada: {
      obiras: 'ObirasServiciosDelta',
      acciones: 'AccionesServiciosDelta',
      gestiones: 'GestionesServiciosDelta',
      etiquetas: 'EtiquetasServiciosDelta',
      responsableEtapa: 'ResponsablesServiciosDelta',
      equipos: 'EquiposServiciosDelta',
      locaciones: 'LocacionesServiciosDelta',
      subKPI: 'SubKPIServiciosDelta',
      gestionAnormalidad: 'GestionServiciosDelta',
      accionDefinitiva: 'AccionesServiciosDelta'
    }
  },
  { 
    Id: 2, 
    Title: 'CONSTRUCCIONES_NORTE', 
    Activo: true, 
    Contacto: 'info@norte.com',
    ListaAsociada: {
      obiras: 'ObirasConstruccionesNorte',
      acciones: 'AccionesConstruccionesNorte',
      gestiones: 'GestionesConstruccionesNorte',
      etiquetas: 'EtiquetasConstruccionesNorte',
      responsableEtapa: 'ResponsablesConstruccionesNorte',
      equipos: 'EquiposConstruccionesNorte',
      locaciones: 'LocacionesConstruccionesNorte',
      subKPI: 'SubKPIConstruccionesNorte',
      gestionAnormalidad: 'GestionConstruccionesNorte',
      accionDefinitiva: 'AccionesConstruccionesNorte'
    }
  },
  { 
    Id: 3, 
    Title: 'TRANSPORTES_SUR', 
    Activo: true, 
    Contacto: 'admin@sur.com',
    ListaAsociada: {
      obiras: 'ObirasTransportesSur',
      acciones: 'AccionesTransportesSur',
      gestiones: 'GestionesTransportesSur',
      etiquetas: 'EtiquetasTransportesSur',
      responsableEtapa: 'ResponsablesTransportesSur',
      equipos: 'EquiposTransportesSur',
      locaciones: 'LocacionesTransportesSur',
      subKPI: 'SubKPITransportesSur',
      gestionAnormalidad: 'GestionTransportesSur',
      accionDefinitiva: 'AccionesTransportesSur'
    }
  },
  { 
    Id: 4, 
    Title: 'LOGISTICA_CENTRAL', 
    Activo: true, 
    Contacto: 'logistica@central.com',
    ListaAsociada: {
      obiras: 'ObirasLogisticaCentral',
      acciones: 'AccionesLogisticaCentral',
      gestiones: 'GestionesLogisticaCentral',
      etiquetas: 'EtiquetasLogisticaCentral',
      responsableEtapa: 'ResponsablesLogisticaCentral',
      equipos: 'EquiposLogisticaCentral',
      locaciones: 'LocacionesLogisticaCentral',
      subKPI: 'SubKPILogisticaCentral',
      gestionAnormalidad: 'GestionLogisticaCentral',
      accionDefinitiva: 'AccionesLogisticaCentral'
    }
  },
  { 
    Id: 5, 
    Title: 'EMPRESA_INACTIVA', 
    Activo: false, 
    Contacto: 'n/a',
    ListaAsociada: null
  },
];

// =====================
// RESPONSABLES DE ETAPA
// =====================
export const mockResponsablesEtapa = [
  { Id: 1, Title: 'Responsable Construcción', Etapa: 'Construcción de Locación - E10', Usuario: mockUsers[0] },
  { Id: 2, Title: 'Responsable Conexión', Etapa: 'Conexión de Pozos - E40', Usuario: mockUsers[1] },
  { Id: 3, Title: 'Responsable Producción', Etapa: 'Inicio Prod - E40', Usuario: mockUsers[2] },
];

// =====================
// OBIRAS (Incidencias principales)
// =====================
export const mockObiras = [
  {
    Id: 1,
    Title: 'OBIRA-001',
    TituloDelProblema: 'Fuga detectada en válvula principal',
    TipoDeProblema: 'Seguridad',
    Etapa: 'Conexión de Pozos - E40',
    EstadoGeneral: '1. Nuevo',  // Corregido de '1. Abierto'
    Detalle: 'Se detectó una fuga menor en la válvula principal del sector norte. Requiere atención inmediata.',
    FechaDeOcurrenciaDelProblema: new Date('2025-12-15').toISOString(),
    PADLocacion: mockLocaciones[0],
    Equipo: mockEquipos[0],
    Bloque: { Id: 1, Title: 'Bloque Norte' },
    SubKPIAfectado: mockSubKPIs[1],
    QTY: 1,
    Unidad: 'Unidad',
    AccionInmediata: 'Se aisló la zona afectada y se notificó al supervisor',
    Proveedor: mockProveedores[0].Title,  // SERVICIOS_DELTA
    Author: mockUsers[0],
    Etiquetas: [mockEtiquetas[0], mockEtiquetas[1]],
    Activo: true,
    CausaRaizPreliminar: 'Desgaste de material',
    ResponsableItem: [mockUsers[1]],
    tieneAccionDefinitiva: true,
    tieneGestionAnormalidad: true,
    Created: new Date('2025-12-15').toISOString(),
  },
  {
    Id: 2,
    Title: 'OBIRA-002',
    TituloDelProblema: 'Retraso en entrega de materiales',
    TipoDeProblema: 'Calidad',
    Etapa: 'Construcción de Locación - E10',
    EstadoGeneral: '2. Causa raíz definida',  // Corregido de '2. En Proceso'
    Detalle: 'El proveedor no entregó los materiales en la fecha acordada, generando retrasos en el cronograma.',
    FechaDeOcurrenciaDelProblema: new Date('2025-12-20').toISOString(),
    PADLocacion: mockLocaciones[2],
    Equipo: mockEquipos[1],
    Bloque: { Id: 2, Title: 'Bloque Sur' },
    SubKPIAfectado: mockSubKPIs[0],
    QTY: 50,
    Unidad: 'Toneladas',
    AccionInmediata: 'Se contactó al proveedor para acelerar la entrega',
    Proveedor: mockProveedores[1].Title,  // CONSTRUCCIONES_NORTE
    Author: mockUsers[1],
    Etiquetas: [mockEtiquetas[1]],
    Activo: true,
    CausaRaizPreliminar: null,
    ResponsableItem: [mockUsers[2]],
    tieneAccionDefinitiva: false,
    tieneGestionAnormalidad: true,
    Created: new Date('2025-12-20').toISOString(),
  },
  {
    Id: 3,
    Title: 'OBIRA-003',
    TituloDelProblema: 'Incidente ambiental menor',
    TipoDeProblema: 'Medio Ambiente',
    Etapa: 'Inicio Prod - E40',
    EstadoGeneral: '3. Contramedidas definidas',  // Cambiado de Cerrado para que aparezca
    Detalle: 'Derrame menor de fluido contenido exitosamente.',
    FechaDeOcurrenciaDelProblema: new Date('2025-11-10').toISOString(),
    PADLocacion: mockLocaciones[4],
    Equipo: mockEquipos[2],
    Bloque: { Id: 3, Title: 'Bloque Centro' },
    SubKPIAfectado: mockSubKPIs[3],
    QTY: 5,
    Unidad: 'Litros',
    AccionInmediata: 'Contención inmediata y limpieza del área',
    Proveedor: mockProveedores[0].Title,  // SERVICIOS_DELTA (cambiado de TRANSPORTES_SUR)
    Author: mockUsers[2],
    Etiquetas: [mockEtiquetas[2]],
    Activo: true,
    CausaRaizPreliminar: 'Error operativo',
    ResponsableItem: [mockUsers[0], mockUsers[3]],
    tieneAccionDefinitiva: true,
    tieneGestionAnormalidad: true,
    Created: new Date('2025-11-10').toISOString(),
  },
  {
    Id: 4,
    Title: 'OBIRA-004',
    TituloDelProblema: 'Falla en sistema eléctrico',
    TipoDeProblema: 'Operaciones',
    Etapa: 'Construcción de Locación - E10',
    EstadoGeneral: '2. Causa raíz definida',
    Detalle: 'Interrupción temporal del suministro eléctrico en zona de trabajo.',
    FechaDeOcurrenciaDelProblema: new Date('2025-12-28').toISOString(),
    PADLocacion: mockLocaciones[1],
    Equipo: mockEquipos[0],
    Bloque: { Id: 1, Title: 'Bloque Norte' },
    SubKPIAfectado: mockSubKPIs[0],
    QTY: 2,
    Unidad: 'Horas',
    AccionInmediata: 'Activación de generador de respaldo',
    Proveedor: mockProveedores[1].Title,  // CONSTRUCCIONES_NORTE
    Author: mockUsers[0],
    Etiquetas: [mockEtiquetas[3]],
    Activo: true,
    CausaRaizPreliminar: 'Falla en tablero principal',
    ResponsableItem: [mockUsers[1]],
    tieneAccionDefinitiva: true,
    tieneGestionAnormalidad: true,
    Created: new Date('2025-12-28').toISOString(),
  },
  {
    Id: 5,
    Title: 'OBIRA-005',
    TituloDelProblema: 'Equipo con mantenimiento pendiente',
    TipoDeProblema: 'Calidad',
    Etapa: 'Conexión de Pozos - E40',
    EstadoGeneral: '1. Nuevo',
    Detalle: 'El equipo Alpha requiere mantenimiento preventivo según cronograma.',
    FechaDeOcurrenciaDelProblema: new Date('2026-01-02').toISOString(),
    PADLocacion: mockLocaciones[0],
    Equipo: mockEquipos[0],
    Bloque: { Id: 1, Title: 'Bloque Norte' },
    SubKPIAfectado: mockSubKPIs[1],
    QTY: 1,
    Unidad: 'Unidad',
    AccionInmediata: 'Programar parada de equipo para mantenimiento',
    Proveedor: mockProveedores[1].Title,  // CONSTRUCCIONES_NORTE
    Author: mockUsers[2],
    Etiquetas: [mockEtiquetas[1], mockEtiquetas[4]],
    Activo: true,
    CausaRaizPreliminar: null,
    ResponsableItem: [mockUsers[1]],
    tieneAccionDefinitiva: false,
    tieneGestionAnormalidad: true,
    Created: new Date('2026-01-02').toISOString(),
  },
  {
    Id: 6,
    Title: 'OBIRA-006',
    TituloDelProblema: 'Desvío en procedimiento de seguridad',
    TipoDeProblema: 'Seguridad',
    Etapa: 'Inicio Prod - E40',
    EstadoGeneral: '3. Contramedidas definidas',
    Detalle: 'Personal observado sin uso completo de EPP en zona de riesgo.',
    FechaDeOcurrenciaDelProblema: new Date('2025-12-22').toISOString(),
    PADLocacion: mockLocaciones[2],
    Equipo: mockEquipos[1],
    Bloque: { Id: 2, Title: 'Bloque Sur' },
    SubKPIAfectado: mockSubKPIs[2],
    QTY: 3,
    Unidad: 'Unidad',
    AccionInmediata: 'Charla de seguridad inmediata con el equipo',
    Proveedor: mockProveedores[1].Title,  // CONSTRUCCIONES_NORTE
    Author: mockUsers[3],
    Etiquetas: [mockEtiquetas[0]],
    Activo: true,
    CausaRaizPreliminar: 'Falta de supervisión',
    ResponsableItem: [mockUsers[0], mockUsers[1]],
    tieneAccionDefinitiva: true,
    tieneGestionAnormalidad: true,
    Created: new Date('2025-12-22').toISOString(),
  },
  {
    Id: 7,
    Title: 'OBIRA-007',
    TituloDelProblema: 'Pérdida de herramienta menor',
    TipoDeProblema: 'Calidad',
    Etapa: 'Construcción de Locación - E10',
    EstadoGeneral: '4. Contramedidas implementadas',
    Detalle: 'Herramienta no localizada durante el cierre de turno.',
    FechaDeOcurrenciaDelProblema: new Date('2025-12-18').toISOString(),
    PADLocacion: mockLocaciones[1],
    Equipo: mockEquipos[0],
    Bloque: { Id: 1, Title: 'Bloque Norte' },
    SubKPIAfectado: mockSubKPIs[0],
    QTY: 1,
    Unidad: 'Unidad',
    AccionInmediata: 'Búsqueda exhaustiva en área de trabajo',
    Proveedor: mockProveedores[0].Title,  // SERVICIOS_DELTA
    Author: mockUsers[1],
    Etiquetas: [mockEtiquetas[1]],
    Activo: true,
    CausaRaizPreliminar: 'Control de inventario deficiente',
    ResponsableItem: [mockUsers[2]],
    tieneAccionDefinitiva: true,
    tieneGestionAnormalidad: true,
    Created: new Date('2025-12-18').toISOString(),
  },
];

// =====================
// GESTIÓN DE ANORMALIDADES
// =====================
export const mockGestionAnormalidades = [
  {
    Id: 1,
    Title: 'Revisión de válvula',
    IDObiraId: 1,
    Status: 'En Proceso',
    Comentarios: 'Se está coordinando con mantenimiento para la revisión completa',
    FechaDeFinalizacion: null,
    Responsable: mockUsers[1],
    ResponsableSeguimiento: mockUsers[0],
    AccionesATomar: 'Revisión completa del sistema de válvulas',
    Created: new Date('2025-12-16').toISOString(),
  },
  {
    Id: 2,
    Title: 'Seguimiento de entrega',
    IDObiraId: 2,
    Status: 'Pendiente',
    Comentarios: 'Esperando confirmación del proveedor',
    FechaDeFinalizacion: null,
    Responsable: mockUsers[2],
    ResponsableSeguimiento: mockUsers[1],
    AccionesATomar: 'Seguimiento diario con el proveedor',
    Created: new Date('2025-12-21').toISOString(),
  },
  {
    Id: 3,
    Title: 'Informe ambiental',
    IDObiraId: 3,
    Status: 'Completado',
    Comentarios: 'Informe entregado y aprobado por autoridades',
    FechaDeFinalizacion: new Date('2025-11-25').toISOString(),
    Responsable: mockUsers[0],
    ResponsableSeguimiento: mockUsers[2],
    AccionesATomar: 'Elaboración de informe ambiental',
    Created: new Date('2025-11-11').toISOString(),
  },
];

// =====================
// ACCIONES DEFINITIVAS
// =====================
export const mockAccionesDefinitivas = [
  {
    Id: 1,
    Title: 'Acción Correctiva 001',
    ObirasId: 1,
    CausaRaiz: 'Desgaste por uso prolongado sin mantenimiento preventivo',
    TipoCausaRaiz: 'Material',
    Contramedida: 'Implementar programa de mantenimiento preventivo mensual',
    FechaImplementacion: new Date('2025-12-20').toISOString(),
    FechaCierre: null,
    Responsable: mockUsers[1],
    ResponsableSeguimiento: mockUsers[0],
    StatusAccion: 'En Implementación',
    MetodoEstandarizacion: 'Procedimiento documentado',
    AplicaTransversalizacion: true,
    AQueEquipos: 'Todos los equipos del bloque norte',
    StatusTransversalizacion: 'Pendiente',
    Comentarios: 'Se está capacitando al personal',
    Created: new Date('2025-12-17').toISOString(),
  },
  {
    Id: 2,
    Title: 'Acción Correctiva 002',
    ObirasId: 3,
    CausaRaiz: 'Falta de capacitación en procedimientos de manejo',
    TipoCausaRaiz: 'Mano de Obra',
    Contramedida: 'Capacitación obligatoria para todo el personal operativo',
    FechaImplementacion: new Date('2025-11-20').toISOString(),
    FechaCierre: new Date('2025-11-30').toISOString(),
    Responsable: mockUsers[0],
    ResponsableSeguimiento: mockUsers[2],
    StatusAccion: 'Cerrada',
    MetodoEstandarizacion: 'Capacitación certificada',
    AplicaTransversalizacion: true,
    AQueEquipos: 'Todos los equipos',
    StatusTransversalizacion: 'Completado',
    Comentarios: 'Capacitación completada exitosamente',
    Created: new Date('2025-11-12').toISOString(),
  },
];

// =====================
// ACCIONES (Planes de acción)
// =====================
export const mockAcciones = [
  {
    Id: 1,
    Title: 'Plan de Acción 001',
    ObirasId: 1,
    Descripcion: 'Reemplazo de válvula defectuosa',
    FechaLimite: new Date('2026-01-15').toISOString(),
    Responsable: mockUsers[1],
    Status: 'En Proceso',
    Prioridad: 'Alta',
    Created: new Date('2025-12-16').toISOString(),
  },
  {
    Id: 2,
    Title: 'Plan de Acción 002',
    ObirasId: 2,
    Descripcion: 'Negociación con proveedor alternativo',
    FechaLimite: new Date('2026-01-10').toISOString(),
    Responsable: mockUsers[2],
    Status: 'Pendiente',
    Prioridad: 'Media',
    Created: new Date('2025-12-21').toISOString(),
  },
];

// =====================
// HELPER: Obtener datos con delay simulado
// =====================
export const getMockObiras = () => mockDelay([...mockObiras]);
export const getMockGestionAnormalidades = () => mockDelay([...mockGestionAnormalidades]);
export const getMockAccionesDefinitivas = () => mockDelay([...mockAccionesDefinitivas]);
export const getMockAcciones = () => mockDelay([...mockAcciones]);
export const getMockLocaciones = () => mockDelay([...mockLocaciones]);
export const getMockEquipos = () => mockDelay([...mockEquipos]);
export const getMockEtiquetas = () => mockDelay([...mockEtiquetas]);
export const getMockSubKPIs = () => mockDelay([...mockSubKPIs]);
export const getMockProveedores = () => mockDelay([...mockProveedores]);
export const getMockResponsablesEtapa = () => mockDelay([...mockResponsablesEtapa]);
export const getMockUsers = () => mockDelay([...mockUsers]);

// Helper para obtener por ID
export const getMockObiraById = (id: number) => mockDelay(mockObiras.find(o => o.Id === id));
export const getMockGestionAnormalidadById = (id: number) => mockDelay(mockGestionAnormalidades.find(g => g.Id === id));
export const getMockAccionDefinitivaById = (id: number) => mockDelay(mockAccionesDefinitivas.find(a => a.Id === id));

// Helper para filtrar por ObirasId
export const getMockGestionAnormalidadesByObiraId = (obiraId: number) => 
  mockDelay(mockGestionAnormalidades.filter(g => g.IDObiraId === obiraId));
export const getMockAccionesDefinitivasByObiraId = (obiraId: number) => 
  mockDelay(mockAccionesDefinitivas.filter(a => a.ObirasId === obiraId));
