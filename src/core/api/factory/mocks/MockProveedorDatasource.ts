/**
 * Mock Datasource para Proveedor
 */
import { Proveedor } from '../../../entities';
import IProveedorDatasource from '../../Proveedor/IProveedorDatasource';
import { mockProveedores, mockDelay } from '../../../mock';

export default class MockProveedorDatasource implements IProveedorDatasource<Proveedor> {
  public listTitle: string = 'MockProveedores';
  private mockData: any[];
  private nextId: number;

  constructor() {
    this.mockData = JSON.parse(JSON.stringify(mockProveedores));
    this.nextId = Math.max(...this.mockData.map(o => o.Id)) + 1;
  }

  public async getItems(): Promise<Array<Proveedor>> {
    await mockDelay(null);
    return this.mockData
      .filter(item => item.Activo !== false)
      .map(item => new Proveedor(item));
  }

  public async getItemsSimple(): Promise<Array<Proveedor>> {
    return this.getItems();
  }

  public async add(item: Partial<Proveedor>): Promise<Proveedor> {
    await mockDelay(null);
    const newItem = { ...item, Id: this.nextId++, Activo: true };
    this.mockData.push(newItem);
    console.log('🔶 MOCK: Proveedor agregado', newItem);
    return new Proveedor(newItem);
  }

  public async edit(item: Partial<Proveedor>): Promise<Proveedor> {
    await mockDelay(null);
    const index = this.mockData.findIndex(o => o.Id === item.Id);
    if (index !== -1) {
      this.mockData[index] = { ...this.mockData[index], ...item };
    }
    return new Proveedor(this.mockData[index]);
  }

  public async delete(itemId: number): Promise<void> {
    await mockDelay(null);
    const index = this.mockData.findIndex(o => o.Id === itemId);
    if (index !== -1) {
      this.mockData[index].Activo = false;
    }
    console.log('🔶 MOCK: Proveedor eliminado', itemId);
  }

  public async getById(itemId: number): Promise<Proveedor> {
    await mockDelay(null);
    const item = this.mockData.find(o => o.Id === itemId);
    return item ? new Proveedor(item) : null;
  }

  public async getFilteredItems(filter: string): Promise<Array<Proveedor>> {
    return this.getItems();
  }
}
