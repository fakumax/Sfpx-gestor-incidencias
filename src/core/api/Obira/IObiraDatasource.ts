import { BaseEntity } from "../../entities";

export default interface IObiraDatasource<TItem extends BaseEntity> {
  listTitle: string;

  getCount(): Promise<number>;

  getItems(): Promise<TItem[]>;

  add(item: TItem): Promise<TItem>;

  edit(item: TItem): Promise<TItem>;

  delete(itemId: number): Promise<void>;

  getById(itemId: number): Promise<TItem>;

  getFilteredItems(filter: string): Promise<TItem[]>;

  getByProvider(providerId: number): Promise<TItem[]>;
}
