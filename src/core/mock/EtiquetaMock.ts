/**
 * Mock Datasource para Etiqueta
 */
import { Etiqueta } from '../entities';
import IEtiquetaDatasource from '../api/Etiqueta/IEtiquetaDatasource';
import { mockEtiquetas, mockDelay } from './';

let mockData = [...mockEtiquetas];
let nextId = Math.max(...mockData.map(o => o.Id)) + 1;

export default class EtiquetaMock implements IEtiquetaDatasource {
  public listTitle: string = "Etiquetas (MOCK)";

  public async getAll(): Promise<Array<Etiqueta>> {
    console.log("📋 [MOCK] Obteniendo etiquetas...");
    const items = mockData.map(item => new Etiqueta(item));
    return mockDelay(items);
  }

  public async add(item: Partial<Etiqueta>): Promise<Etiqueta> {
    console.log("➕ [MOCK] Agregando etiqueta...", item);
    const newItem = { ...item, Id: nextId++ };
    mockData.push(newItem as any);
    return mockDelay(new Etiqueta(newItem));
  }

  public async edit(item: Partial<Etiqueta>): Promise<Etiqueta> {
    console.log("✏️ [MOCK] Editando etiqueta...", item);
    const index = mockData.findIndex(o => o.Id === item.Id);
    if (index !== -1) {
      mockData[index] = { ...mockData[index], ...item } as any;
    }
    return mockDelay(new Etiqueta(mockData[index]));
  }

  public async delete(itemId: number): Promise<void> {
    console.log("🗑️ [MOCK] Eliminando etiqueta...", itemId);
    mockData = mockData.filter(o => o.Id !== itemId);
    return mockDelay(undefined);
  }

  public async getById(itemId: number): Promise<Etiqueta> {
    console.log("🔍 [MOCK] Obteniendo etiqueta por ID...", itemId);
    const item = mockData.find(o => o.Id === itemId);
    return mockDelay(item ? new Etiqueta(item) : null);
  }

  public async getFilteredItems(filter: string): Promise<Array<Etiqueta>> {
    console.log("🔎 [MOCK] Filtrando etiquetas...", filter);
    return this.getAll();
  }
}
