/**
 * Mock Datasource para Proveedor
 */
import { Proveedor } from '../entities';
import IProveedorDatasource from '../api/Proveedor/IProveedorDatasource';
import { mockProveedores, mockDelay } from './';

let mockData = [...mockProveedores];
let nextId = Math.max(...mockData.map(o => o.Id)) + 1;

export default class ProveedorMock implements IProveedorDatasource<Proveedor> {
  public listTitle: string = "Proveedores (MOCK)";

  public async getItems(): Promise<Array<Proveedor>> {
    console.log("📋 [MOCK] Obteniendo proveedores...");
    const items = mockData
      .filter(item => item.Activo !== false)
      .map(item => new Proveedor(item));
    return mockDelay(items);
  }

  public async getItemsSimple(): Promise<Array<Proveedor>> {
    return this.getItems();
  }

  public async add(item: Partial<Proveedor>): Promise<Proveedor> {
    console.log("➕ [MOCK] Agregando proveedor...", item);
    const newItem = { ...item, Id: nextId++, Activo: true };
    mockData.push(newItem as any);
    return mockDelay(new Proveedor(newItem));
  }

  public async edit(item: Partial<Proveedor>): Promise<Proveedor> {
    console.log("✏️ [MOCK] Editando proveedor...", item);
    const index = mockData.findIndex(o => o.Id === item.Id);
    if (index !== -1) {
      mockData[index] = { ...mockData[index], ...item } as any;
    }
    return mockDelay(new Proveedor(mockData[index]));
  }

  public async delete(itemId: number): Promise<void> {
    console.log("🗑️ [MOCK] Eliminando proveedor...", itemId);
    const index = mockData.findIndex(o => o.Id === itemId);
    if (index !== -1) {
      mockData[index].Activo = false;
    }
    return mockDelay(undefined);
  }

  public async getById(itemId: number): Promise<Proveedor> {
    console.log("🔍 [MOCK] Obteniendo proveedor por ID...", itemId);
    const item = mockData.find(o => o.Id === itemId);
    return mockDelay(item ? new Proveedor(item) : null);
  }

  public async getFilteredItems(filter: string, orderBy?: string, ascending: boolean = true): Promise<Array<Proveedor>> {
    console.log("🔎 [MOCK] Filtrando proveedores...", filter, "orderBy:", orderBy);
    let items = [...mockData].filter(item => item.Activo !== false);
    
    // Parsear filtro simple para Title
    // Ejemplos: "Activo eq 1 and Title eq 'CONSTRUCCIONES_NORTE'"
    if (filter) {
      const titleMatch = filter.match(/Title\s+eq\s+'([^']+)'/i);
      if (titleMatch) {
        const titleFilter = titleMatch[1].toUpperCase();
        items = items.filter(item => 
          item.Title?.toUpperCase() === titleFilter ||
          item.Title?.toUpperCase().replace(/_/g, ' ') === titleFilter.replace(/_/g, ' ')
        );
      }
    }
    
    // Aplicar ordenamiento si se especifica
    if (orderBy) {
      items = items.sort((a: any, b: any) => {
        const aVal = a[orderBy];
        const bVal = b[orderBy];
        if (aVal < bVal) return ascending ? -1 : 1;
        if (aVal > bVal) return ascending ? 1 : -1;
        return 0;
      });
    }
    
    return mockDelay(items.map(item => new Proveedor(item)));
  }
}
