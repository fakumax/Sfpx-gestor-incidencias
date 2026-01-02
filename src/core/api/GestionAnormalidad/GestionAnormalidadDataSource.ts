import { SPFI } from "@pnp/sp";
import GestionAnormalidad from "../../entities/GestionAnormalidad";
import IGestionAnormalidadDataSource from "./IGestionAnormalidadDataSource";
import { getSP } from "../../pnp/sp/pnpjs-presets";

export class GestionAnormalidadDataSource
  implements IGestionAnormalidadDataSource<GestionAnormalidad> {
  private _sp: SPFI;
  public listTitle: string;
  private selectProperties: Array<string>;
  private expand: Array<string>;

  constructor(
    listTitle: string,
    properties: Array<string> = [
      "Id",
      "Title",
      "IDObiraId",
      "Status",
      "FechaDeFinalizacion",
      "Comentarios",
      "ResponsableId",
      "Responsable/Title",
      "Responsable/EMail",
      "Responsable/Id",
      "ResponsableSeguimientoId",
      "ResponsableSeguimiento/Title",
      "ResponsableSeguimiento/EMail",
      "ResponsableSeguimiento/Id",
      "AttachmentFiles",
    ],
    expand: Array<string> = [
      "Responsable",
      "ResponsableSeguimiento",
      "AttachmentFiles",
    ]
  ) {
    this._sp = getSP();
    this.listTitle = listTitle;
    this.selectProperties = properties;
    this.expand = expand;
  }


  public async getAbnormalitiesByObiraIds(obiraIds: number[]): Promise<GestionAnormalidad[]> {
    const batchSize = 20;
    let allItems: GestionAnormalidad[] = [];
    for (let i = 0; i < obiraIds.length; i += batchSize) {
      const batchIds = obiraIds.slice(i, i + batchSize);
      const filter = batchIds.map(id => `IDObira eq ${id}`).join(' or ');
      const items: any[] = await this._sp.web.lists
        .getByTitle(this.listTitle)
        .items
        .filter(filter)
        .select(...this.selectProperties)
        .expand(...this.expand)();
      allItems = allItems.concat(items.map(item => new GestionAnormalidad(item)));
    }
    return allItems;
  }

  public async getItems(): Promise<Array<GestionAnormalidad>> {
    const items: any[] = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.select(...this.selectProperties)
      .expand(...this.expand)();
    return items.map((item: any) => new GestionAnormalidad(item));
  }

  public async add(item: GestionAnormalidad): Promise<GestionAnormalidad> {
    const listItem = item.toListItem();
    const result = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.add(listItem);
    return this.getById(result.data.Id);
  }

  public async getById(itemId: number): Promise<GestionAnormalidad> {
    const item = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(itemId)
      .select(...this.selectProperties)
      .expand(...this.expand)();
    return new GestionAnormalidad(item);
  }

  public async edit(item: GestionAnormalidad): Promise<GestionAnormalidad> {
    const listItem = item.toListItem();
    await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(item.Id)
      .update(listItem);
    return this.getById(item.Id);
  }

  public async delete(itemId: number): Promise<void> {
    await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(itemId)
      .delete();
  }

  public async getAnormalidadesByObira(obiraId: number): Promise<GestionAnormalidad[]> {
    return await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items
      .filter(`IDObira eq ${obiraId}`)
      .select(...this.selectProperties)
      .expand(...this.expand)
      ()
      .then((items) => {
        return items.map(item => new GestionAnormalidad(item));
      })
      .catch((err) => {
        return err;
      });
  }

  public async getChoiceFields(): Promise<{ [key: string]: string[] }> {
    try {
      const fields = await this._sp.web.lists
        .getByTitle(this.listTitle)
        .fields();
      const choiceFields: { [key: string]: string[] } = {};
      fields
        .filter((field) => field.FieldTypeKind === 6)
        .forEach((field) => {
          choiceFields[field.InternalName] = field.Choices || [];
        });
      return choiceFields;
    } catch (error) {
      console.error(
        `Error al obtener los campos choice de ${this.listTitle}:`,
        error
      );
      return {};
    }
  }

  public async addMultiple(items: GestionAnormalidad[]): Promise<GestionAnormalidad[]> {
    const list = this._sp.web.lists.getByTitle(this.listTitle);
    const results: GestionAnormalidad[] = [];

    for (let item of items) {
      const result = await list.items.add(item.toListItem());
      results.push(new GestionAnormalidad(result));
    }
    return results;
  }

  public async deleteMultiple(array: number[]): Promise<void> {
    const list = this._sp.web.lists.getByTitle(this.listTitle);
    for (let item of array) {
      await list.items.getById(item).delete();
    }
  }

  public async editMultiple(items: GestionAnormalidad[]): Promise<GestionAnormalidad[]> {
    const list = this._sp.web.lists.getByTitle(this.listTitle);
    const updatedItems: GestionAnormalidad[] = [];

    for (let item of items) {
      const listItem = item.toListItem();
      try {
        await list.items.getById(item.Id).update(listItem);
        const updatedItem = await this.getById(item.Id);
        updatedItems.push(updatedItem);
      } catch (err) {
        console.error(`Error al actualizar el elemento con ID ${item.Id}:`, err);
      }
    }

    return updatedItems;
  }

  public async addMultipleFiles(files: File[], itemId: number): Promise<File[]> {
    try {
      const item = await this._sp.web.lists.getByTitle(this.listTitle).items.getById(itemId);

      if (!item.attachmentFiles) {
        throw new Error("Verificar la configuración de la lista.");
      }

      for (const file of files) {
        const fileContent = await file.arrayBuffer();
        await item.attachmentFiles.add(file.name, fileContent);
      }

      return files;
    } catch (error) {
      console.error("Error al subir los archivos:", error);
      throw new Error("Error en la carga de archivos.");
    }
  }
  public async deleteMultipleFiles(fileNames: string[], itemId: number): Promise<void> {
    try {
      const item = await this._sp.web.lists.getByTitle(this.listTitle).items.getById(itemId);

      if (!item.attachmentFiles) {
        throw new Error("Verificar la configuración de la lista.");
      }

      for (const fileName of fileNames) {
        await item.attachmentFiles.getByName(fileName).delete();
      }

    } catch (error) {
      console.error("Error al eliminar los archivos:", error);
      throw new Error("Error en la eliminación de archivos.");
    }
  }
}
