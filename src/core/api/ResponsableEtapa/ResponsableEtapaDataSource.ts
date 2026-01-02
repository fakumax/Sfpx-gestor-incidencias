
import { SPFI } from "@pnp/sp";
import { getSP } from "../../pnp/sp/pnpjs-presets";
import { ResponsableEtapa } from "../../entities";
import { IItems, _Items } from "@pnp/sp/items/types";

export default class ResponsableEtapaDataSource {
    private _sp: SPFI;
    public listTitle: string;
    private selectProperties: Array<string>;
    private selectPropertiesDefault: Array<string> = [
        "Id",
        "Title",
        "Etapa",
        "Responsable/Id",
        "Responsable/Title",
        "Responsable/EMail",
        "Jefe/Id",
        "Jefe/Title",
        "Jefe/EMail",
    ];
    private expandProperties: Array<string>;
    private expandPropertiesDefault: Array<string> = ["Responsable", "Jefe"];

    constructor(listTitle: string, properties?: Array<string>, expand?: Array<string>) {
        this._sp = getSP();
        this.listTitle = listTitle;
        this.selectProperties = properties && properties.length > 0 ? properties : this.selectPropertiesDefault;
        this.expandProperties = expand && expand.length > 0 ? expand : this.expandPropertiesDefault;
    }

    public async getAll(): Promise<ResponsableEtapa[]> {
        const items = await this._sp.web.lists
            .getByTitle(this.listTitle)
            .items.select(...this.selectProperties).expand(...this.expandProperties)();
        return items.map((item: any) => new ResponsableEtapa(item));
    }

    public async getFilteredItems(filter: string): Promise<ResponsableEtapa[]> {
        const items = await this._sp.web.lists
            .getByTitle(this.listTitle)
            .items.filter(filter)
            .select(...this.selectProperties).expand(...this.expandProperties)();
        return items.map((item: any) => new ResponsableEtapa(item));
    }

    public async getItems(): Promise<ResponsableEtapa[]> {
        return this.getAll();
    }

    public async getItemsSimple(): Promise<ResponsableEtapa[]> {
        return this.getAll();
    }

    public async add(item: ResponsableEtapa): Promise<ResponsableEtapa> {
        const listItem = item.toListItem();
        const result = await this._sp.web.lists.getByTitle(this.listTitle).items.add(listItem);
        return new ResponsableEtapa({ ...listItem, Id: result.data.Id });
    }

    public async edit(item: ResponsableEtapa): Promise<ResponsableEtapa> {
        const listItem = item.toListItem();
        if (item.Id === undefined) {
            throw new Error("Cannot update ResponsableEtapa: Id is undefined");
        }
        await this._sp.web.lists.getByTitle(this.listTitle).items.getById(item.Id).update(listItem);
        return new ResponsableEtapa(listItem);
    }

    public async delete(itemId: number): Promise<void> {
        await this._sp.web.lists.getByTitle(this.listTitle).items.getById(itemId).delete();
    }

    public async getById(itemId: number): Promise<ResponsableEtapa> {
        const item = await this._sp.web.lists.getByTitle(this.listTitle).items.getById(itemId).select(...this.selectProperties).expand(...this.expandProperties)();
        return new ResponsableEtapa(item);
    }
}
