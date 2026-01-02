import { Utils } from "../utils";
import BaseEntity from "./BaseEntity";
import User from "./User";

export default class Proveedor extends BaseEntity {
    public Etapa: string
    public Responsable: User;
    public Jefe: User;

    constructor(item?: any) {
        super(item);
    }

    protected mapItem(item: any): void {
        this.Title = item.Title || "";
        this.Etapa = item.Etapa || "";
        this.Responsable = item.Responsable ? new User(item.Responsable) : new User(null);
        this.Jefe = item.Jefe ? new User(item.Jefe) : new User(null);

    }

    public toListItem(): any {
        return Utils.removeUndefined({
            ...super.toListItem(),
            JefeId: this.Jefe.Id,
            Title: this.Title,
            Etapa: this.Etapa,
            ResponsableId: this.Responsable.Id,
        });
    }
}
