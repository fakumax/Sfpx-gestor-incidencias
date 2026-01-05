/**
 * Mock Datasource para GestionAnormalidad
 */
import { GestionAnormalidad } from '../entities';
import IGestionAnormalidadDataSource from '../api/GestionAnormalidad/IGestionAnormalidadDataSource';
import { mockGestionAnormalidades, mockDelay } from './';

let mockData = [...mockGestionAnormalidades];
let nextId = Math.max(...mockData.map(o => o.Id)) + 1;

export default class GestionAnormalidadMock implements IGestionAnormalidadDataSource<GestionAnormalidad> {
  public listTitle: string = "GestionAnormalidades (MOCK)";

  public async getItems(): Promise<Array<GestionAnormalidad>> {
    console.log("📋 [MOCK] Obteniendo gestiones de anormalidad...");
    const items = mockData.map(item => new GestionAnormalidad(item));
    return mockDelay(items);
  }

  public async add(item: Partial<GestionAnormalidad>): Promise<GestionAnormalidad> {
    console.log("➕ [MOCK] Agregando gestión de anormalidad...", item);
    const newItem = {
      ...item,
      Id: nextId++,
      Created: new Date().toISOString(),
    };
    mockData.push(newItem as any);
    return mockDelay(new GestionAnormalidad(newItem));
  }

  public async edit(item: Partial<GestionAnormalidad>): Promise<GestionAnormalidad> {
    console.log("✏️ [MOCK] Editando gestión de anormalidad...", item);
    const index = mockData.findIndex(o => o.Id === item.Id);
    if (index !== -1) {
      mockData[index] = { ...mockData[index], ...item } as any;
    }
    return mockDelay(new GestionAnormalidad(mockData[index]));
  }

  public async delete(itemId: number): Promise<void> {
    console.log("🗑️ [MOCK] Eliminando gestión de anormalidad...", itemId);
    mockData = mockData.filter(o => o.Id !== itemId);
    return mockDelay(undefined);
  }

  public async getById(itemId: number): Promise<GestionAnormalidad> {
    console.log("🔍 [MOCK] Obteniendo gestión de anormalidad por ID...", itemId);
    const item = mockData.find(o => o.Id === itemId);
    return mockDelay(item ? new GestionAnormalidad(item) : null);
  }

  public async getAnormalidadesByObira(obiraId: number): Promise<Array<GestionAnormalidad>> {
    console.log("🔍 [MOCK] Obteniendo anormalidades por Obira ID...", obiraId);
    const items = mockData
      .filter(item => item.IDObiraId === obiraId)
      .map(item => new GestionAnormalidad(item));
    return mockDelay(items);
  }

  public async getAbnormalitiesByObiraIds(obiraIds: number[]): Promise<Array<GestionAnormalidad>> {
    console.log("🔍 [MOCK] Obteniendo anormalidades por múltiples Obira IDs...", obiraIds);
    const items = mockData
      .filter(item => obiraIds.includes(item.IDObiraId))
      .map(item => new GestionAnormalidad(item));
    return mockDelay(items);
  }
}
