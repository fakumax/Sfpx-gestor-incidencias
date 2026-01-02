import BaseEntity from "./BaseEntity";

export default class Etiqueta extends BaseEntity {
    public Id: number;
    public Title: string;
    public Etapa?: string;

    constructor(data: any) {
        super(data);
        this.mapItem(data);
    }

    protected mapItem(item: any): void {
        this.Id = item.Id;
        this.Title = item.Title;
        this.Etapa = item.Etapa ?? "";
    }

    public toListItem(): any {
        return {
            Id: this.Id,
            Title: this.Title,
            Etapa: this.Etapa,
        };
    }
}