/**
 * Mock Datasource para ResponsableEtapa
 */
import { ResponsableEtapa } from '../../../entities';
import IResponsableEtapaDatasource from '../../ResponsableEtapa/IResponsableEtapaDatasource';
import { mockResponsablesEtapa, mockDelay } from '../../../mock';

export default class MockResponsableEtapaDatasource implements IResponsableEtapaDatasource<ResponsableEtapa> {
  public listTitle: string = 'MockResponsablesEtapa';
  private mockData: any[];
  private nextId: number;

  constructor() {
    this.mockData = JSON.parse(JSON.stringify(mockResponsablesEtapa));
    this.nextId = Math.max(...this.mockData.map(o => o.Id)) + 1;
  }

  public async getItems(): Promise<Array<ResponsableEtapa>> {
    await mockDelay(null);
    return this.mockData.map(item => new ResponsableEtapa(item));
  }

  public async getItemsSimple(): Promise<Array<ResponsableEtapa>> {
    return this.getItems();
  }

  public async add(item: Partial<ResponsableEtapa>): Promise<ResponsableEtapa> {
    await mockDelay(null);
    const newItem = { ...item, Id: this.nextId++ };
    this.mockData.push(newItem);
    console.log('🔶 MOCK: ResponsableEtapa agregado', newItem);
    return new ResponsableEtapa(newItem);
  }

  public async edit(item: Partial<ResponsableEtapa>): Promise<ResponsableEtapa> {
    await mockDelay(null);
    const index = this.mockData.findIndex(o => o.Id === item.Id);
    if (index !== -1) {
      this.mockData[index] = { ...this.mockData[index], ...item };
    }
    return new ResponsableEtapa(this.mockData[index]);
  }

  public async delete(itemId: number): Promise<void> {
    await mockDelay(null);
    this.mockData = this.mockData.filter(o => o.Id !== itemId);
    console.log('🔶 MOCK: ResponsableEtapa eliminado', itemId);
  }

  public async getById(itemId: number): Promise<ResponsableEtapa> {
    await mockDelay(null);
    const item = this.mockData.find(o => o.Id === itemId);
    return item ? new ResponsableEtapa(item) : null;
  }

  public async getFilteredItems(filter: string): Promise<Array<ResponsableEtapa>> {
    return this.getItems();
  }
}
