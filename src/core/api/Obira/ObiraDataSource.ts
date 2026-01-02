import { Obira } from "../../entities";
import { SPFI } from "@pnp/sp";
import { getSP } from "../../pnp/sp/pnpjs-presets";
import IObiraDatasource from "./IObiraDatasource";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/webs";

export default class ObiraDataSource implements IObiraDatasource<Obira> {
  private _sp: SPFI;
  public listTitle: string;
  private selectProperties: Array<string>;
  private expand: Array<string>;
  constructor(
    listTitle: string,
    properties?: Array<string>,
    expand?: Array<string>
  ) {
    this._sp = getSP();
    this.listTitle = listTitle;
    this.selectProperties = [
      "Id",
      "Title",
      "AccionInmediata",
      "Bloque/Id",
      "Bloque/AREA",
      "Created",
      "Detalle",
      "Equipo/Id",
      "Equipo/Title",
      "Etapa",
      "EstadoGeneral",
      "FechaDeOcurrenciaDelProblema",
      "FechaDeRepeticionDelProblema",
      "Modified",
      "PADLocacion/Id",
      "PADLocacion/Title",
      "Proveedor",
      "QTY",
      "SubKPIAfectado/Id",
      "SubKPIAfectado/Title",
      "TipoDeProblema",
      "TipoObira",
      "TituloDelProblema",
      "Unidad",
      "var_Problema",
      "VerOEditar",
      "LinkAlPlan",
      "Author/Title",
      "Author/EMail",
      "Attachments",
      "AttachmentFiles",
      "Etiquetas/Id",
      "Etiquetas/Title",
      "tieneAccionDefinitiva",
      "tieneGestionAnormalidad",
      "Activo",
      "CausaRaizPreliminar",
      "ResponsableItemId",
      "ResponsableItem/Title",
      "ResponsableItem/EMail",
      "ResponsableItem/Id",
      "FechaCierre",
    ];
    this.expand = [
      "Author",
      "Equipo",
      "Bloque",
      "PADLocacion",
      "SubKPIAfectado",
      "AttachmentFiles",
      "Etiquetas",
      "ResponsableItem"
    ];
  }

  public async getCount(): Promise<number> {
    try {
      const items = await this._sp.web.lists
        .getByTitle(this.listTitle)
        .items
        .select("Id").top(5000)();
      return items.length;
    } catch (error) {
      console.error(`Error al obtener el conteo de  ${this.listTitle}:`, error);
      return 0;
    }
  }



  public async getItems(): Promise<Array<Obira>> {
    try {
      const items: any[] = await this._sp.web.lists
        .getByTitle(this.listTitle)
        .items
        .select(...this.selectProperties)
        .expand(...this.expand)
        .top(5000)();

      return items.map((item) => new Obira(item));
    } catch (error) {
      console.error(`Error al obtener items de ${this.listTitle}:`, error);
      return [];
    }
  }


  public async add(item: Partial<Obira>): Promise<Obira> {
    try {
      const result = await this._sp.web.lists
        .getByTitle(this.listTitle)
        .items.add(item);

      const id = result.ID || result.Id;
      return await this.getById(id);
    } catch (error) {
      console.error("Error adding item to list:", error);
      throw error;
    }
  }

  public async edit(item: Partial<Obira>): Promise<Obira> {
    try {
      if (!item.Id) {
        throw new Error("Item ID is required for editing");
      }

      await this._sp.web.lists
        .getByTitle(this.listTitle)
        .items.getById(item.Id)
        .update(item);

      return this.getById(item.Id);
    } catch (error) {
      console.error("Error updating item in list:", error);
      throw error;
    }
  }

  public async delete(itemId: number): Promise<void> {
    await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(itemId)
      .delete();
  }

  public async getById(itemId: number): Promise<Obira> {
    const item = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(itemId)
      .select(...this.selectProperties)
      .expand(...this.expand)();
    return new Obira(item);
  }

  public async getFilteredItems(filter: string): Promise<Array<Obira>> {
    try {
      const items: any[] = await this._sp.web.lists
        .getByTitle(this.listTitle)
        .items.filter(filter)
        .select(...this.selectProperties)
        .expand(...this.expand)
        .top(5000)();
      return items.map((item) => new Obira(item));
    } catch (e: unknown) {
      console.error("Error: ", e);
      return [];
    }
  }

  public async getByProvider(): Promise<Array<Obira>> {
    return this.getItems();
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
  public async addMultiple(files: File[], itemId: number): Promise<File[]> {
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

  public async getAttachmentSizeByUrl(url: string): Promise<number> {
    try {
      const response = await fetch(url, { method: "HEAD", credentials: "same-origin" });
      if (!response.ok) return -1;
      const contentLength = response.headers.get("Content-Length");
      return contentLength ? parseInt(contentLength, 10) : -1;
    } catch {
      return -1;
    }
  }
}
