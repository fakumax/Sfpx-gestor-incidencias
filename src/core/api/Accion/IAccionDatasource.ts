import { BaseEntity } from "../../entities";

export default interface IDatasource<TItem extends BaseEntity> {

	listTitle: string;

	getItems(): Promise<TItem[]>;

	getItemsSimple(): Promise<TItem[]>;

	add(item: TItem): Promise<TItem>;

	edit(item: TItem): Promise<TItem>;

	delete(itemId: number): Promise<void>;

	getById(itemId: number): Promise<TItem>;

	getAccionesByObira(obiraId: number): Promise<TItem[]>;

	getActionsByObiraIds(obiraIds: number[]): Promise<TItem[]>;
}