import { GestionAnormalidad } from "../../../core";
import { GestionAnormalidadDataSource } from "../../../core/api/GestionAnormalidad/GestionAnormalidadDataSource";
import { IFileAdd } from "../components/Formulario/Formulario";
import { IAnormalidades } from "../components/Formulario/IFormulario";

export const uploadAnormalidad = async (anormalidades: IAnormalidades[], listTitle: string, obiraId: number): Promise<{ added: IAnormalidades[], updated: IAnormalidades[], deleted: number[] }> => {
    const anormalidadDatasource = new GestionAnormalidadDataSource(listTitle);

    const anormalidadesToAdd = anormalidades.filter(anormalidad => anormalidad.added && !anormalidad.deleted);
    const anormalidadesToUpdate = anormalidades.filter(anormalidad => anormalidad.modified && !anormalidad.deleted && !anormalidad.added);
    const anormalidadesToDelete = anormalidades.filter(anormalidad => !anormalidad.added && anormalidad.deleted).map(anormalidad => anormalidad.Id);

    let addedResult: IAnormalidades[] = [];
    let updatedResult: IAnormalidades[] = [];

    if (anormalidadesToAdd.length > 0) {
        const anormalidadesParaAgregar = anormalidadesToAdd.map(anormalidad => new GestionAnormalidad({
            ...anormalidad,
            ObirasId: obiraId,
        }));
        const added = await anormalidadDatasource.addMultiple(anormalidadesParaAgregar);
        addedResult = added.map((item, index) => ({
            ...anormalidadesToAdd[index],
            Id: item.Id,
            modified: false,
            added: true,
            deleted: false
        }));
    }

    if (anormalidadesToDelete.length > 0) {
        await anormalidadDatasource.deleteMultiple(anormalidadesToDelete);
    }

    if (anormalidadesToUpdate.length > 0) {
        const anormalidadesParaActualizar = anormalidadesToUpdate.map(anormalidad => new GestionAnormalidad({
            ...anormalidad,
            ObirasId: obiraId,
        }));
        const updated = await anormalidadDatasource.editMultiple(anormalidadesParaActualizar);
        updatedResult = updated.map((item, index) => ({
            ...anormalidadesToUpdate[index],
            modified: true,
            added: false,
            deleted: false
        }));
    }

    return {
        added: addedResult,
        updated: updatedResult,
        deleted: anormalidadesToDelete
    };
}

export const uploadFilesAnormalidad = async (anormalidades: IAnormalidades[], listTitle: string): Promise<void> => {
    const anormalidadDatasource = new GestionAnormalidadDataSource(listTitle);

    await Promise.all(anormalidades.map(async (item) => {
        if (!item.Files?.length) {
            console.log('[uploadFilesAnormalidad] Sin archivos para procesar:', item);
            return;
        }
        if (!item.Id) {
            console.error('[uploadFilesAnormalidad] No se encontró Id para la anormalidad, no se pueden subir adjuntos:', item);
            return;
        }
        const filesToAdd = item.Files.filter(file => file.added && !file.deleted).map(f => f.file);
        const filesToDelete = item.Files.filter(file => file.deleted && !file.added && file.ServerRelativeUrl)
            .map(f => {
                const parts = f.ServerRelativeUrl.split('/');
                return parts[parts.length - 1];
            });

        if (filesToDelete.length > 0) {
            await anormalidadDatasource.deleteMultipleFiles(filesToDelete, item.Id);
            console.log('[uploadFilesAnormalidad] Archivos eliminados:', filesToDelete, 'de anormalidad Id', item.Id);
        }

        if (filesToAdd.length > 0) {
            await anormalidadDatasource.addMultipleFiles(filesToAdd, item.Id);
            console.log('[uploadFilesAnormalidad] Archivos subidos:', filesToAdd.map(f => f.name), 'a anormalidad Id', item.Id);
        }
    }));
}

export const getAnormalidadesPorObiraIds = async (obiraIds: number[], listTitle?: string): Promise<Record<number, boolean>> => {
    const anormalidadDatasource = new GestionAnormalidadDataSource(listTitle);
    const items = await anormalidadDatasource.getAbnormalitiesByObiraIds(obiraIds);
    const result: Record<number, boolean> = {};
    items.forEach((item: any) => {
        const obiraId = item.IDObiraId;
        if (obiraId && obiraIds.includes(obiraId)) {
            result[obiraId] = true;
        }
    });
    return result;
};

export const getAnormalidadesPorObiraIdsFull = async (obiraIds: number[], listTitle?: string): Promise<GestionAnormalidad[]> => {
    const anormalidadDatasource = new GestionAnormalidadDataSource(listTitle);
    return await anormalidadDatasource.getAbnormalitiesByObiraIds(obiraIds);
};