import BaseEntity from "./BaseEntity";
import Utils from "../utils/Utils";
import User from "./User";
import FilePnp from "./FilePnp";

export default class GestionAnormalidad extends BaseEntity {
  public IDObiraId: number;
  public Status: string;
  public Comentarios: string;
  public FechaDeFinalizacion: Date;
  public Responsable: User;
  public ResponsableSeguimiento: User;
  public Files: FilePnp[];
  public AccionesATomar: string;

  constructor(item?: any) {
    super(item);
  }

  protected mapItem(item: any): void {
    if (item) {
      this.IDObiraId = item.IDObiraId ? item.IDObiraId : item.ObirasId ? item.ObirasId : null;
      this.Status = item.Status || "";
      this.Comentarios = item.Comentarios === "" ? null : item.Comentarios ?? null;
      this.FechaDeFinalizacion = item.FechaDeFinalizacion ? item.FechaDeFinalizacion : item.FechaRealizacion ? item.FechaRealizacion : item.FechaRealizacion === "" ? null : "";
      this.Responsable = item.Responsable ? new User(item.Responsable) : new User(null);
      this.ResponsableSeguimiento = item.ResponsableSeguimiento ? new User(item.ResponsableSeguimiento) : new User(null);
      this.Files = item.AttachmentFiles ? item.AttachmentFiles.map((file: any) => new FilePnp(file)) : [];
      this.AccionesATomar = item.Title ? item.Title : item.AccionesATomar ? item.AccionesATomar : item.AccionesATomar === "" ? null : "";
    }
  }

  public toListItem(): any {
    const listItem = Utils.removeUndefined({
      ...super.toListItem(),
      Title: this.AccionesATomar,
      Comentarios: this.Comentarios === "" ? null : this.Comentarios,
      IDObiraId: this.IDObiraId,
      Status: this.Status,
      FechaDeFinalizacion: this.FechaDeFinalizacion
        ? this.FechaDeFinalizacion.toISOString()
        : undefined,
      ResponsableId: this.Responsable.Id,
      ResponsableSeguimientoId: this.ResponsableSeguimiento.Id,
    });

    return listItem;
  }
}
