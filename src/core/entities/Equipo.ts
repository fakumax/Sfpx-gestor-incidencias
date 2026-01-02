import BaseEntity from "./BaseEntity";
import User from "./User";

export default class Equipo extends BaseEntity {
  public Title: string;
  public Equipo: string;
  public IDEquipo: string;
  public Proveedor: { Title: string; Id: number };
  public Responsable: User;
  public Jefe: User;


  constructor(data: any) {
    super(data);
    this.mapItem(data);
  }

  protected mapItem(item: any): void {
    this.Title = item.Title || item.Titulo || "";
    this.Equipo = item.Equipo || "";
    this.IDEquipo = item.IDEquipo0 || "";
    this.Proveedor = item.Proveedor || { Title: "", Id: 0 };
    this.Responsable = item.Responsable ? new User(item.Responsable) : new User(null);
    this.Jefe = item.Jefe ? new User(item.Jefe) : new User(null);
  }

  public toListItem(): any {
    return {
      Title: this.Title,
      Equipo: this.Equipo,
      IDEquipo0: this.IDEquipo,
      ProveedorId: this.Proveedor?.Id,
      ResponsableId: this.Responsable?.Id,
      JefeId: this.Jefe?.Id,
    };
  }
}
