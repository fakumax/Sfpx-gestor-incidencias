import { SPFI } from "@pnp/sp";
import { getSP } from "../../pnp/sp/pnpjs-presets";
import IProveedorDatasource from "./IProveedorDatasource";
import { Proveedor } from "../../entities";
import { IItems, _Items } from "@pnp/sp/items/types";
import { Lista } from "../../utils/Constants";

export default class ProveedorDatasource
  implements IProveedorDatasource<Proveedor> {
  private _sp: SPFI;
  public listTitle: string;
  private selectProperties: Array<string>;
  private expand: Array<string>;
  private selectPropertiesDefault: Array<string> = [
    "Id",
    "Title",
    "Created",
    "Author/EMail",
    "Author/ID",
    "Modified",
    "Activo",
    "listaAsociada",
    "AttachmentFiles",
    "Notificacion",
    "Responsable/ID",
    "Responsable/EMail",
    "Responsable/Title",
    "Jefe/ID",
    "Jefe/EMail",
    "Jefe/Title",
  ];
  private expandPropertiesDefault: Array<string> = [
    "Author",
    "AttachmentFiles",
    "Responsable",
    "Jefe",
  ];
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

  public async getItems(): Promise<Array<Proveedor>> {
    const items: IItems[] = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.select(...this.selectProperties)
      .expand(...this.expand)();
    return items.map((item) => new Proveedor(item));
  }

  public async getItemsSimple(): Promise<Array<Proveedor>> {
    const items: IItems[] = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.select(...this.selectPropertiesList)();
    return items.map((item) => new Proveedor(item));
  }

  public add(item: Proveedor): Promise<Proveedor> {
    const listItem = item.toListItem();
    return this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.add(listItem)
      .then((result) => {
        return this.getById(result.ID).then((itemAdd: Proveedor) => {
          return itemAdd;
        });
      })
      .catch((err) => {
        return err;
      });
  }

  public async addMultiple(items: Proveedor[]): Promise<Proveedor[]> {
    const list = this._sp.web.lists.getByTitle(this.listTitle);
    const results: Proveedor[] = [];

    for (let item of items) {
      const result = await list.items.add(item.toListItem());
      results.push(new Proveedor(result));
    }
    return results;
  }

  public async deleteMultiple(array: number[]): Promise<void> {
    const list = this._sp.web.lists.getByTitle(this.listTitle);
    for (let item of array) {
      await list.items.getById(item).delete();
    }
  }

  public edit(item: Proveedor): Promise<Proveedor> {
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

  public async getById(itemId: number): Promise<Proveedor> {
    return await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(itemId)
      .select(...this.selectProperties)
      .expand(...this.expand)()
      .then((item) => new Proveedor(item))
      .catch((err) => {
        return err;
      });
  }
  public async getFilteredItems(
    filter: string,
    orderBy?: string,
    ascending: boolean = true
  ): Promise<Array<Proveedor>> {
    let query = this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.filter(filter)
      .select(...this.selectProperties)
      .expand(...this.expand);

    if (orderBy) {
      query = query.orderBy(orderBy, ascending);
    }
    const items: IItems[] = await query();
    return items.map((item) => new Proveedor(item));
  }

}
