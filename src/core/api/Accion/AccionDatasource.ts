import { SPFI } from "@pnp/sp";
import { getSP } from "../../pnp/sp/pnpjs-presets";
import IAccionDatasource from "./IAccionDatasource";
import { Accion } from "../../entities";
import { IItems, _Items } from "@pnp/sp/items/types";
import { Lista } from "../../utils/Constants";

export default class AccionDatasource implements IAccionDatasource<Accion> {
  private _sp: SPFI;
  public listTitle: string;
  private selectProperties: Array<string>;
  private expand: Array<string>;
  private selectPropertiesDefault: Array<string> = [
    "Id",
    "Title",
    "Created",
    "Author/EMail",
    "Author/ID",
    "Modified",
    "AQueEquipos",
    "AplicaYokoten",
    "CausaRaiz",
    "Comentarios",
    "Contramedida",
    "FechaDeCierreLuegoDeSeguimiento",
    "FechaDeImplementacionDeContramed",
    "FechaFinDeLaTransversalizacion",
    "IDObiraId",
    "IDObira_x003a_Tipo_x0020_ObiraId",
    "IDObira_x003a_var_ProblemaId",
    "MetodoDeEstandarizacion",
    "Responsable/ID",
    "Responsable/EMail",
    "Responsable/Title",
    "ResponsableSeguimiento/ID",
    "ResponsableSeguimiento/EMail",
    "ResponsableSeguimiento/Title",
    "StatusAccionDefinitiva",
    "StatusYokoten",
    "TipoDeCausaRaiz",
    "AttachmentFiles",
  ];
  private expandPropertiesDefault: Array<string> = [
    "Author",
    "ResponsableSeguimiento",
    "Responsable",
    "AttachmentFiles",
  ];
  private selectPropertiesList: Array<string> = ["Id", "Title"];

  constructor(
    listTitle: string,
    properties?: Array<string>,
    expand?: Array<string>
  ) {
    this._sp = getSP();
    this.listTitle = listTitle;
    this.selectProperties =
      properties != null ? properties : this.selectPropertiesDefault;
    this.expand = expand != null ? expand : this.expandPropertiesDefault;
  }

  public async getActionsByObiraIds(obiraIds: number[]): Promise<Accion[]> {
    const batchSize = 20;
    let allItems: Accion[] = [];
    for (let i = 0; i < obiraIds.length; i += batchSize) {
      const batchIds = obiraIds.slice(i, i + batchSize);
      const filter = batchIds.map(id => `IDObira eq ${id}`).join(' or ');
      const items: any[] = await this._sp.web.lists
        .getByTitle(this.listTitle)
        .items
        .filter(filter)
        .select(...this.selectProperties)
        .expand(...this.expand)();
      allItems = allItems.concat(items.map(item => new Accion(item)));
    }
    return allItems;
  }

  public async getItems(): Promise<Array<Accion>> {
    const items: IItems[] = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.select(...this.selectProperties)
      .expand(...this.expand)();
    return items.map((item) => new Accion(item));
  }

  public async getItemsSimple(): Promise<Array<Accion>> {
    const items: IItems[] = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.select(...this.selectPropertiesList)();
    return items.map((item) => new Accion(item));
  }

  public add(item: Accion): Promise<Accion> {
    const listItem = item.toListItem();
    return this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.add(listItem)
      .then((result) => {
        return this.getById(result.ID).then((itemAdd: Accion) => {
          return itemAdd;
        });
      })
      .catch((err) => {
        return err;
      });
  }

  public async addMultiple(items: Accion[]): Promise<Accion[]> {
    const list = this._sp.web.lists.getByTitle(this.listTitle);
    const results: Accion[] = [];

    for (let item of items) {
      const result = await list.items.add(item.toListItem());
      results.push(new Accion(result));
    }
    return results;
  }

  public async deleteMultiple(array: number[]): Promise<void> {
    const list = this._sp.web.lists.getByTitle(this.listTitle);
    for (let item of array) {
      await list.items.getById(item).delete();
    }
  }

  public async editMultiple(items: Accion[]): Promise<Accion[]> {
    const list = this._sp.web.lists.getByTitle(this.listTitle);
    const updatedItems: Accion[] = [];

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

  public edit(item: Accion): Promise<Accion> {
    const listItem = item.toListItem();
    return this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(item.Id)
      .update(listItem)
      .then(() => {
        return this.getById(item.Id);
      })
      .catch((err) => {
        return err;
      });
  }

  public delete(itemId: number): Promise<void> {
    return this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(itemId)
      .delete();
  }

  public async getById(itemId: number): Promise<Accion> {
    return await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(itemId)
      .select(...this.selectProperties)
      .expand(...this.expand)()
      .then((item) => new Accion(item))
      .catch((err) => {
        return err;
      });
  }

  public async getAccionesByObira(obiraId: number): Promise<Accion[]> {
    return await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items
      .filter(`IDObira eq ${obiraId}`)
      .select(...this.selectProperties)
      .expand(...this.expand)
      ()
      .then((items) => {
        return items.map(item => new Accion(item));
      })
      .catch((err) => {
        return err;
      });
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
