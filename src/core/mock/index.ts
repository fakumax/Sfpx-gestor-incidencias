/**
 * Exportaciones del módulo mock
 * 
 * Usar estos mocks cuando USE_MOCK_DATA = true en mockConfig.ts
 */

// Configuración
export { 
  USE_MOCK_DATA, 
  MOCK_USER_ROLE, 
  MOCK_USER_GROUP,
  MOCK_USER_NAME,
  MOCK_USER_EMAIL,
  MOCK_DELAY_MS,
  MOCK_WARNING_MESSAGE, 
  mockDelay,
  getDatasource 
} from './mockConfig';

// Datos mock
export * from './mockData';

// Mocks de entidades
export { default as ObiraMock } from './ObiraMock';
export { default as GestionAnormalidadMock } from './GestionAnormalidadMock';
export { default as AccionDefinitivaMock } from './AccionDefinitivaMock';
export { default as LocacionMock } from './LocacionMock';
export { default as EquipoMock } from './EquipoMock';
export { default as ProveedorMock } from './ProveedorMock';
export { default as EtiquetaMock } from './EtiquetaMock';
export { default as SubKPIMock } from './SubKPIMock';
export { default as ResponsableEtapaMock } from './ResponsableEtapaMock';

