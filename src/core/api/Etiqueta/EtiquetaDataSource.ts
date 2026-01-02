import { SPFI } from "@pnp/sp";
import { getSP } from "../../pnp/sp/pnpjs-presets";
import { Etiqueta } from "../../entities";

export default class EtiquetaDataSource {
    private _sp: SPFI;
    public listTitle: string;
    private selectProperties: Array<string>;
    private selectPropertiesDefault: Array<string> = ["Id", "Title", "Etapa"];

    constructor(listTitle: string, properties?: Array<string>) {
        this._sp = getSP();
        this.listTitle = listTitle;
        this.selectProperties = properties != null ? properties : this.selectPropertiesDefault;
    }

    public async getAll(): Promise<Etiqueta[]> {
        const items = await this._sp.web.lists
            .getByTitle(this.listTitle)
            .items.select(...this.selectProperties)();
        return items.map((item: any) => new Etiqueta(item));
    }

    public async getFilteredItems(filter: string): Promise<Etiqueta[]> {
        const items = await this._sp.web.lists
            .getByTitle(this.listTitle)
            .items.filter(filter)
            .select(...this.selectProperties)();
        return items.map((item: any) => new Etiqueta(item));
    }

    public async add(item: Etiqueta): Promise<Etiqueta> {
        const listItem = item.toListItem();
        const result = await this._sp.web.lists.getByTitle(this.listTitle).items.add(listItem);
        return new Etiqueta({ ...listItem, Id: result.data.Id });
    }

    public async edit(item: Etiqueta): Promise<Etiqueta> {
        const listItem = item.toListItem();
        await this._sp.web.lists.getByTitle(this.listTitle).items.getById(item.Id).update(listItem);
        return new Etiqueta(listItem);
    }

    public async delete(itemId: number): Promise<void> {
        await this._sp.web.lists.getByTitle(this.listTitle).items.getById(itemId).delete();
    }

    public async getById(itemId: number): Promise<Etiqueta> {
        const item = await this._sp.web.lists.getByTitle(this.listTitle).items.getById(itemId).select(...this.selectProperties)();
        return new Etiqueta(item);
    }
}
