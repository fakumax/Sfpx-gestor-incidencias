/**
 * Mock Datasource para GestionAnormalidad
 */
import { GestionAnormalidad } from '../../../entities';
import IGestionAnormalidadDataSource from '../../GestionAnormalidad/IGestionAnormalidadDataSource';
import { mockGestionAnormalidades, mockDelay } from '../../../mock';

export default class MockGestionAnormalidadDatasource implements IGestionAnormalidadDataSource<GestionAnormalidad> {
  public listTitle: string = 'MockGestionAnormalidades';
  private mockData: any[];
  private nextId: number;

  constructor() {
    this.mockData = JSON.parse(JSON.stringify(mockGestionAnormalidades));
    this.nextId = Math.max(...this.mockData.map(o => o.Id)) + 1;
  }

  public async getItems(): Promise<Array<GestionAnormalidad>> {
    await mockDelay(null);
    return this.mockData.map(item => new GestionAnormalidad(item));
  }

  public async add(item: Partial<GestionAnormalidad>): Promise<GestionAnormalidad> {
    await mockDelay(null);
    const newItem = { 
      ...item, 
      Id: this.nextId++,
      Created: new Date().toISOString(),
    };
    this.mockData.push(newItem);
    console.log('🔶 MOCK: GestionAnormalidad agregada', newItem);
    return new GestionAnormalidad(newItem);
  }

  public async edit(item: Partial<GestionAnormalidad>): Promise<GestionAnormalidad> {
    await mockDelay(null);
    const index = this.mockData.findIndex(o => o.Id === item.Id);
    if (index !== -1) {
      this.mockData[index] = { ...this.mockData[index], ...item };
    }
    return new GestionAnormalidad(this.mockData[index]);
  }

  public async delete(itemId: number): Promise<void> {
    await mockDelay(null);
    this.mockData = this.mockData.filter(o => o.Id !== itemId);
    console.log('🔶 MOCK: GestionAnormalidad eliminada', itemId);
  }

  public async getById(itemId: number): Promise<GestionAnormalidad> {
    await mockDelay(null);
    const item = this.mockData.find(o => o.Id === itemId);
    return item ? new GestionAnormalidad(item) : null;
  }

  public async getAnormalidadesByObira(obiraId: number): Promise<Array<GestionAnormalidad>> {
    await mockDelay(null);
    return this.mockData
      .filter(item => item.IDObiraId === obiraId)
      .map(item => new GestionAnormalidad(item));
  }

  public async getAbnormalitiesByObiraIds(obiraIds: number[]): Promise<Array<GestionAnormalidad>> {
    await mockDelay(null);
    return this.mockData
      .filter(item => obiraIds.includes(item.IDObiraId))
      .map(item => new GestionAnormalidad(item));
  }
}
