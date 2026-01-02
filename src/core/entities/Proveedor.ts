import User from "../entities/User";
import { Utils } from '../utils';
import BaseEntity from "./BaseEntity";
import ListaAsociada from "./ListaAsociada";

interface IAttachmentFile {
    FileName: string;
    ServerRelativeUrl: string;
}

export default class Proveedor extends BaseEntity {

    public Activo: boolean;
    public ListaAsociada: ListaAsociada;
    public Author: User;
    public AttachmentFiles?: IAttachmentFile[];
    public Notificacion: Boolean;
    public Responsable: User;
    public Jefe: User;

    constructor(item?: any) {
        super(item);
    }

    protected mapItem(item: any): void {
        this.Activo = item.Activo !== undefined ? item.Activo : false;
        this.ListaAsociada =
            item.listaString ?
                item.listaString : item.listaAsociada ?
                    new ListaAsociada(JSON.parse(item.listaAsociada))
                    : undefined;
        this.AttachmentFiles = item.AttachmentFiles || undefined;
        this.Notificacion = item.Notificacion;
        this.Responsable = item.Responsable ? new User(item.Responsable) : new User(null);
        this.Jefe = item.Jefe ? new User(item.Jefe) : new User(null);

        if (item.Author)
            this.Author = new User(item);
    }

    public toListItem(): any {
        return Utils.removeUndefined({
            ...super.toListItem(),
            Activo: this.Activo,
            ResponsableId: this.Responsable.Id,
            Notificacion: this.Notificacion,
            JefeId: this.Jefe.Id,
            listaAsociada: this.ListaAsociada ? JSON.stringify(this.ListaAsociada) : undefined,
        });
    }
}