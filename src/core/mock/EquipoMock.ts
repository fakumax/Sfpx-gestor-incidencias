/**
 * Mock Datasource para Equipo
 */
import { Equipo } from '../entities';
import IEquipoDatasource from '../api/Equipo/IEquipoDatasource';
import { mockEquipos, mockDelay } from './';

let mockData = [...mockEquipos];
let nextId = Math.max(...mockData.map(o => o.Id)) + 1;

export default class EquipoMock implements IEquipoDatasource<Equipo> {
  public listTitle: string = "Equipos (MOCK)";

  public async getItems(): Promise<Array<Equipo>> {
    console.log("📋 [MOCK] Obteniendo equipos...");
    const items = mockData.map(item => new Equipo(item));
    return mockDelay(items);
  }

  public async add(item: Partial<Equipo>): Promise<Equipo> {
    console.log("➕ [MOCK] Agregando equipo...", item);
    const newItem = { ...item, Id: nextId++ };
    mockData.push(newItem as any);
    return mockDelay(new Equipo(newItem));
  }

  public async edit(item: Partial<Equipo>): Promise<Equipo> {
    console.log("✏️ [MOCK] Editando equipo...", item);
    const index = mockData.findIndex(o => o.Id === item.Id);
    if (index !== -1) {
      mockData[index] = { ...mockData[index], ...item } as any;
    }
    return mockDelay(new Equipo(mockData[index]));
  }

  public async delete(itemId: number): Promise<void> {
    console.log("🗑️ [MOCK] Eliminando equipo...", itemId);
    mockData = mockData.filter(o => o.Id !== itemId);
    return mockDelay(undefined);
  }

  public async getById(itemId: number): Promise<Equipo> {
    console.log("🔍 [MOCK] Obteniendo equipo por ID...", itemId);
    const item = mockData.find(o => o.Id === itemId);
    return mockDelay(item ? new Equipo(item) : null);
  }

  public async getFilteredItems(filter: string): Promise<Array<Equipo>> {
    console.log("🔎 [MOCK] Filtrando equipos...", filter);
    return this.getItems();
  }
}
