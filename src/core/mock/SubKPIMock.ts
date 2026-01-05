/**
 * Mock Datasource para SubKPI
 */
import { SubKPI } from '../entities';
import ISubKPIDataSource from '../api/SubKPI/ISubKPIDataSource';
import { mockSubKPIs, mockDelay } from './';

let mockData = [...mockSubKPIs];
let nextId = Math.max(...mockData.map(o => o.Id)) + 1;

export default class SubKPIMock implements ISubKPIDataSource<SubKPI> {
  public listTitle: string = "SubKPIs (MOCK)";

  public async getItems(): Promise<Array<SubKPI>> {
    console.log("📋 [MOCK] Obteniendo SubKPIs...");
    const items = mockData.map(item => new SubKPI(item));
    return mockDelay(items);
  }

  public async add(item: Partial<SubKPI>): Promise<SubKPI> {
    console.log("➕ [MOCK] Agregando SubKPI...", item);
    const newItem = { ...item, Id: nextId++ };
    mockData.push(newItem as any);
    return mockDelay(new SubKPI(newItem));
  }

  public async edit(item: Partial<SubKPI>): Promise<SubKPI> {
    console.log("✏️ [MOCK] Editando SubKPI...", item);
    const index = mockData.findIndex(o => o.Id === item.Id);
    if (index !== -1) {
      mockData[index] = { ...mockData[index], ...item } as any;
    }
    return mockDelay(new SubKPI(mockData[index]));
  }

  public async delete(itemId: number): Promise<void> {
    console.log("🗑️ [MOCK] Eliminando SubKPI...", itemId);
    mockData = mockData.filter(o => o.Id !== itemId);
    return mockDelay(undefined);
  }

  public async getById(itemId: number): Promise<SubKPI> {
    console.log("🔍 [MOCK] Obteniendo SubKPI por ID...", itemId);
    const item = mockData.find(o => o.Id === itemId);
    return mockDelay(item ? new SubKPI(item) : null);
  }

  public async getFilteredItems(filter: string): Promise<Array<SubKPI>> {
    console.log("🔎 [MOCK] Filtrando SubKPIs...", filter);
    return this.getItems();
  }
}
