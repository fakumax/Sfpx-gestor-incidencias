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
        
        // Soportar múltiples formatos: ListaAsociada (objeto directo), listaString, o listaAsociada (JSON string)
        if (item.ListaAsociada && typeof item.ListaAsociada === 'object') {
            // Datos mock o ya parseados
            this.ListaAsociada = new ListaAsociada(item.ListaAsociada);
        } else if (item.listaString) {
            this.ListaAsociada = item.listaString;
        } else if (item.listaAsociada) {
            this.ListaAsociada = new ListaAsociada(JSON.parse(item.listaAsociada));
        } else {
            this.ListaAsociada = undefined;
        }
        
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