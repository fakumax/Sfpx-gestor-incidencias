import { SPFI } from "@pnp/sp";
import { getSP } from "../../pnp/sp/pnpjs-presets";
import IEquipoDatasource from "./IEquipoDatasource";
import { Equipo } from "../../entities";
import { IItems, _Items } from "@pnp/sp/items/types";
import { Lista } from "../../utils/Constants";

export default class EquipoDatasource implements IEquipoDatasource<Equipo> {
  private _sp: SPFI;
  public listTitle: string;
  private selectProperties: Array<string>;
  private expand: Array<string>;
  private selectPropertiesDefault: Array<string> = [
    "Id",
    "Title",
    "Equipo",
    "IDEquipo0",
    "Proveedor/Id",
    "Proveedor/Title",
    "ResponsableId",
    "Responsable/Title",
    "Responsable/EMail",
    "Responsable/Id",
    "JefeId",
    "Jefe/Title",
    "Jefe/EMail",
    "Jefe/Id",
  ];
  private expandPropertiesDefault: Array<string> = [
    "Proveedor",
    "Responsable",
    "Jefe"
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

  public async getItems(): Promise<Array<Equipo>> {
    const items: IItems[] = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.select(...this.selectProperties)
      .expand(...this.expand)();
    return items.map((item) => new Equipo(item));
  }

  public add(item: Equipo): Promise<Equipo> {
    const listItem = item.toListItem();
    return this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.add(listItem)
      .then((result) => {
        return this.getById(result.ID).then((itemAdd: Equipo) => {
          return itemAdd;
        });
      })
      .catch((err) => {
        return err;
      });
  }

  public async addMultiple(items: Equipo[]): Promise<Equipo[]> {
    const list = this._sp.web.lists.getByTitle(this.listTitle);
    const results: Equipo[] = [];

    for (let item of items) {
      const result = await list.items.add(item.toListItem());
      results.push(new Equipo(result));
    }
    return results;
  }

  public async deleteMultiple(array: number[]): Promise<void> {
    const list = this._sp.web.lists.getByTitle(this.listTitle);
    for (let item of array) {
      await list.items.getById(item).delete();
    }
  }

  public edit(item: Equipo): Promise<Equipo> {
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

  public async getById(itemId: number): Promise<Equipo> {
    return await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(itemId)
      .select(...this.selectProperties)
      .expand(...this.expand)()
      .then((item) => new Equipo(item))
      .catch((err) => {
        return err;
      });
  }

  public async getEquiposByObira(obiraId: number): Promise<Equipo[]> {
    return await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items
      .filter(`IDObira eq ${obiraId}`)
      .select(...this.selectProperties)
      .expand(...this.expand)
      ()
      .then((items) => {
        return items.map(item => new Equipo(item));
      })
      .catch((err) => {
        return err;
      });
  }

  public async getFilteredItems(filter: string): Promise<Equipo[]> {
    const items = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.filter(filter)
      .select(...this.selectProperties)
      .expand(...this.expand)();
    return items.map((item) => new Equipo(item));
  }

  public async getCount(): Promise<number> {
    return (await this._sp.web.lists.getByTitle(this.listTitle).items()).length;
  }

  public async getByProvider(providerId: number): Promise<Equipo[]> {
    const filter = `ProviderId eq ${providerId}`;
    return this.getFilteredItems(filter);
  }
}
