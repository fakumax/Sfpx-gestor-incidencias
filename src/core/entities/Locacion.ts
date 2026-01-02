import BaseEntity from "./BaseEntity";

export default class Locacion extends BaseEntity {
  public Title: string;
  public HUB: string;
  public AREA: string;
  public NEGOCIO: string;

  constructor(data: any) {
    super(data);
    this.mapItem(data);
  }

  protected mapItem(item: any): void {
    this.Title = item.Title || "";
    this.HUB = item.HUB || "";
    this.AREA = item.AREA || "";
    this.NEGOCIO = item.NEGOCIO || "";
  }

  public toListItem(): any {
    return {
      Title: this.Title,
      HUB: this.HUB,
      AREA: this.AREA,
      NEGOCIO: this.NEGOCIO,
    };
  }
}
