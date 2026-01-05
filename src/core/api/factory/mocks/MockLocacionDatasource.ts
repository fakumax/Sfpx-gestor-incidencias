/**
 * Mock Datasource para Locacion
 */
import { Locacion } from '../../../entities';
import ILocacionDatasource from '../../Locacion/ILocacionDatasource';
import { mockLocaciones, mockDelay } from '../../../mock';

export default class MockLocacionDatasource implements ILocacionDatasource<Locacion> {
  public listTitle: string = 'MockLocaciones';
  private mockData: any[];
  private nextId: number;

  constructor() {
    this.mockData = JSON.parse(JSON.stringify(mockLocaciones));
    this.nextId = Math.max(...this.mockData.map(o => o.Id)) + 1;
  }

  public async getItems(): Promise<Array<Locacion>> {
    await mockDelay(null);
    return this.mockData.map(item => new Locacion(item));
  }

  public async add(item: Partial<Locacion>): Promise<Locacion> {
    await mockDelay(null);
    const newItem = { ...item, Id: this.nextId++ };
    this.mockData.push(newItem);
    console.log('🔶 MOCK: Locacion agregada', newItem);
    return new Locacion(newItem);
  }

  public async edit(item: Partial<Locacion>): Promise<Locacion> {
    await mockDelay(null);
    const index = this.mockData.findIndex(o => o.Id === item.Id);
    if (index !== -1) {
      this.mockData[index] = { ...this.mockData[index], ...item };
    }
    return new Locacion(this.mockData[index]);
  }

  public async delete(itemId: number): Promise<void> {
    await mockDelay(null);
    this.mockData = this.mockData.filter(o => o.Id !== itemId);
    console.log('🔶 MOCK: Locacion eliminada', itemId);
  }

  public async getById(itemId: number): Promise<Locacion> {
    await mockDelay(null);
    const item = this.mockData.find(o => o.Id === itemId);
    return item ? new Locacion(item) : null;
  }

  public async getFilteredItems(filter: string): Promise<Array<Locacion>> {
    return this.getItems();
  }
}
