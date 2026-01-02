import { Accion } from "../../../core";
import AccionDatasource from "../../../core/api/Accion/AccionDatasource";
import { IAcciones } from "../components/Formulario/IFormulario";
import moment from 'moment';

export const uploadAccion = async (acciones: IAcciones[], listTitle: string, obiraId: number): Promise<{ added: any[], updated: any[], deleted: number[] }> => {
    const accionDatasource = new AccionDatasource(listTitle);

    const accionesToAdd = acciones.filter(accion => accion.added && !accion.deleted).map(action => new Accion({
        ...action,
        ObirasId: obiraId,
        FechaImplementacion: action.FechaImplementacion ? moment(action.FechaImplementacion).toISOString() : null,
        FechaCierre: action.FechaCierre ? moment(action.FechaCierre).toISOString() : null,
        FechaFin: action.FechaFin ? moment(action.FechaFin).toISOString() : null,
    }));
    const accionesToUpdate = acciones.filter(accion => accion.modified && !accion.deleted && !accion.added).map(action => new Accion(action));
    const accionesToDelete = acciones.filter(accion => !accion.added && accion.deleted).map(action => action.Id);

    let addedResult: any[] = [];
    let updatedResult: any[] = [];

    if (accionesToAdd.length > 0) {
        addedResult = await accionDatasource.addMultiple(accionesToAdd);
    }

    if (accionesToDelete.length > 0) {
        await accionDatasource.deleteMultiple(accionesToDelete);
    }

    if (accionesToUpdate.length > 0) {
        updatedResult = await accionDatasource.editMultiple(accionesToUpdate);
    }

    return {
        added: addedResult,
        updated: updatedResult,
        deleted: accionesToDelete
    };
}

export const uploadFilesAccion = async (acciones: IAcciones[], listTitle: string): Promise<void> => {
    const accionDatasource = new AccionDatasource(listTitle);
    for (let item of acciones) {

        let filesToAdd: File[] = [];
        let filesToDelete: string[] = [];

        if (item.Files.length > 0) {
            item.Files.forEach(file => {
                if (file.added && !file.deleted) {
                    filesToAdd.push(file.file);
                }
                if (!file.added && file.deleted) {
                    filesToDelete.push(file.file.name);
                }
            });
        }

        if (filesToAdd.length > 0) {
            await accionDatasource.addMultipleFiles(filesToAdd, item.Id);
        }
        if (filesToDelete.length > 0) {
            await accionDatasource.deleteMultipleFiles(filesToDelete, item.Id);
        }
    }
}

// Devuelve un objeto { [obiraId]: true } para los ObiraIds que tienen al menos una acción
export const getAccionesPorObiraIds = async (obiraIds: number[], listTitle?: string): Promise<Record<number, boolean>> => {
    const accionDatasource = new AccionDatasource(listTitle);
    const items = await accionDatasource.getActionsByObiraIds(obiraIds);
    const result: Record<number, boolean> = {};
    items.forEach((item: any) => {
        const obiraId = item.ObirasId;
        if (obiraId && obiraIds.includes(obiraId)) {
            result[obiraId] = true;
        }
    });
    return result;
};

// Devuelve todas las acciones para los ObiraIds dados (para exportar a Excel)
export const getAccionesPorObiraIdsFull = async (obiraIds: number[], listTitle?: string): Promise<Accion[]> => {
    const accionDatasource = new AccionDatasource(listTitle);
    return await accionDatasource.getActionsByObiraIds(obiraIds);
};