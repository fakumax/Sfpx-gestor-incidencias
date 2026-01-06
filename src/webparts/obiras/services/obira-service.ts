import { createObiraDataSource } from "../../../core/api/factory";
import { IFileAdd } from "../components/Formulario/Formulario";

export const uploadFilesObira = async (files: IFileAdd[], listTitle: string, obiraId: number): Promise<void> => {
    const obiraDtasource = createObiraDataSource(listTitle);

    let filesToAdd: File[] = [];
    let filesToDelete: string[] = [];

    for (let item of files) {

        if (item.added && !item.deleted) {
            filesToAdd.push(item.file);
        }
        if (!item.added && item.deleted) {
            filesToDelete.push(item.file.name);
        }
    }

    if (filesToAdd.length > 0) {
        await obiraDtasource.addMultiple(filesToAdd, obiraId);
    }
    if (filesToDelete.length > 0) {
        await obiraDtasource.deleteMultipleFiles(filesToDelete, obiraId);
    }

}