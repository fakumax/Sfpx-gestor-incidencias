import { getSP } from "../../../core/pnp/sp/pnpjs-presets";
import { DateTimeFieldFormatType, FieldTypes } from "@pnp/sp/fields";
import { Field } from "../components/Formulario/IFormulario";
import { PermissionLevels } from "../../../core/utils/Constants";
import "@pnp/sp/views"
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import { IFolder, IFolderInfo } from "@pnp/sp/folders";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export const createGroup = async (groupName: string, permissionLevel: string): Promise<void> => {

    const _sp = getSP();

    try {
        const group = await _sp.web.siteGroups.add({
            Title: groupName,
        });
        const roleAssignments = await _sp.web.roleDefinitions.getByName(permissionLevel)();
        await _sp.web.roleAssignments.add(
            group.Id,
            roleAssignments.Id
        );
    } catch (error) {
        console.error(`Error al crear el grupo '${groupName}':`, error);
        throw error;
    }
}

export const createCustomList = async (listName: string, fields: Field[], setMessage: (message: string) => void): Promise<void> => {

    const _sp = getSP();

    try {
        await _sp.web.lists.add(listName, listName, 100, false);
        setMessage(`Lista '${listName}' creada exitosamente.`);

        const list = _sp.web.lists.getByTitle(listName);
        const defaultView = await list.defaultView();

        for (const field of fields) {

            let fieldXml: string;

            if (field.internalName === "Title") {
                await list.fields.getByInternalNameOrTitle("Title").update({
                    Title: field.title
                });
                setMessage(`Campo 'Title' actualizado a '${field.title}'.`);
                continue;
            }

            switch (field.type) {
                case FieldTypes.Choice:
                    fieldXml = `<Field Hidden="FALSE" ShowInEditForm="TRUE" ShowInNewForm="TRUE" ShowInViewForms="TRUE" ShowInDisplayForm="TRUE" Type="Choice" Name="${field.internalName}" DisplayName="${field.internalName}" Required="${field.required || false}" Format="Dropdown">
                          <CHOICES>
                            ${field.choices.map((choice: string) => `<CHOICE>${choice}</CHOICE>`).join('')}
                          </CHOICES>
                        </Field>`;
                    break;

                case FieldTypes.Note:
                    fieldXml = `<Field Hidden="FALSE" ShowInEditForm="TRUE" ShowInNewForm="TRUE" ShowInViewForms="TRUE" ShowInDisplayForm="TRUE" Type="Note" Name="${field.internalName}" DisplayName="${field.internalName}" RichText="${field.richText || false}" NumLines="${field.numberOfLines || 6}" />`;
                    break;

                case FieldTypes.DateTime:
                    fieldXml = `<Field Hidden="FALSE" ShowInEditForm="TRUE" ShowInNewForm="TRUE" ShowInViewForms="TRUE" ShowInDisplayForm="TRUE" Type="DateTime" Name="${field.internalName}" DisplayName="${field.internalName}" Format="DateOnly" />`;
                    break;

                case FieldTypes.Number:
                    fieldXml = `<Field Hidden="FALSE" ShowInEditForm="TRUE" ShowInNewForm="TRUE" ShowInViewForms="TRUE" ShowInDisplayForm="TRUE" Type="Number" Name="${field.internalName}" DisplayName="${field.internalName}" Decimals="${field.decimalPlaces || 0}"/>`;
                    break;

                case FieldTypes.Text:
                    fieldXml = `<Field Hidden="FALSE" ShowInEditForm="TRUE" ShowInNewForm="TRUE" ShowInViewForms="TRUE" ShowInDisplayForm="TRUE" Type="Text" Name="${field.internalName}" DisplayName="${field.internalName}" DefaultValue="${field.defaultValue || ""}" />`;
                    break;

                case FieldTypes.Lookup:

                    const locacionesList = await _sp.web.lists.getByTitle(field.lookupList).select("Id")();
                    const multAttr = field.AllowMultipleValues ? ' Mult="TRUE"' : '';
                    fieldXml = `<Field Type="Lookup" Name="${field.internalName}" DisplayName="${field.internalName}" List="{${locacionesList.Id}}" ShowField="${field.lookupField}" StaticName="${field.internalName}"${multAttr} />`;
                    break;

                case FieldTypes.Calculated:
                    fieldXml = `<Field Hidden="FALSE" ShowInEditForm="FALSE" ShowInNewForm="FALSE" ShowInViewForms="TRUE" ShowInDisplayForm="TRUE" Type="Calculated" Name="${field.internalName}" DisplayName="${field.internalName}" ResultType="${field.resultType || 'Text'}" ReadOnly="TRUE">
                            <Formula>${field.formula}</Formula>
                            ${field.fieldRefs && field.fieldRefs.length > 0 ? `
                            <FieldRefs>
                              ${field.fieldRefs.map((ref: string) => `<FieldRef Name="${ref}" />`).join('')}
                            </FieldRefs>` : ''}
                          </Field>`;
                    break;

                case FieldTypes.Boolean:
                    fieldXml = `<Field Hidden="FALSE" ShowInEditForm="TRUE" ShowInNewForm="TRUE" ShowInViewForms="TRUE" ShowInDisplayForm="TRUE" Type="Boolean" Name="${field.internalName}" DisplayName="${field.internalName}" />`;
                    break;

                case FieldTypes.User:
                    fieldXml = `<Field Hidden="FALSE" ShowInEditForm="TRUE" ShowInNewForm="TRUE" ShowInViewForms="TRUE" ShowInDisplayForm="TRUE" Type="User" Name="${field.internalName}" DisplayName="${field.internalName}" Mult="${field.isMultiple ? 'TRUE' : 'FALSE'}" UserSelectionMode="${field.allowGroups ? 'PeopleAndGroups' : 'PeopleOnly'}" UserSelectionScope="${field.selectionScope || 0}" />`;
                    break;

                default:
                    console.warn(`Tipo de campo '${field.type}' no soportado.`);
                    continue;
            }

            await list.fields.createFieldAsXml(fieldXml);
            setMessage(`Campo creado con InternalName '${field.internalName}'.`);

            const fieldToUpdate = list.fields.getByInternalNameOrTitle(field.internalName);
            if (field.title !== field.internalName) {
                await fieldToUpdate.update({ Title: field.title });
            }

            setMessage(`Campo actualizado con DisplayName '${field.title}'.`);



            await list.views.getById(defaultView.Id).fields.add(field.internalName);
            setMessage(`Campo '${field.internalName}' agregado a la vista 'Todos los elementos'.`);
        }
    } catch (error) {
        console.error(`Error al crear la lista '${listName}' o agregar campos:`, error);
        throw error;
    }
}

export const addFile = async (file: File, itemId: number, listTitle: string): Promise<File> => {

    const _sp = getSP();

    try {
        const item = await _sp.web.lists.getByTitle(listTitle).items.getById(itemId);

        if (!item.attachmentFiles) {
            throw new Error("Verificar la configuración de la lista.");
        }

        const fileContent = await file.arrayBuffer();
        await item.attachmentFiles.add(file.name, fileContent);

        return file;

    } catch (error) {
        console.error("Error al subir los archivos:", error);
        throw new Error("Error en la carga de archivos.");
    }
}

export const breakInheritanceAndAssignPermissions = async (
    listTitle: string,
    groupPermissions: { groupName: string; permissionLevel: string }[],
    setMessage: (message: string) => void
): Promise<void> => {
    const _sp = getSP();

    try {
        const list = _sp.web.lists.getByTitle(listTitle);

        await list.breakRoleInheritance(false);

        for (const { groupName, permissionLevel } of groupPermissions) {
            const group = await _sp.web.siteGroups.getByName(groupName)();
            const roleDefinition = await _sp.web.roleDefinitions.getByName(permissionLevel)();
            await list.roleAssignments.add(group.Id, roleDefinition.Id);
        }

        const currentUser = await _sp.web.currentUser();
        const fullControlRoleDefinition = await _sp.web.roleDefinitions.getByName(PermissionLevels.ControlTotal)();
        await list.roleAssignments.remove(currentUser.Id, fullControlRoleDefinition.Id);

        setMessage(`Permisos asignados correctamente a la lista '${listTitle}'.`);
    } catch (error) {
        console.error(`Error al romper la herencia o asignar permisos en la lista '${listTitle}':`, error);
        throw error;
    }
};

export const breakInheritanceAndAssignRolesToFolder = async (
    librayInternalName: string,
    libraryName: string,
    folderName: string,
    groupPermissions: { groupName: string; permissionLevel: string }[],
    setMessage: (message: string) => void,
): Promise<void> => {

    const _sp = getSP();
    const folderPath = `${librayInternalName}/${folderName}`;

    try {

        const folder = _sp.web.getFolderByServerRelativePath(folderPath);

        const listItem = await folder.listItemAllFields();

        await _sp.web.lists.getByTitle(libraryName).items.getById(listItem.Id).breakRoleInheritance(false);

        const folderItem = await _sp.web.lists.getByTitle(libraryName).items.getById(listItem.Id);
        setMessage(`Herencia de permisos rota para la carpeta: ${folderPath}`);

        for (const { groupName, permissionLevel } of groupPermissions) {

            const principal = await _sp.web.siteGroups.getByName(groupName)().catch(() =>
                _sp.web.ensureUser(groupName).then((res) => res)
            );

            const roleDefinition = await _sp.web.roleDefinitions.getByName(permissionLevel)();

            await folderItem.roleAssignments.add(principal.Id, roleDefinition.Id);
            setMessage(`Permisos asignados al grupo '${groupName}' con nivel de permiso '${permissionLevel}' en la carpeta: ${folderPath}`);
        }
        const currentUser = await _sp.web.currentUser();
        const fullControlRoleDefinition = await _sp.web.roleDefinitions.getByName(PermissionLevels.ControlTotal)();
        await folderItem.roleAssignments.remove(currentUser.Id, fullControlRoleDefinition.Id);

        setMessage(`Permisos asignados correctamente a la carpeta: ${folderPath}`);
    } catch (error) {
        console.error(`Error al romper la herencia o asignar roles a la carpeta: ${folderPath}`, error);
        throw new Error("No se pudo completar la operación. Verifica los parámetros y permisos.");
    }
};



export const createFolderInLibrary = async (
    libraryInternalName: string,
    folderName: string,
    setMessage: (message: string) => void
): Promise<IFolderInfo> => {
    const _sp = getSP();

    try {
        const url = `${libraryInternalName}/${folderName}`;

        const folderAddResult = await _sp.web.folders.addUsingPath(url);

        setMessage(`Carpeta '${folderName}' creada exitosamente en la biblioteca '${libraryInternalName}'.`);

        return folderAddResult;
    } catch (error) {
        console.error(`Error al crear la carpeta '${folderName}' en la biblioteca '${libraryInternalName}':`, error);
        throw new Error("No se pudo crear la carpeta. Verifique los permisos o el nombre de la biblioteca.");
    }
};