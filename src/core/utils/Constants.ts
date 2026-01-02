export const ESTADO_GENERAL_CERRADO = "5. Cerrado";
export const ETAPAS_CON_EQUIPO = [
  "Conexión de Pozos - E40",
  "Construcción de Locación - E10",
  "Inicio Prod - E40",
];

// Cambiar AZURE_URL en base a donde se coloque la url de la azure function publicada, lista de configuración, archivo de configuración, variable de entorno etc...
export const AZURE_URL: string = "http://localhost:7071";
export const AZURE_ERROR: string = "AzureError";
export const AZURE_API: string = "api";

export const DOCUMENTOS_BIBLIOTECA: string = "Documentos compartidos";

export enum Instructivo {
  Admin = "Instructivo para administradores.pptx",
  Proveedor = "Instructivo para proveedores.pptx",
}

export enum Lista {
  Acciones = "Acciones Definitivas Superior",
  Proveedores = "Proveedores",
  Locaciones = "Locaciones",
  Equipos = "Equipos",
  SubKPIAfectado = "Etapas y SUB KPIs",
  Correos = "Correos",
  PlanesDeAccion = "Planes de acción",
  Etiquetas = "Etiquetas",
  ResponsableEtapa = "Responsables Etapas"
}


export const ADMIN_GROUP_NAME = "Administradores";
export const CONSULTOR_GROUP_NAME = "Consultores";

export enum Roles {
  Propietario = "owner",
  Proveedor = "provider",
  Ninguno = "none",
  Administradores = "Administradores",
  Consultores = "Consultores",
}


export enum PermissionLevels {
  Leer = "Leer",
  Editar = "Editar",
  ControlTotal = "Control total",
  Admin_sin_estructura = "Admin sin estructura",
}

export enum CodigoEmail {
  CO001 = "CO001",
  CO002 = "CO002",
  CO003 = "CO003",
  CO004 = "CO004",
  CO005 = "CO005",
  CO006 = "CO006",
}

export enum EmailTokens {
  ResponsableDinamico = "Responsable dinamico",
  ResponsableAnormalidad = "Responsable Anormalidad",
  ResponsableSeguimientoAnormalidad = "Responsable Seguimiento Anormalidad",
  ResponsableAccion = "Responsable Accion",
  ResponsableSeguimientoAccion = "Responsable Seguimiento Accion",

}

export const ESTADOS_GENERALES_DEFAULT = [
  "1. Nuevo",
  "2. Causa raíz definida",
  "3. Contramedidas definidas",
  "4. Contramedidas implementadas",
  "6. Reincidente",
];
 

export enum Accion {
  GUARDAR = "Guardar",
  CANCELAR = "Cancelar",
  VOLVER = "Volver",
  ELIMINAR = "Eliminar",
  RESTAURAR = "Restaurar ítems",
  RESTAURAR_INCOMPLETO = "Debe seleccionar ítems para poder restaurarlos",
}

export const AccionProgresiva: Record<Accion, string> = {
  [Accion.GUARDAR]: "Guardando...",
  [Accion.CANCELAR]: "Cancelando...",
  [Accion.VOLVER]: "Volviendo...",
  [Accion.ELIMINAR]: "Eliminando...",
  [Accion.RESTAURAR]: "Restaurando...",
  [Accion.RESTAURAR_INCOMPLETO]: "Volviendo...",
}

export const TituloDeAccion: Record<Accion, string> = {
  [Accion.GUARDAR]: "¿Está seguro de que desea guardar los cambios?",
  [Accion.CANCELAR]: "¿Está seguro de que desea cancelar la operación?",
  [Accion.VOLVER]: "¿Está seguro de que desea salir?",
  [Accion.ELIMINAR]: "¿Está seguro de que desea eliminar el ítem y todos sus datos asociados?",
  [Accion.RESTAURAR]: "¿Está seguro de que desea restaurar el/los ítems seleccionados?",
  [Accion.RESTAURAR_INCOMPLETO]: "Seleccione uno o más ítems."
}

export const TextoDeAccion: Record<Accion, string> = {
  [Accion.GUARDAR]: "Se registrará la información ingresada en el sistema.",
  [Accion.CANCELAR]: "Se perderán todos los cambios que no haya guardado.",
  [Accion.VOLVER]: "Se perderán todos los cambios que no haya guardado.",
  [Accion.ELIMINAR]: `Esta acción dará de baja el ítem, junto con sus anormalidades y acciones definitivas vinculadas. Podrá restaurarlo posteriormente desde la bandeja: "Ítems eliminados".`,
  [Accion.RESTAURAR]: "Esta acción pondrá disponibles nuevamente los ítems seleccionados en la lista de ítems.",
  [Accion.RESTAURAR_INCOMPLETO]: "Para poder restaurar ítems primero debe seleccionarlos."
}

export enum FORMATOS_DE_IMAGEN_VALIDOS {
  JPEG = "jpeg",
  JPG = "jpg",
  PNG = "png",
}

function getFileExtension(nombre: string): string {
  return (nombre.split(".").pop() || "").toLowerCase();
}

export function isSupportedImage(fileName: string): boolean {
  const ext = getFileExtension(fileName);
  return Object.values(FORMATOS_DE_IMAGEN_VALIDOS).includes(ext as FORMATOS_DE_IMAGEN_VALIDOS);
}

export const encodeFileNameInUrl = (url: string): string => {
  const lastSlashIndex = url.lastIndexOf('/');
  if (lastSlashIndex === -1) return url;

  const path = url.substring(0, lastSlashIndex + 1);
  const fileName = url.substring(lastSlashIndex + 1);

  return path + encodeURIComponent(fileName);
};

export enum ESTADO_ITEM {
  ACTIVO = "1",
  ELIMINADO = "0",
}
