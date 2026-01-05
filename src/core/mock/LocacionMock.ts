/**
 * Mock Datasource para Locacion
 */
import { Locacion } from '../entities';
import ILocacionDatasource from '../api/Locacion/ILocacionDatasource';
import { mockLocaciones, mockDelay } from './';

let mockData = [...mockLocaciones];
let nextId = Math.max(...mockData.map(o => o.Id)) + 1;

export default class LocacionMock implements ILocacionDatasource<Locacion> {
  public listTitle: string = "Locaciones (MOCK)";

  public async getItems(): Promise<Array<Locacion>> {
    console.log("📋 [MOCK] Obteniendo locaciones...");
    const items = mockData.map(item => new Locacion(item));
    return mockDelay(items);
  }

  public async add(item: Partial<Locacion>): Promise<Locacion> {
    console.log("➕ [MOCK] Agregando locación...", item);
    const newItem = { ...item, Id: nextId++ };
    mockData.push(newItem as any);
    return mockDelay(new Locacion(newItem));
  }

  public async edit(item: Partial<Locacion>): Promise<Locacion> {
    console.log("✏️ [MOCK] Editando locación...", item);
    const index = mockData.findIndex(o => o.Id === item.Id);
    if (index !== -1) {
      mockData[index] = { ...mockData[index], ...item } as any;
    }
    return mockDelay(new Locacion(mockData[index]));
  }

  public async delete(itemId: number): Promise<void> {
    console.log("🗑️ [MOCK] Eliminando locación...", itemId);
    mockData = mockData.filter(o => o.Id !== itemId);
    return mockDelay(undefined);
  }

  public async getById(itemId: number): Promise<Locacion> {
    console.log("🔍 [MOCK] Obteniendo locación por ID...", itemId);
    const item = mockData.find(o => o.Id === itemId);
    return mockDelay(item ? new Locacion(item) : null);
  }

  public async getFilteredItems(filter: string): Promise<Array<Locacion>> {
    console.log("🔎 [MOCK] Filtrando locaciones...", filter);
    return this.getItems();
  }
}
