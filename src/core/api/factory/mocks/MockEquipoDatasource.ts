/**
 * Mock Datasource para Equipo
 */
import { Equipo } from '../../../entities';
import IEquipoDatasource from '../../Equipo/IEquipoDatasource';
import { mockEquipos, mockDelay } from '../../../mock';

export default class MockEquipoDatasource implements IEquipoDatasource<Equipo> {
  public listTitle: string = 'MockEquipos';
  private mockData: any[];
  private nextId: number;

  constructor() {
    this.mockData = JSON.parse(JSON.stringify(mockEquipos));
    this.nextId = Math.max(...this.mockData.map(o => o.Id)) + 1;
  }

  public async getItems(): Promise<Array<Equipo>> {
    await mockDelay(null);
    return this.mockData.map(item => new Equipo(item));
  }

  public async add(item: Partial<Equipo>): Promise<Equipo> {
    await mockDelay(null);
    const newItem = { ...item, Id: this.nextId++ };
    this.mockData.push(newItem);
    console.log('🔶 MOCK: Equipo agregado', newItem);
    return new Equipo(newItem);
  }

  public async edit(item: Partial<Equipo>): Promise<Equipo> {
    await mockDelay(null);
    const index = this.mockData.findIndex(o => o.Id === item.Id);
    if (index !== -1) {
      this.mockData[index] = { ...this.mockData[index], ...item };
    }
    return new Equipo(this.mockData[index]);
  }

  public async delete(itemId: number): Promise<void> {
    await mockDelay(null);
    this.mockData = this.mockData.filter(o => o.Id !== itemId);
    console.log('🔶 MOCK: Equipo eliminado', itemId);
  }

  public async getById(itemId: number): Promise<Equipo> {
    await mockDelay(null);
    const item = this.mockData.find(o => o.Id === itemId);
    return item ? new Equipo(item) : null;
  }

  public async getFilteredItems(filter: string): Promise<Array<Equipo>> {
    return this.getItems();
  }
}
