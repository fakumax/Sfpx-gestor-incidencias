/**
 * Mock Datasource para AccionDefinitiva
 */
import { AccionDefinitiva } from '../entities';
import IAccionDefinitivaDataSource from '../api/AccionDefinitiva/IAccionDefinitivaDataSource';
import { mockAccionesDefinitivas, mockDelay } from './';

let mockData = [...mockAccionesDefinitivas];
let nextId = Math.max(...mockData.map(o => o.Id)) + 1;

export default class AccionDefinitivaMock implements IAccionDefinitivaDataSource<AccionDefinitiva> {
  public listTitle: string = "AccionesDefinitivas (MOCK)";

  public async getCount(): Promise<number> {
    console.log("📊 [MOCK] Contando acciones definitivas...");
    return mockDelay(mockData.length);
  }

  public async getItems(): Promise<Array<AccionDefinitiva>> {
    console.log("📋 [MOCK] Obteniendo acciones definitivas...");
    const items = mockData.map(item => new AccionDefinitiva(item));
    return mockDelay(items);
  }

  public async add(item: Partial<AccionDefinitiva>): Promise<AccionDefinitiva> {
    console.log("➕ [MOCK] Agregando acción definitiva...", item);
    const newItem = {
      ...item,
      Id: nextId++,
      Created: new Date().toISOString(),
    };
    mockData.push(newItem as any);
    return mockDelay(new AccionDefinitiva(newItem));
  }

  public async edit(item: Partial<AccionDefinitiva>): Promise<AccionDefinitiva> {
    console.log("✏️ [MOCK] Editando acción definitiva...", item);
    const index = mockData.findIndex(o => o.Id === item.Id);
    if (index !== -1) {
      mockData[index] = { ...mockData[index], ...item } as any;
    }
    return mockDelay(new AccionDefinitiva(mockData[index]));
  }

  public async delete(itemId: number): Promise<void> {
    console.log("🗑️ [MOCK] Eliminando acción definitiva...", itemId);
    mockData = mockData.filter(o => o.Id !== itemId);
    return mockDelay(undefined);
  }

  public async getById(itemId: number): Promise<AccionDefinitiva> {
    console.log("🔍 [MOCK] Obteniendo acción definitiva por ID...", itemId);
    const item = mockData.find(o => o.Id === itemId);
    return mockDelay(item ? new AccionDefinitiva(item) : null);
  }
}
