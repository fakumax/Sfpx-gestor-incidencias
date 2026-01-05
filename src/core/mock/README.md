# Modo Demo / Mock Data

Este proyecto incluye un sistema de datos falsos (mock) que permite ejecutar la aplicación sin necesidad de conectarse a SharePoint real.

## ¿Para qué sirve?

- **Desarrollo local**: Desarrollar sin depender de listas de SharePoint
- **Demos**: Mostrar la aplicación funcionando sin configurar el entorno
- **Testing**: Probar funcionalidades con datos controlados
- **Offline**: Trabajar sin conexión a internet

## Cómo activar/desactivar

Edita el archivo `src/core/mock/mockConfig.ts`:

```typescript
// Cambiar a true para usar datos mock (demo)
// Cambiar a false para conectarse a SharePoint real
export const USE_MOCK_DATA = true;
```

## Configurar rol del usuario

```typescript
// Opciones: "Administradores" | "Consultores" | "Proveedor" | "Ninguno"
export const MOCK_USER_ROLE = "Administradores";
```

## Mocks disponibles

| Mock | Descripción | Datos de ejemplo |
|------|-------------|------------------|
| `ObiraMock` | Incidencias principales (Obiras) | 3 obiras con diferentes estados |
| `GestionAnormalidadMock` | Gestión de anormalidades | 3 gestiones vinculadas a obiras |
| `AccionDefinitivaMock` | Acciones correctivas | 2 acciones definitivas |
| `LocacionMock` | Locaciones/PADs | 5 locaciones por bloque |
| `EquipoMock` | Equipos de trabajo | 4 equipos |
| `ProveedorMock` | Proveedores | 4 proveedores |
| `EtiquetaMock` | Etiquetas/Tags | 5 etiquetas |
| `SubKPIMock` | Sub KPIs afectados | 4 KPIs por etapa |
| `ResponsableEtapaMock` | Responsables de etapa | 3 responsables |

## Cómo usar los mocks en tu código

### Opción 1: Usar getDatasource helper

```typescript
import { 
  getDatasource,
  ObiraMock 
} from '../core/mock';
import ObiraDataSource from '../core/api/Obira/ObiraDataSource';

// Automáticamente elige mock o real según USE_MOCK_DATA
const datasource = getDatasource(
  new ObiraDataSource("Obiras"),
  new ObiraMock()
);
```

### Opción 2: Importar directamente

```typescript
import { USE_MOCK_DATA, ObiraMock } from '../core/mock';
import ObiraDataSource from '../core/api/Obira/ObiraDataSource';

const datasource = USE_MOCK_DATA 
  ? new ObiraMock() 
  : new ObiraDataSource("Obiras");
```

## Configuración del delay

```typescript
// En mockConfig.ts
export const MOCK_DELAY_MS = 300; // milisegundos (0 = instantáneo)
```

## Logs en consola

Cuando el modo mock está activo, verás logs con emojis:

```
🎮 [MODO DEMO] Usando datos mock - no se conecta a SharePoint
📋 [MOCK] Obteniendo obiras...
➕ [MOCK] Agregando obira...
✏️ [MOCK] Editando obira...
🗑️ [MOCK] Eliminando obira...
🔍 [MOCK] Obteniendo obira por ID...
```

## Notas importantes

1. **Los cambios no persisten**: En modo mock, los datos vuelven a su estado inicial al recargar la página
2. **Usuarios simulados**: El usuario actual es configurable en `MOCK_USER_NAME`
3. **Archivos**: Los uploads de archivos no se guardan en modo mock
4. **Emails**: Los correos no se envían en modo mock

## Agregar más datos mock

Edita `src/core/mock/mockData.ts` para agregar o modificar los datos de prueba.
