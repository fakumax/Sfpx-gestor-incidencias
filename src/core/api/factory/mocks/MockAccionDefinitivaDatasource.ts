/**
 * Mock Datasource para AccionDefinitiva
 */
import { AccionDefinitiva } from '../../../entities';
import IAccionDefinitivaDataSource from '../../AccionDefinitiva/IAccionDefinitivaDataSource';
import { mockAccionesDefinitivas, mockDelay } from '../../../mock';

export default class MockAccionDefinitivaDatasource implements IAccionDefinitivaDataSource<AccionDefinitiva> {
  public listTitle: string = 'MockAccionesDefinitivas';
  private mockData: any[];
  private nextId: number;

  constructor() {
    this.mockData = JSON.parse(JSON.stringify(mockAccionesDefinitivas));
    this.nextId = Math.max(...this.mockData.map(o => o.Id)) + 1;
  }

  public async getCount(): Promise<number> {
    await mockDelay(null);
    return this.mockData.length;
  }

  public async getItems(): Promise<Array<AccionDefinitiva>> {
    await mockDelay(null);
    return this.mockData.map(item => new AccionDefinitiva(item));
  }

  public async add(item: Partial<AccionDefinitiva>): Promise<AccionDefinitiva> {
    await mockDelay(null);
    const newItem = { 
      ...item, 
      Id: this.nextId++,
      Created: new Date().toISOString(),
    };
    this.mockData.push(newItem);
    console.log('🔶 MOCK: AccionDefinitiva agregada', newItem);
    return new AccionDefinitiva(newItem);
  }

  public async edit(item: Partial<AccionDefinitiva>): Promise<AccionDefinitiva> {
    await mockDelay(null);
    const index = this.mockData.findIndex(o => o.Id === item.Id);
    if (index !== -1) {
      this.mockData[index] = { ...this.mockData[index], ...item };
    }
    return new AccionDefinitiva(this.mockData[index]);
  }

  public async delete(itemId: number): Promise<void> {
    await mockDelay(null);
    this.mockData = this.mockData.filter(o => o.Id !== itemId);
    console.log('🔶 MOCK: AccionDefinitiva eliminada', itemId);
  }

  public async getById(itemId: number): Promise<AccionDefinitiva> {
    await mockDelay(null);
    const item = this.mockData.find(o => o.Id === itemId);
    return item ? new AccionDefinitiva(item) : null;
  }

  public async getByObiraId(obiraId: number): Promise<Array<AccionDefinitiva>> {
    await mockDelay(null);
    return this.mockData
      .filter(item => item.ObirasId === obiraId)
      .map(item => new AccionDefinitiva(item));
  }
}
