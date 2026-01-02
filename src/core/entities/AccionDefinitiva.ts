import { BaseEntity } from ".";
import User from "./User";

export default class AccionDefinitiva extends BaseEntity {
  public Id: number;
  public Title: string;
  public CausaRaiz: string;
  public Contramedida: string;
  public Responsable: User;
  public ResponsableId: number;
  public ResponsableSeguimiento: User;
  public ResponsableSeguimientoId: number;
  public FechaDeImplementacionDeContramed: Date;
  public StatusAccionDefinitiva: string;
  public MetodoDeEstandarizacion: string;
  public FechaDeCierreLuegoDeSeguimiento: Date;
  public AplicaYokoten: boolean;
  public AQueEquipos: string;
  public FechaFinDeLaTransversalizacion: Date;
  public StatusYokoten: string;
  public TipoDeCausaRaiz: string;
  public Comentarios: string;
  public IDObiraId: number;

  constructor(item: any) {
    super(item);
    this.mapItem(item);
  }

  protected mapItem(item: any): void {
    if (item) {
      this.Title = item.Title || "";
      this.CausaRaiz = item.CausaRaiz || "";
      this.Contramedida = item.Contramedida || "";
      this.ResponsableId = item.ResponsableId;
      this.ResponsableSeguimientoId = item.ResponsableSeguimientoId;
      this.FechaDeImplementacionDeContramed =
        item.FechaDeImplementacionDeContramed
          ? new Date(item.FechaDeImplementacionDeContramed)
          : null;
      this.StatusAccionDefinitiva = item.StatusAccionDefinitiva || "";
      this.MetodoDeEstandarizacion = item.MetodoDeEstandarizacion || "";
      this.FechaDeCierreLuegoDeSeguimiento =
        item.FechaDeCierreLuegoDeSeguimiento
          ? new Date(item.FechaDeCierreLuegoDeSeguimiento)
          : null;
      this.AplicaYokoten = item.AplicaYokoten || false;
      this.AQueEquipos = item.AQueEquipos || "";
      this.FechaFinDeLaTransversalizacion = item.FechaFinDeLaTransversalizacion
        ? new Date(item.FechaFinDeLaTransversalizacion)
        : null;
      this.StatusYokoten = item.StatusYokoten || "";
      this.TipoDeCausaRaiz = item.TipoDeCausaRaiz || "";
      this.Comentarios = item.Comentarios || "";
      this.IDObiraId = item.IDObiraId || null;
    }
  }

  public toListItem(): any {
    const listItem = {
      ...super.toListItem(),
      Title: this.Title,
      CausaRaiz: this.CausaRaiz,
      Contramedida: this.Contramedida,
      ResponsableId: this.ResponsableId,
      ResponsableSeguimientoId: this.ResponsableSeguimientoId,
      FechaDeImplementacionDeContramed: this.FechaDeImplementacionDeContramed,
      StatusAccionDefinitiva: this.StatusAccionDefinitiva,
      MetodoDeEstandarizacion: this.MetodoDeEstandarizacion,
      FechaDeCierreLuegoDeSeguimiento: this.FechaDeCierreLuegoDeSeguimiento,
      AplicaYokoten: this.AplicaYokoten,
      AQueEquipos: this.AQueEquipos,
      FechaFinDeLaTransversalizacion: this.FechaFinDeLaTransversalizacion,
      StatusYokoten: this.StatusYokoten,
      TipoDeCausaRaiz: this.TipoDeCausaRaiz,
      Comentarios: this.Comentarios,
      IDObiraId: this.IDObiraId,
    };

    return listItem;
  }
}
