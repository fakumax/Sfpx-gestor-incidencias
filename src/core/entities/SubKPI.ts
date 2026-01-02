import BaseEntity from "./BaseEntity";

export default class SubKPI extends BaseEntity {
  public Title: string;
  public Etapa: string;
  public VisibleParaSeleccion: boolean;

  constructor(data: any) {
    super(data);
    this.mapItem(data);
  }

  protected mapItem(item: any): void {
    this.Title = item.Title || "";
    this.Etapa = item.Etapa || "";
    this.VisibleParaSeleccion = item.VisibleParaSeleccion || false;
  }

  public toListItem(): any {
    return {
      Title: this.Title,
      Etapa: this.Etapa,
      VisibleParaSeleccion: this.VisibleParaSeleccion,
    };
  }
}
