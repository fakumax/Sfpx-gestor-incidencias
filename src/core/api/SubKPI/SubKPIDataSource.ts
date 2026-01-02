import { SPFI } from "@pnp/sp";
import { getSP } from "../../pnp/sp/pnpjs-presets";
import ISubKPIDatasource from "./ISubKPIDataSource";
import { SubKPI } from "../../entities";
import { IItems, _Items } from "@pnp/sp/items/types";
import { Lista } from "../../utils/Constants";

export default class SubKPIDatasource implements ISubKPIDatasource<SubKPI> {
  private _sp: SPFI;
  public listTitle: string;
  private selectProperties: Array<string>;
  private expand: Array<string>;
  private selectPropertiesDefault: Array<string> = [
    "Id",
    "Title",
    "Etapa",
    "VisibleParaSeleccion",
  ];
  private expandPropertiesDefault: Array<string> = [];

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

  public async getItems(): Promise<Array<SubKPI>> {
    const items: IItems[] = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.select(...this.selectProperties)
      .expand(...this.expand)();
    return items.map((item) => new SubKPI(item));
  }

  public add(item: SubKPI): Promise<SubKPI> {
    const listItem = item.toListItem();
    return this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.add(listItem)
      .then((result) => {
        return this.getById(result.ID).then((itemAdd: SubKPI) => {
          return itemAdd;
        });
      })
      .catch((err) => {
        return err;
      });
  }

  public async addMultiple(items: SubKPI[]): Promise<SubKPI[]> {
    const list = this._sp.web.lists.getByTitle(this.listTitle);
    const results: SubKPI[] = [];

    for (let item of items) {
      const result = await list.items.add(item.toListItem());
      results.push(new SubKPI(result));
    }
    return results;
  }

  public async deleteMultiple(array: number[]): Promise<void> {
    const list = this._sp.web.lists.getByTitle(this.listTitle);
    for (let item of array) {
      await list.items.getById(item).delete();
    }
  }

  public edit(item: SubKPI): Promise<SubKPI> {
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

  public async getById(itemId: number): Promise<SubKPI> {
    return await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(itemId)
      .select(...this.selectProperties)
      .expand(...this.expand)()
      .then((item) => new SubKPI(item))
      .catch((err) => {
        return err;
      });
  }

  public async getFilteredItems(filter: string): Promise<SubKPI[]> {
    const items = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.filter(filter)
      .select(...this.selectProperties)
      .expand(...this.expand)();
    return items.map((item) => new SubKPI(item));
  }
}
