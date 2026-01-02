import { Etiqueta } from "../../entities";

export default interface IEtiquetaDatasource {
    listTitle: string;

    getAll(): Promise<Etiqueta[]>;
    add(item: Etiqueta): Promise<Etiqueta>;
    edit(item: Etiqueta): Promise<Etiqueta>;
    delete(itemId: number): Promise<void>;
    getById(itemId: number): Promise<Etiqueta>;
    getFilteredItems(filter: string): Promise<Etiqueta[]>;
}
