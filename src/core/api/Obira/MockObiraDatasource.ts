/**
 * Mock Datasource para Obira
 * Implementa IObiraDatasource usando datos mock en lugar de SharePoint
 */
import { Obira } from '../../entities';
import IObiraDatasource from './IObiraDatasource';
import { mockObiras, mockDelay } from '../../mock';

export default class MockObiraDatasource implements IObiraDatasource<Obira> {
  public listTitle: string = 'MockObiras';
  private mockData: any[];
  private nextId: number;

  constructor() {
    // Clonar los datos mock para poder modificarlos
    this.mockData = JSON.parse(JSON.stringify(mockObiras));
    this.nextId = Math.max(...this.mockData.map(o => o.Id)) + 1;
  }

  public async getCount(): Promise<number> {
    await mockDelay(null);
    return this.mockData.filter(o => o.Activo !== false).length;
  }

  public async getItems(): Promise<Array<Obira>> {
    await mockDelay(null);
    return this.mockData
      .filter(item => item.Activo !== false)
      .map(item => new Obira(item));
  }

  public async add(item: Partial<Obira>): Promise<Obira> {
    await mockDelay(null);
    const newItem = {
      ...item,
      Id: this.nextId++,
      Created: new Date().toISOString(),
      Modified: new Date().toISOString(),
      Activo: true,
    };
    this.mockData.push(newItem);
    console.log('🔶 MOCK: Obira agregada', newItem);
    return new Obira(newItem);
  }

  public async edit(item: Partial<Obira>): Promise<Obira> {
    await mockDelay(null);
    const index = this.mockData.findIndex(o => o.Id === item.Id);
    if (index === -1) {
      throw new Error(`Obira con Id ${item.Id} no encontrada`);
    }
    this.mockData[index] = {
      ...this.mockData[index],
      ...item,
      Modified: new Date().toISOString(),
    };
    console.log('🔶 MOCK: Obira editada', this.mockData[index]);
    return new Obira(this.mockData[index]);
  }

  public async delete(itemId: number): Promise<void> {
    await mockDelay(null);
    const index = this.mockData.findIndex(o => o.Id === itemId);
    if (index !== -1) {
      // Soft delete - marcar como inactivo
      this.mockData[index].Activo = false;
      console.log('🔶 MOCK: Obira eliminada (soft delete)', itemId);
    }
  }

  public async getById(itemId: number): Promise<Obira> {
    await mockDelay(null);
    const item = this.mockData.find(o => o.Id === itemId);
    if (!item) {
      throw new Error(`Obira con Id ${itemId} no encontrada`);
    }
    return new Obira(item);
  }

  public async getFilteredItems(filter: string): Promise<Array<Obira>> {
    await mockDelay(null);
    // Simulación básica de filtros - para mock simplemente devolvemos todos los activos
    console.log('🔶 MOCK: Filtro aplicado (ignorado en mock):', filter);
    return this.mockData
      .filter(item => item.Activo !== false)
      .map(item => new Obira(item));
  }

  public async getByProvider(providerId: number): Promise<Array<Obira>> {
    await mockDelay(null);
    // Filtrar por proveedor si es necesario
    return this.mockData
      .filter(item => item.Activo !== false)
      .map(item => new Obira(item));
  }

  // Métodos adicionales para compatibilidad
  public async getChoiceFields(): Promise<{ [key: string]: string[] }> {
    await mockDelay(null);
    return {
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
    };
  }

  public async addMultiple(files: File[], itemId: number): Promise<File[]> {
    await mockDelay(null);
    console.log('🔶 MOCK: Archivos agregados a item', itemId, files.map(f => f.name));
    return files;
  }

  public async deleteMultipleFiles(fileNames: string[], itemId: number): Promise<void> {
    await mockDelay(null);
    console.log('🔶 MOCK: Archivos eliminados de item', itemId, fileNames);
  }

  public async getAttachmentSizeByUrl(url: string): Promise<number> {
    await mockDelay(null);
    return 1024; // Tamaño ficticio
  }
}
