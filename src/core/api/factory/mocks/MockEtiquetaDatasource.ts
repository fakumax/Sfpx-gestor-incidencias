/**
 * Mock Datasource para Etiqueta
 */
import { Etiqueta } from '../../../entities';
import IEtiquetaDatasource from '../../Etiqueta/IEtiquetaDatasource';
import { mockEtiquetas, mockDelay } from '../../../mock';

export default class MockEtiquetaDatasource implements IEtiquetaDatasource {
  public listTitle: string = 'MockEtiquetas';
  private mockData: any[];
  private nextId: number;

  constructor() {
    this.mockData = JSON.parse(JSON.stringify(mockEtiquetas));
    this.nextId = Math.max(...this.mockData.map(o => o.Id)) + 1;
  }

  public async getAll(): Promise<Array<Etiqueta>> {
    await mockDelay(null);
    return this.mockData.map(item => new Etiqueta(item));
  }

  public async add(item: Partial<Etiqueta>): Promise<Etiqueta> {
    await mockDelay(null);
    const newItem = { ...item, Id: this.nextId++ };
    this.mockData.push(newItem);
    console.log('🔶 MOCK: Etiqueta agregada', newItem);
    return new Etiqueta(newItem);
  }

  public async edit(item: Partial<Etiqueta>): Promise<Etiqueta> {
    await mockDelay(null);
    const index = this.mockData.findIndex(o => o.Id === item.Id);
    if (index !== -1) {
      this.mockData[index] = { ...this.mockData[index], ...item };
    }
    return new Etiqueta(this.mockData[index]);
  }

  public async delete(itemId: number): Promise<void> {
    await mockDelay(null);
    this.mockData = this.mockData.filter(o => o.Id !== itemId);
    console.log('🔶 MOCK: Etiqueta eliminada', itemId);
  }

  public async getById(itemId: number): Promise<Etiqueta> {
    await mockDelay(null);
    const item = this.mockData.find(o => o.Id === itemId);
    return item ? new Etiqueta(item) : null;
  }

  public async getFilteredItems(filter: string): Promise<Array<Etiqueta>> {
    return this.getAll();
  }
}
