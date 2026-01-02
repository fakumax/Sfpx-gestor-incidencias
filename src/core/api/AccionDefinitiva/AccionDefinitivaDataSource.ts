import { SPFI } from "@pnp/sp";
import IDatasource from "../IDatasource";
import AccionDefinitiva from "../../entities/AccionDefinitiva";
import { getSP } from "../../pnp/sp/pnpjs-presets";

export class AccionDefinitivaDataSource
  implements IDatasource<AccionDefinitiva>
{
  private _sp: SPFI;
  public listTitle: string;
  private selectProperties: Array<string>;
  private expand: Array<string>;
  constructor(
    listTitle: string,
    properties: Array<string> = ["*"],
    expand: Array<string> = []
  ) {
    this._sp = getSP();
    this.listTitle = listTitle;
    this.selectProperties = properties;
    this.expand = expand;
  }

  public async getChoiceFields(): Promise<{ [key: string]: string[] }> {
    try {
      const list = this._sp.web.lists.getByTitle(this.listTitle);
      const fields = await list.fields();

      const choiceFields = fields
        .filter((field) => field.TypeAsString === "Choice")
        .reduce((acc, field) => {
          acc[field.InternalName] = field.Choices || [];
          return acc;
        }, {});

      return choiceFields;
    } catch (error) {
      console.error("Error fetching choice fields:", error);
      return {};
    }
  }

  async add(item: AccionDefinitiva): Promise<AccionDefinitiva> {
    const listItem = item.toListItem();
    const result = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.add(listItem);
    return this.getById(result.data.Id);
  }

  async edit(item: AccionDefinitiva): Promise<AccionDefinitiva> {
    const listItem = item.toListItem();
    await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(item.Id)
      .update(listItem);
    return this.getById(item.Id);
  }

  async delete(itemId: number): Promise<void> {
    await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(itemId)
      .delete();
  }

  async getById(itemId: number): Promise<AccionDefinitiva> {
    const item = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(itemId)
      .select(...this.selectProperties)
      .expand(...this.expand)();
    return new AccionDefinitiva(item);
  }

  async getFilteredItems(filter: string): Promise<AccionDefinitiva[]> {
    const items = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.filter(filter)
      .select(...this.selectProperties)
      .expand(...this.expand)();
    return items.map((item) => new AccionDefinitiva(item));
  }

  async getItems(): Promise<AccionDefinitiva[]> {
    const items = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.select(...this.selectProperties)
      .expand(...this.expand)();
    return items.map((item) => new AccionDefinitiva(item));
  }

  async getCount(): Promise<number> {
    const items = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.select("Id")();
    return items.length;
  }
}
