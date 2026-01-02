import { BaseEntity } from ".";
import FilePnp from "./FilePnp";
import User from "./User";

export default class Obira extends BaseEntity {
  public Etapa: string;
  public EstadoGeneral: string;
  public Bloque: { Title: string; Id: number };
  public Equipo: { Title: string; Id: number };
  public PADLocacion: { Title: string; Id: number };
  public TituloDelProblema: string;
  public TipoDeProblema: string;
  public SubKPIAfectado: { Title: string; Id: number };
  public AccionInmediata: string;
  public Detalle: string;
  public QTY: number;
  public Unidad: string;
  public FechaDeOcurrenciaDelProblema: string;
  public FechaDeRepeticionDelProblema: string;
  public var_Problema: string;
  public Proveedor: string;
  public LinkAlPlan: string;
  public Author: { Title: string; EMail: string };
  public Files: FilePnp[];
  public Etiquetas?: { Id: number; Title: string; Etapa?: string }[];
  public tieneAccionDefinitiva?: boolean;
  public tieneGestionAnormalidad?: boolean;
  public Activo: boolean;
  public CausaRaizPreliminar: string;
  public ResponsableItem: User[];
  public FechaCierre: Date;



  constructor(item?: any) {
    super(item);
  }

  protected mapItem(item: any): void {
    if (item) {
      if (Array.isArray(item.Etiquetas)) {
        this.Etiquetas = item.Etiquetas.map((et: any) => ({
          Id: et.Id,
          Title: et.Title,
          Etapa: et.Etapa ?? ""
        }));
      } else if (item.Etiquetas) {
        this.Etiquetas = item.Etiquetas;
      }
      this.Etapa = item.Etapa || "";
      this.EstadoGeneral = item.EstadoGeneral || undefined;
      this.Equipo = item.Equipo || undefined;
      this.Bloque = item.Bloque || undefined;
      this.PADLocacion = item.PADLocacion || item.PAD || undefined;
      this.FechaDeOcurrenciaDelProblema = item.FechaDeOcurrenciaDelProblema || item.FechaOcurrencia || "";
      this.TipoDeProblema = item.TipoDeProblema || "";
      this.TituloDelProblema = item.TituloDelProblema ? item.TituloDelProblema : item.TituloProblema ? item.TituloProblema : item.TituloProblema === "" ? null : "";
      this.Detalle = item.Detalle || "";
      this.SubKPIAfectado = item.SubKPIAfectado || undefined;
      this.QTY = (item.QTY !== null && item.QTY !== undefined && item.QTY !== "") ? Number(item.QTY) : null;
      this.Unidad = item.Unidad || "";
      this.FechaDeRepeticionDelProblema = item.FechaDeRepeticionDelProblema || "[]";
      this.AccionInmediata = item.AccionInmediata || "";
      this.LinkAlPlan = item.LinkAlPlan ? item.LinkAlPlan : item.LinkAlPlan === "" ? null : "";
      this.Files = item.AttachmentFiles ? item.AttachmentFiles.map((file: any) => new FilePnp(file)) : [];
      this.var_Problema = item.var_Problema || "";
      this.Proveedor = item.Proveedor || "";
      this.LinkAlPlan = item.LinkAlPlan || "";
      this.Author = item.Author || { Title: "", EMail: "" };
      this.tieneAccionDefinitiva = item.tieneAccionDefinitiva;
      this.tieneGestionAnormalidad = item.tieneGestionAnormalidad;
      this.Activo = item.Activo;
      this.CausaRaizPreliminar = item.CausaRaizPreliminar === "" ? null : item.CausaRaizPreliminar ?? null;
      if (Array.isArray(item.ResponsableItem)) {
        // Si es un array (nuevo formato)
        this.ResponsableItem = item.ResponsableItem.map(u => new User(u));
      } else if (item.ResponsableItem) {
        // Si es un único usuario (compatibilidad con datos viejos)
        this.ResponsableItem = [new User(item.ResponsableItem)];
      } else {
        this.ResponsableItem = [];
      }
      this.FechaCierre =
        item.FechaCierre
          ? new Date(item.FechaCierre)
          : null;

    }
  }
  public toListItem(): any {
    const listItem = {
      ...super.toListItem(),
      Etapa: this.Etapa,
      EstadoGeneral: this.EstadoGeneral,
      BloqueId: this.Bloque?.Id,
      EquipoId: this.Equipo?.Id && this.Equipo.Id !== 0 ? this.Equipo.Id : null,
      PADLocacionId: this.PADLocacion?.Id,
      TituloDelProblema: this.TituloDelProblema,
      TipoDeProblema: this.TipoDeProblema,
      SubKPIAfectadoId: this.SubKPIAfectado?.Id,
      AccionInmediata: this.AccionInmediata,
      Detalle: this.Detalle,
      QTY: this.QTY ?? null,
      Unidad: this.Unidad,
      FechaDeOcurrenciaDelProblema: this.FechaDeOcurrenciaDelProblema && this.FechaDeOcurrenciaDelProblema !== ""
        ? this.FechaDeOcurrenciaDelProblema
        : null,
      FechaDeRepeticionDelProblema: this.FechaDeRepeticionDelProblema ?? "[]",
      Proveedor: this.Proveedor,
      LinkAlPlan: this.LinkAlPlan,
      EtiquetasId: this.Etiquetas && this.Etiquetas.length > 0 ? this.Etiquetas.map(e => e.Id) : [],
      tieneAccionDefinitiva: this.tieneAccionDefinitiva,
      tieneGestionAnormalidad: this.tieneGestionAnormalidad,
      Activo: this.Activo,
      CausaRaizPreliminar: this.CausaRaizPreliminar === "" ? null : this.CausaRaizPreliminar,
      ResponsableItemId:
        this.ResponsableItem && this.ResponsableItem.length > 0
          ? this.ResponsableItem.map(u => u.Id)
          : [],
      FechaCierre: this.FechaCierre,
    };
    return listItem;
  }
}
