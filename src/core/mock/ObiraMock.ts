/**
 * Mock Datasource para Obira
 * Implementa la misma interfaz que ObiraDataSource
 */
import { Obira } from '../entities';
import IObiraDatasource from '../api/Obira/IObiraDatasource';
import { mockObiras, mockDelay } from './';

// Copia local de los datos para permitir modificaciones
let mockData = [...mockObiras];
let nextId = Math.max(...mockData.map(o => o.Id)) + 1;

export default class ObiraMock implements IObiraDatasource<Obira> {
  public listTitle: string;

  constructor(listTitle?: string) {
    this.listTitle = listTitle || "Obiras (MOCK)";
  }

  public async getCount(): Promise<number> {
    console.log("📊 [MOCK] Contando obiras...");
    return Promise.resolve(mockData.filter(o => o.Activo !== false).length);
  }

  public async getItems(): Promise<Array<Obira>> {
    console.log("📋 [MOCK] Obteniendo obiras...");
    const items = mockData
      .filter(item => item.Activo !== false)
      .map(item => new Obira(item));
    return mockDelay(items);
  }

  public async add(item: Partial<Obira>): Promise<Obira> {
    console.log("➕ [MOCK] Agregando obira...", item);
    const newItem = {
      ...item,
      Id: nextId++,
      Created: new Date().toISOString(),
      Modified: new Date().toISOString(),
      Activo: true,
    };
    mockData.push(newItem as any);
    return mockDelay(new Obira(newItem));
  }

  public async edit(item: Partial<Obira>): Promise<Obira> {
    console.log("✏️ [MOCK] Editando obira...", item);
    const index = mockData.findIndex(o => o.Id === item.Id);
    if (index !== -1) {
      mockData[index] = {
        ...mockData[index],
        ...item,
        Modified: new Date().toISOString(),
      } as any;
    }
    return mockDelay(new Obira(mockData[index]));
  }

  public async delete(itemId: number): Promise<void> {
    console.log("🗑️ [MOCK] Eliminando obira...", itemId);
    const index = mockData.findIndex(o => o.Id === itemId);
    if (index !== -1) {
      mockData[index].Activo = false;
    }
    return mockDelay(undefined);
  }

  public async getById(itemId: number): Promise<Obira> {
    console.log("🔍 [MOCK] Obteniendo obira por ID...", itemId);
    const item = mockData.find(o => o.Id === itemId);
    return mockDelay(item ? new Obira(item) : null);
  }

  public async getFilteredItems(filter: string): Promise<Array<Obira>> {
    console.log("🔎 [MOCK] ====== getFilteredItems ======");
    console.log("🔎 [MOCK] filter:", filter);
    console.log("🔎 [MOCK] listTitle:", this.listTitle);
    console.log("🔎 [MOCK] mockData total:", mockData.length);
    console.log("🔎 [MOCK] mockData proveedores:", mockData.map(o => o.Proveedor));
    
    // Filtrar primero por items activos
    let filtered = mockData.filter(item => item.Activo !== false);
    console.log("🔎 [MOCK] Después de filtrar activos:", filtered.length);
    
    // Si listTitle contiene el nombre de un proveedor específico, filtrar por ese proveedor
    // El listTitle puede venir como "construcciones_norte" o "CONSTRUCCIONES_NORTE"
    if (this.listTitle && this.listTitle !== "Obiras (MOCK)") {
      const normalizedListTitle = this.listTitle.toUpperCase().replace(/-/g, '_').replace(/\s+/g, '_');
      console.log("🔎 [MOCK] Buscando para proveedor normalizado:", normalizedListTitle);
      
      filtered = filtered.filter(item => {
        const normalizedProveedor = (item.Proveedor || '').toUpperCase().replace(/-/g, '_').replace(/\s+/g, '_');
        const matches = normalizedProveedor === normalizedListTitle;
        console.log(`🔎 [MOCK] Comparando: "${normalizedProveedor}" === "${normalizedListTitle}" => ${matches}`);
        return matches;
      });
    }
    
    console.log("🔎 [MOCK] Obiras encontradas FINAL:", filtered.length);
    console.log("🔎 [MOCK] IDs encontrados:", filtered.map(o => o.Id));
    const items = filtered.map(item => new Obira(item));
    return mockDelay(items);
  }

  public async getByProvider(providerId: number): Promise<Array<Obira>> {
    console.log("🏢 [MOCK] Obteniendo obiras por proveedor...", providerId);
    return this.getItems();
  }

  // Métodos adicionales
  public async getChoiceFields(): Promise<{ [key: string]: string[] }> {
    return mockDelay({
      Etapa: [
        'Construcción de Locación - E10',
        'Conexión de Pozos - E40',
        'Inicio Prod - E40',
      ],
      EstadoGeneral: [
        '1. Nuevo',
        '2. Causa raíz definida',
        '3. Contramedidas definidas',
        '4. Contramedidas implementadas',
        '5. Cerrado',
        '6. Reincidente',
      ],
      TipoDeProblema: ['Seguridad', 'Calidad', 'Medio Ambiente', 'Operaciones'],
      Unidad: ['Unidad', 'Litros', 'Toneladas', 'Metros', 'Horas'],
    });
  }

  public async addMultiple(files: File[], itemId: number): Promise<File[]> {
    console.log("📤 [MOCK] Simulando subida de archivos:", files.map(f => f.name));
    return mockDelay(files);
  }

  public async deleteMultipleFiles(fileNames: string[], itemId: number): Promise<void> {
    console.log("🗑️ [MOCK] Simulando eliminación de archivos:", fileNames);
    return mockDelay(undefined);
  }

  public async getAttachmentSizeByUrl(url: string): Promise<number> {
    return mockDelay(1024);
  }
}
