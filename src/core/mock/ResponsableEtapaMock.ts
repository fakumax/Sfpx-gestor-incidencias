/**
 * Mock Datasource para ResponsableEtapa
 */
import { ResponsableEtapa } from '../entities';
import IResponsableEtapaDatasource from '../api/ResponsableEtapa/IResponsableEtapaDatasource';
import { mockResponsablesEtapa, mockDelay } from './';

let mockData = [...mockResponsablesEtapa];
let nextId = Math.max(...mockData.map(o => o.Id)) + 1;

export default class ResponsableEtapaMock implements IResponsableEtapaDatasource<ResponsableEtapa> {
  public listTitle: string = "ResponsablesEtapa (MOCK)";

  public async getItems(): Promise<Array<ResponsableEtapa>> {
    console.log("📋 [MOCK] Obteniendo responsables de etapa...");
    const items = mockData.map(item => new ResponsableEtapa(item));
    return mockDelay(items);
  }

  public async getItemsSimple(): Promise<Array<ResponsableEtapa>> {
    return this.getItems();
  }

  public async add(item: Partial<ResponsableEtapa>): Promise<ResponsableEtapa> {
    console.log("➕ [MOCK] Agregando responsable de etapa...", item);
    const newItem = { ...item, Id: nextId++ };
    mockData.push(newItem as any);
    return mockDelay(new ResponsableEtapa(newItem));
  }

  public async edit(item: Partial<ResponsableEtapa>): Promise<ResponsableEtapa> {
    console.log("✏️ [MOCK] Editando responsable de etapa...", item);
    const index = mockData.findIndex(o => o.Id === item.Id);
    if (index !== -1) {
      mockData[index] = { ...mockData[index], ...item } as any;
    }
    return mockDelay(new ResponsableEtapa(mockData[index]));
  }

  public async delete(itemId: number): Promise<void> {
    console.log("🗑️ [MOCK] Eliminando responsable de etapa...", itemId);
    mockData = mockData.filter(o => o.Id !== itemId);
    return mockDelay(undefined);
  }

  public async getById(itemId: number): Promise<ResponsableEtapa> {
    console.log("🔍 [MOCK] Obteniendo responsable de etapa por ID...", itemId);
    const item = mockData.find(o => o.Id === itemId);
    return mockDelay(item ? new ResponsableEtapa(item) : null);
  }

  public async getFilteredItems(filter: string): Promise<Array<ResponsableEtapa>> {
    console.log("🔎 [MOCK] Filtrando responsables de etapa...", filter);
    return this.getItems();
  }
}
