import { SPFI } from "@pnp/sp";
import { getSP } from "../../pnp/sp/pnpjs-presets";
import ILocacionDatasource from "./ILocacionDatasource";
import { Locacion } from "../../entities";
import { IItems, _Items } from "@pnp/sp/items/types";
import { Lista } from "../../utils/Constants";

export default class LocacionDatasource implements ILocacionDatasource<Locacion> {
  private _sp: SPFI;
  public listTitle: string;
  private selectProperties: Array<string>;
  private expand: Array<string>;
  private selectPropertiesDefault: Array<string> = ["Id", "Title", "HUB", "AREA", "NEGOCIO"];
  private expandPropertiesDefault: Array<string> = [];
  private selectPropertiesList: Array<string> = ["Id", "Title"];

  constructor(
    listTitle: string,
    properties?: Array<string>,
    expand?: Array<string>
  ) {
    this._sp = getSP();
    this.listTitle = listTitle;
    this.selectProperties =
      properties != null ? properties : this.selectPropertiesDefault;
    this.expand = expand != null ? expand : this.expandPropertiesDefault;
  }

  public async getItems(): Promise<Array<Locacion>> {
    const items: IItems[] = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.select(...this.selectProperties)
      .expand(...this.expand)
      .top(5000)();
    return items.map((item) => new Locacion(item));
  }

  public add(item: Locacion): Promise<Locacion> {
    const listItem = item.toListItem();
    return this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.add(listItem)
      .then((result) => {
        return this.getById(result.ID).then((itemAdd: Locacion) => {
          return itemAdd;
        });
      })
      .catch((err) => {
        return err;
      });
  }

  public async addMultiple(items: Locacion[]): Promise<Locacion[]> {
    const list = this._sp.web.lists.getByTitle(this.listTitle);
    const results: Locacion[] = [];

    for (let item of items) {
      const result = await list.items.add(item.toListItem());
      results.push(new Locacion(result));
    }
    return results;
  }

  public async deleteMultiple(array: number[]): Promise<void> {
    const list = this._sp.web.lists.getByTitle(this.listTitle);
    for (let item of array) {
      await list.items.getById(item).delete();
    }
  }

  public edit(item: Locacion): Promise<Locacion> {
    const listItem = item.toListItem();
    return this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(item.Id)
      .update(listItem)
      .then(() => {
        return this.getById(item.Id);
      })
      .catch((err) => {
        return err;
      });
  }

  public delete(itemId: number): Promise<void> {
    return this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(itemId)
      .delete();
  }

  public async getById(itemId: number): Promise<Locacion> {
    return await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(itemId)
      .select(...this.selectProperties)
      .expand(...this.expand)()
      .then((item) => new Locacion(item))
      .catch((err) => {
        return err;
      });
  }

  public async getFilteredItems(filter: string): Promise<Locacion[]> {
    const items = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.filter(filter)
      .select(...this.selectProperties)
      .expand(...this.expand)();
    return items.map((item) => new Locacion(item));
  }
}
