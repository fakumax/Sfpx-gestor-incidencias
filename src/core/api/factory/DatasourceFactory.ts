/**
 * Factory para crear datasources con soporte automático de mock
 * 
 * Este archivo centraliza la creación de todos los datasources
 * y automáticamente usa mock o real según USE_MOCK_DATA
 */

import { USE_MOCK_DATA } from '../../mock/mockConfig';

// Datasources reales
import ObiraDataSource from '../Obira/ObiraDataSource';
import LocacionDatasource from '../Locacion/LocacionDataSource';
import EquipoDatasource from '../Equipo/EquipoDataSource';
import EtiquetaDataSource from '../Etiqueta/EtiquetaDataSource';
import ProveedorDatasource from '../Proveedor/ProveedorDatasource';
import AccionDatasource from '../Accion/AccionDatasource';
import { AccionDefinitivaDataSource } from '../AccionDefinitiva/AccionDefinitivaDataSource';
import { GestionAnormalidadDataSource } from '../GestionAnormalidad/GestionAnormalidadDataSource';
import SubKPIDatasource from '../SubKPI/SubKPIDataSource';
import ResponsableEtapaDataSource from '../ResponsableEtapa/ResponsableEtapaDataSource';

// Mocks
import {
  ObiraMock,
  LocacionMock,
  EquipoMock,
  EtiquetaMock,
  ProveedorMock,
  AccionDefinitivaMock,
  GestionAnormalidadMock,
  SubKPIMock,
  ResponsableEtapaMock,
} from '../../mock';

/**
 * Crea un datasource de Obira (mock o real según configuración)
 */
export function createObiraDataSource(listTitle: string, proveedorNombre?: string): any {
  if (USE_MOCK_DATA) {
    console.log("🎮 [FACTORY] Creando ObiraMock para:", proveedorNombre || listTitle);
    return new ObiraMock(proveedorNombre);
  }
  return new ObiraDataSource(listTitle);
}

/**
 * Crea un datasource de Locacion (mock o real según configuración)
 */
export function createLocacionDataSource(listTitle: string, properties?: Array<string>, expand?: Array<string>): any {
  if (USE_MOCK_DATA) {
    console.log("🎮 [FACTORY] Creando LocacionMock");
    return new LocacionMock();
  }
  return new LocacionDatasource(listTitle, properties, expand);
}

/**
 * Crea un datasource de Equipo (mock o real según configuración)
 */
export function createEquipoDataSource(listTitle: string, properties?: Array<string>, expand?: Array<string>): any {
  if (USE_MOCK_DATA) {
    console.log("🎮 [FACTORY] Creando EquipoMock");
    return new EquipoMock();
  }
  return new EquipoDatasource(listTitle, properties, expand);
}

/**
 * Crea un datasource de Etiqueta (mock o real según configuración)
 */
export function createEtiquetaDataSource(listTitle: string, properties?: Array<string>): any {
  if (USE_MOCK_DATA) {
    console.log("🎮 [FACTORY] Creando EtiquetaMock");
    return new EtiquetaMock();
  }
  return new EtiquetaDataSource(listTitle, properties);
}

/**
 * Crea un datasource de Proveedor (mock o real según configuración)
 */
export function createProveedorDataSource(listTitle: string, properties?: Array<string>, expand?: Array<string>): any {
  if (USE_MOCK_DATA) {
    console.log("🎮 [FACTORY] Creando ProveedorMock");
    return new ProveedorMock();
  }
  return new ProveedorDatasource(listTitle, properties, expand);
}

/**
 * Crea un datasource de Accion (mock o real según configuración)
 */
export function createAccionDataSource(listTitle: string, properties?: Array<string>, expand?: Array<string>): any {
  if (USE_MOCK_DATA) {
    console.log("🎮 [FACTORY] Creando AccionDefinitivaMock");
    return new AccionDefinitivaMock();
  }
  return new AccionDatasource(listTitle, properties, expand);
}

/**
 * Crea un datasource de AccionDefinitiva (mock o real según configuración)
 */
export function createAccionDefinitivaDataSource(listTitle: string, properties?: Array<string>, expand?: Array<string>): any {
  if (USE_MOCK_DATA) {
    console.log("🎮 [FACTORY] Creando AccionDefinitivaMock");
    return new AccionDefinitivaMock();
  }
  return new AccionDefinitivaDataSource(listTitle, properties, expand);
}

/**
 * Crea un datasource de GestionAnormalidad (mock o real según configuración)
 */
export function createGestionAnormalidadDataSource(listTitle: string, properties?: Array<string>, expand?: Array<string>): any {
  if (USE_MOCK_DATA) {
    console.log("🎮 [FACTORY] Creando GestionAnormalidadMock");
    return new GestionAnormalidadMock();
  }
  return new GestionAnormalidadDataSource(listTitle, properties, expand);
}

/**
 * Crea un datasource de SubKPI (mock o real según configuración)
 */
export function createSubKPIDataSource(listTitle: string, properties?: Array<string>, expand?: Array<string>): any {
  if (USE_MOCK_DATA) {
    console.log("🎮 [FACTORY] Creando SubKPIMock");
    return new SubKPIMock();
  }
  return new SubKPIDatasource(listTitle, properties, expand);
}

/**
 * Crea un datasource de ResponsableEtapa (mock o real según configuración)
 */
export function createResponsableEtapaDataSource(listTitle: string, properties?: Array<string>, expand?: Array<string>): any {
  if (USE_MOCK_DATA) {
    console.log("🎮 [FACTORY] Creando ResponsableEtapaMock");
    return new ResponsableEtapaMock();
  }
  return new ResponsableEtapaDataSource(listTitle, properties, expand);
}
