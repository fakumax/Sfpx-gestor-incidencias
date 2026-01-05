/**
 * Mock Datasource para SubKPI
 */
import { SubKPI } from '../../../entities';
import ISubKPIDataSource from '../../SubKPI/ISubKPIDataSource';
import { mockSubKPIs, mockDelay } from '../../../mock';

export default class MockSubKPIDatasource implements ISubKPIDataSource<SubKPI> {
  public listTitle: string = 'MockSubKPIs';
  private mockData: any[];
  private nextId: number;

  constructor() {
    this.mockData = JSON.parse(JSON.stringify(mockSubKPIs));
    this.nextId = Math.max(...this.mockData.map(o => o.Id)) + 1;
  }

  public async getItems(): Promise<Array<SubKPI>> {
    await mockDelay(null);
    return this.mockData.map(item => new SubKPI(item));
  }

  public async add(item: Partial<SubKPI>): Promise<SubKPI> {
    await mockDelay(null);
    const newItem = { ...item, Id: this.nextId++ };
    this.mockData.push(newItem);
    console.log('🔶 MOCK: SubKPI agregado', newItem);
    return new SubKPI(newItem);
  }

  public async edit(item: Partial<SubKPI>): Promise<SubKPI> {
    await mockDelay(null);
    const index = this.mockData.findIndex(o => o.Id === item.Id);
    if (index !== -1) {
      this.mockData[index] = { ...this.mockData[index], ...item };
    }
    return new SubKPI(this.mockData[index]);
  }

  public async delete(itemId: number): Promise<void> {
    await mockDelay(null);
    this.mockData = this.mockData.filter(o => o.Id !== itemId);
    console.log('🔶 MOCK: SubKPI eliminado', itemId);
  }

  public async getById(itemId: number): Promise<SubKPI> {
    await mockDelay(null);
    const item = this.mockData.find(o => o.Id === itemId);
    return item ? new SubKPI(item) : null;
  }

  public async getFilteredItems(filter: string): Promise<Array<SubKPI>> {
    return this.getItems();
  }
}
