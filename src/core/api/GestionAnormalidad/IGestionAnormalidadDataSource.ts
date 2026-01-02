// IGestionAnormalidadDataSource.ts
import GestionAnormalidad from "../../entities/GestionAnormalidad";
import IDatasource from "../IDatasource";

export default interface IGestionAnormalidadDataSource<
  TItem extends GestionAnormalidad
> extends IDatasource<TItem> {
  listTitle: string;
  getItems(): Promise<TItem[]>;

  add(item: TItem): Promise<TItem>;

  edit(item: TItem): Promise<TItem>;

  delete(itemId: number): Promise<void>;

  getById(itemId: number): Promise<TItem>;

  getAnormalidadesByObira(obiraId: number): Promise<TItem[]>;

  getAbnormalitiesByObiraIds(obiraIds: number[]): Promise<TItem[]>;
}
