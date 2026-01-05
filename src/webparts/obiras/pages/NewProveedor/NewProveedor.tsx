import * as React from "react";
import { BackButton } from "../../../../core/ui/components/buttons/BackButton";
import headerStyles from "../../components/Formulario/FormAdd/FormAdd.module.scss";
import { useNavigate } from "react-router-dom";
import FilesComponent from "../../components/Files/FilesComponent";
import { IFileAdd } from "../../components/Formulario/Formulario";
import {
  Checkbox,
  IPersonaProps,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  Stack,
  TextField,
  getTheme,
} from "@fluentui/react";
import styles from "./NewProveedor.module.scss";
import ProveedorDatasource from "../../../../core/api/Proveedor/ProveedorDatasource";
import { Lista, PermissionLevels, Roles } from "../../../../core/utils/Constants";
import { CustomButton } from "../../../../core/ui/components/buttons/CustomButton";
import PopupDeAcciones from "../../components/Formulario/helpers/PopupDeAcciones";
import { Accion } from "../../../../core/utils/Constants";
import { Text, ITextProps } from "@fluentui/react/lib/Text";
import { MessageTypes, useMessage } from "../../../../core/context/MessageContext";
import { set } from "lodash";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import User from "../../../../core/entities/User";
import { ListaAsociada, Proveedor } from "../../../../core";
import { DateTimeFieldFormatType, FieldTypes } from "@pnp/sp/fields";
import {
  addFile,
  breakInheritanceAndAssignPermissions,
  breakInheritanceAndAssignRolesToFolder,
  createCustomList,
  createFolderInLibrary,
  createGroup,
} from "../../services/proveedor-service";
import { Field } from "../../components/Formulario/IFormulario";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useEffect, useState } from "react";
import ModalComponent from "../../components/ModalComponent/ModalComponent";

interface INewProveedorProps {
  context: WebPartContext;
}

interface IPeoplePickerContext {
  absoluteUrl: string;
  msGraphClientFactory: any;
  spHttpClient: any;
}

const NewProveedor: React.FC<INewProveedorProps> = (props) => {
  const navigate = useNavigate();

  const theme = getTheme();

  const { setMessage } = useMessage();

  const proveedorDatasource = new ProveedorDatasource(Lista.Proveedores);

  const peoplePickerContext: IPeoplePickerContext = {
    absoluteUrl: props.context.pageContext.web.absoluteUrl,
    msGraphClientFactory: props.context.msGraphClientFactory,
    spHttpClient: props.context.spHttpClient,
  };

  const [proveedor, setProveedor] = React.useState<string>("");
  const [errorProveedor, setErrorProveedor] = React.useState<string>("");

  const [correspondeResponsable, setCorrespondeResponsable] = useState(false);
  const [responsable, setResponsable] = React.useState<User>(null);
  const [errorResponsable, setErrorResponsable] = React.useState<string>("");
  const [jefe, setJefe] = React.useState<User>(null);

  const [files, setFiles] = React.useState<IFileAdd[]>([]);
  const [errorFiles, setErrorFiles] = React.useState<string>("");

  const [isVisible, setIsVisible] = React.useState(false);
  const [isVisibleLog, setIsVisibleLog] = React.useState(false);

  const [logMessage, setLogMessage] = React.useState<string>("");

  const options = {
    maxFiles: 1,
    maxFileSize: 5 * 1024 * 1024,
    allowedFormats: ["image/jpeg", "image/png", "image/jpg"],
  };

  const [fieldsObiras, setFieldsObiras] = useState([]);
  const [fieldsAcciones, setFieldsAcciones] = useState([]);
  const [fieldsAnormalidades, setFieldsAnormalidades] = useState([]);

  useEffect(() => {
    if (!correspondeResponsable) {
      setResponsable(null);
      setJefe(null);
    }
  }, [correspondeResponsable]);

  useEffect(() => {
    const fieldsObiras: Field[] = [
      {
        internalName: "Activo",
        title: "Activo",
        type: FieldTypes.Boolean,
      },
      {
        internalName: "AccionInmediata",
        title: "Acción Inmediata",
        type: FieldTypes.Note,
        richText: false,
        numberOfLines: 6,
        required: false,
      },
      {
        internalName: "Bloque",
        title: "Bloque",
        type: FieldTypes.Lookup,
        lookupList: "Locaciones",
        lookupField: "AREA",
      },
      {
        internalName: "Detalle",
        title: "Detalle",
        type: FieldTypes.Note,
        richText: false,
        numberOfLines: 6,
      },
      {
        internalName: "Equipo",
        title: "Equipo",
        type: FieldTypes.Lookup,
        lookupList: "Equipos",
        lookupField: "Title",
      },
      {
        internalName: "Etiquetas",
        title: "Etiquetas",
        type: FieldTypes.Lookup,
        lookupList: "Etiquetas",
        lookupField: "Title",
        AllowMultipleValues: true,
      },
      {
        internalName: "Etapa",
        title: "Etapa",
        type: FieldTypes.Choice,
        choices: [
          "Conexión de Pozos - E40",
          "Construcción de Locación - E10",
          "DTM + Saneamiento - E20",
          "DTM Fractura - E30",
          "Fractura - E30",
          "Perforación - E20",
          "Post-Fractura - E30",
          "Inicio Prod - E40",
          "Pre-Fractura - E30",
        ],
        required: false,
      },
      {
        internalName: "FechaDeOcurrenciaDelProblema",
        title: "Fecha de ocurrencia del problema",
        type: FieldTypes.DateTime,
        displayFormat: DateTimeFieldFormatType.DateOnly,
      },
      {
        internalName: "FechaCierre",
        title: "Fecha Cierre",
        type: FieldTypes.DateTime,
        displayFormat: DateTimeFieldFormatType.DateTime,
        required: false,
      },
      {
        internalName: "FechaDeRepeticionDelProblema",
        title: "Fechas de repetición del problema",
        type: FieldTypes.Note,
        richText: false,
        numberOfLines: 6,
        required: false,
      },
      {
        internalName: "CausaRaizPreliminar",
        title: "Causa raíz preliminar",
        type: FieldTypes.Note,
        richText: false,
        numberOfLines: 6,
        required: false,
      },
      {
        internalName: "LinkAlPlan",
        title: "Link al plan",
        type: FieldTypes.Note,
        richText: false,
        numberOfLines: 6,
      },
      {
        internalName: "PADLocacion",
        title: "PAD",
        type: FieldTypes.Lookup,
        lookupList: "Locaciones",
        lookupField: "Title",
      },
      {
        internalName: "Proveedor",
        title: "Proveedor",
        type: FieldTypes.Text,
        defaultValue: proveedor,
      },
      {
        internalName: "QTY",
        title: "QTY",
        type: FieldTypes.Number,
        decimalPlaces: 2,
      },
      {
        internalName: "SubKPIAfectado",
        title: "Sub KPI afectado",
        type: FieldTypes.Lookup,
        lookupList: "Etapas y SUB KPIs",
        lookupField: "Title",
      },
      {
        internalName: "tieneAccionDefinitiva",
        title: "¿Tiene acción definitiva?",
        type: FieldTypes.Boolean,
      },
      {
        internalName: "tieneGestionAnormalidad",
        title: "¿Tiene gestión de anormalidad?",
        type: FieldTypes.Boolean,
      },
      {
        internalName: "TipoDeProblema",
        title: "Tipo de problema",
        type: FieldTypes.Choice,
        choices: ["NPT", "PNE", "Oportunidad de Mejora"],
        required: false,
      },
      {
        internalName: "TituloDelProblema",
        title: "Título del problema",
        type: FieldTypes.Text,
      },
      {
        internalName: "Unidad",
        title: "Unidad",
        type: FieldTypes.Choice,
        choices: ["Días", "Horas", "Litros", "M3", "Otro", "USD"],
        required: false,
      },
      {
        internalName: "EstadoGeneral",
        title: "Estado General",
        type: FieldTypes.Choice,
        choices: [
          "1. Nuevo",
          "2. Causa raíz definida",
          "3. Contramedidas definidas",
          "4. Contramedidas implementadas",
          "5. Cerrado",
          "6. Reincidente",
          "7. No priorizado",
        ],
        required: false,
      },
      {
        type: FieldTypes.Calculated,
        internalName: "TipoObira",
        title: "Tipo Obira",
        formula: "=[Tipo de problema]",
        resultType: "Text",
        fieldRefs: ["Tipo de problema"],
      },
      {
        type: FieldTypes.Calculated,
        internalName: "var_Problema",
        title: "var_Problema",
        formula: '=""',
        resultType: "Text",
      },
      {
        internalName: "VerOEditar",
        title: "Ver o editar",
        type: FieldTypes.Text,
        defaultValue: proveedor,
      },
      {
        internalName: "ResponsableItem",
        title: "Responsable Ítem",
        type: FieldTypes.User,
        isMultiple: true,
        allowGroups: false,
        selectionScope: 0,
      },
    ];
    const fieldsAcciones: Field[] = [
      {
        internalName: "AQueEquipos",
        title: "¿A qué Equipos?",
        type: FieldTypes.Note,
        richText: false,
        numberOfLines: 6,
      },
      {
        internalName: "AplicaYokoten",
        title: "Aplica Transversalización",
        type: FieldTypes.Boolean,
      },
      {
        internalName: "CausaRaiz",
        title: "Causa raíz",
        type: FieldTypes.Note,
        richText: false,
        numberOfLines: 6,
      },
      {
        internalName: "Comentarios",
        title: "Comentarios",
        type: FieldTypes.Note,
        richText: false,
        numberOfLines: 8,
      },
      {
        internalName: "Contramedida",
        title: "Contramedida",
        type: FieldTypes.Note,
        richText: false,
        numberOfLines: 6,
      },
      {
        internalName: "FechaDeCierreLuegoDeSeguimiento",
        title: "Fecha de cierre luego de seguimiento",
        type: FieldTypes.DateTime,
        displayFormat: DateTimeFieldFormatType.DateOnly,
      },
      {
        internalName: "FechaDeImplementacionDeContramed",
        title: "Fecha de implementación de contramedida",
        type: FieldTypes.DateTime,
        displayFormat: DateTimeFieldFormatType.DateOnly,
      },
      {
        internalName: "FechaFinDeLaTransversalizacion",
        title: "Fecha fin de la transversalización",
        type: FieldTypes.DateTime,
        displayFormat: DateTimeFieldFormatType.DateOnly,
      },
      {
        internalName: "IDObira",
        title: "ID Obira",
        type: FieldTypes.Lookup,
        lookupList: `OBIRAS ${proveedor}`,
        lookupField: "ID",
      },
      {
        internalName: "IDObira_x003a_Tipo_x0020_Obira",
        title: "ID Obira:Tipo Obira",
        type: FieldTypes.Lookup,
        lookupList: `OBIRAS ${proveedor}`,
        lookupField: "TipoObira",
      },
      {
        internalName: "IDObira:var_Problema",
        title: "ID Obira:var_Problema",
        type: FieldTypes.Lookup,
        lookupList: `OBIRAS ${proveedor}`,
        lookupField: "var_Problema",
      },
      {
        internalName: "MetodoDeEstandarizacion",
        title: "Método de estandarización",
        type: FieldTypes.Text,
        defaultValue: "",
      },
      {
        internalName: "Responsable",
        title: "Responsable",
        type: FieldTypes.User,
        isMultiple: false,
        allowGroups: false,
        selectionScope: 0,
      },
      {
        internalName: "ResponsableSeguimiento",
        title: "Responsable Seguimiento",
        type: FieldTypes.User,
        isMultiple: false,
        allowGroups: false,
        selectionScope: 0,
      },
      {
        internalName: "StatusAccionDefinitiva",
        title: "Status Acción definitiva",
        type: FieldTypes.Choice,
        choices: [
          "Inicio",
          "Causa raíz definida",
          "CM definida",
          "CM implementada y estandarizada",
          "CM con efectividad confirmada (X pad/tiempo sin recurrencia)",
        ],
        required: false,
      },
      {
        internalName: "StatusYokoten",
        title: "Status Transversalización",
        type: FieldTypes.Choice,
        choices: [
          "Inicio",
          "Método transversalización definido",
          "Implementada y estandarizada",
          "CM con efectividad confirmada",
        ],
        required: false,
      },
      {
        internalName: "TipoDeCausaRaiz",
        title: "Tipo de causa raíz",
        type: FieldTypes.Choice,
        choices: [
          "Administrativo",
          "Calidad",
          "Comunicación",
          "Condición Pozo / Locación",
          "Contractual",
          "Falla Eléctrica",
          "Falla Mecánica",
          "Habilitaciones",
          "Ingeniería",
          "Institucionales",
          "Logística",
          "Mantenimiento",
          "Materiales",
          "Operativo",
          "Personal",
          "Planificación",
          "Seguridad",
          "Sindicales",
        ],
        required: false,
      },
    ];
    const fieldsAnormalidades: Field[] = [
      {
        internalName: "Title",
        title: "Acciones a tomar para minimizar el impacto",
        type: FieldTypes.Text,
        defaultValue: "",
      },
      {
        internalName: "FechaDeFinalizacion",
        title: "Fecha de finalización",
        type: FieldTypes.DateTime,
        displayFormat: DateTimeFieldFormatType.DateOnly,
      },
      {
        internalName: "IDObira",
        title: "ID Obira",
        type: FieldTypes.Lookup,
        lookupList: `OBIRAS ${proveedor}`,
        lookupField: "ID",
      },
      {
        internalName: "Responsable",
        title: "Responsable",
        type: FieldTypes.User,
        isMultiple: false,
        allowGroups: false,
        selectionScope: 0,
      },
      {
        internalName: "ResponsableSeguimiento",
        title: "Responsable Seguimiento",
        type: FieldTypes.User,
        isMultiple: false,
        allowGroups: false,
        selectionScope: 0,
      },
      {
        internalName: "Status",
        title: "Status",
        type: FieldTypes.Choice,
        choices: [
          "Inicio",
          "Problema identificado",
          "Solución al problema identificada",
          "Acción implementada",
          "Problema resuelto",
        ],
        required: false,
      },
      {
        internalName: "Comentarios",
        title: "Comentarios",
        type: FieldTypes.Note,
        richText: false,
        numberOfLines: 6,
        required: false,
      },
    ];

    setFieldsAcciones(fieldsAcciones);
    setFieldsAnormalidades(fieldsAnormalidades);
    setFieldsObiras(fieldsObiras);
  }, [proveedor]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleProveedorFiles = (files: IFileAdd[]) => {
    setFiles(files);
  };

  const handleResponsableChange = (items: IPersonaProps[]) => {
    if (items.length > 0) {
      const selectedUser = items[0];
      setResponsable(new User(selectedUser));
    } else {
      setResponsable(null);
    }
    setErrorResponsable("");
  };

  const handleCreate = async () => {
    setIsVisible(false);

    const listNameAcciones = `Acciones Definitivas ${proveedor}`;
    const listNameAnormalidades = `Gestión de anormalidades ${proveedor}`;
    const listNameObiras = `OBIRAS ${proveedor}`;

    const listaAsociada: ListaAsociada = {
      acciones: listNameAcciones,
      gestiones: listNameAnormalidades,
      obiras: listNameObiras,
    };

    const proveedorData = new Proveedor({
      Title: proveedor,
      Activo: true,
      listaString: listaAsociada,
      Responsable: !correspondeResponsable ? null : new User(responsable),
      Jefe: !correspondeResponsable ? null : new User(jefe),
      Notificacion: correspondeResponsable,
    });

    try {
      setIsVisibleLog(true);

      await createGroup(proveedor, PermissionLevels.Leer);
      const newProvider = await proveedorDatasource.add(proveedorData);

      if (files.length > 0) {
        await addFile(files[0].file, newProvider.Id, Lista.Proveedores);
      }

      setLogMessage(
        `Proveedor ${proveedor} creado correctamente en la lista "Proveedores"`
      );

      await createCustomList(listNameObiras, fieldsObiras, setLogMessage);
      await breakInheritanceAndAssignPermissions(
        listNameObiras,
        [
          {
            groupName: Roles.Administradores,
            permissionLevel: PermissionLevels.Admin_sin_estructura,
          },
          {
            groupName: Roles.Consultores,
            permissionLevel: PermissionLevels.Leer,
          },
          {
            groupName: proveedor,
            permissionLevel: PermissionLevels.Editar,
          },
        ],
        setLogMessage
      );

      await createCustomList(listNameAcciones, fieldsAcciones, setLogMessage);
      await breakInheritanceAndAssignPermissions(
        listNameAcciones,
        [
          {
            groupName: Roles.Administradores,
            permissionLevel: PermissionLevels.Admin_sin_estructura,
          },
          {
            groupName: Roles.Consultores,
            permissionLevel: PermissionLevels.Leer,
          },
          {
            groupName: proveedor,
            permissionLevel: PermissionLevels.Editar,
          },
        ],
        setLogMessage
      );

      await createCustomList(listNameAnormalidades, fieldsAnormalidades, setLogMessage);
      await breakInheritanceAndAssignPermissions(
        listNameAnormalidades,
        [
          {
            groupName: Roles.Administradores,
            permissionLevel: PermissionLevels.Admin_sin_estructura,
          },
          {
            groupName: Roles.Consultores,
            permissionLevel: PermissionLevels.Leer,
          },
          {
            groupName: proveedor,
            permissionLevel: PermissionLevels.Editar,
          },
        ],
        setLogMessage
      );

      await createFolderInLibrary("PlanesDeAccion", proveedor, setLogMessage);
      await breakInheritanceAndAssignRolesToFolder(
        "PlanesDeAccion",
        Lista.PlanesDeAccion,
        proveedor,
        [
          {
            groupName: Roles.Administradores,
            permissionLevel: PermissionLevels.Editar,
          },
          {
            groupName: Roles.Consultores,
            permissionLevel: PermissionLevels.Leer,
          },
          {
            groupName: proveedor,
            permissionLevel: PermissionLevels.Editar,
          },
        ],
        setLogMessage
      );

      setMessage("Se ha creado un proveedor con éxito.", MessageTypes.Success);
    } catch (error) {
      setMessage("Ocurrió un error al crear el proveedor.", MessageTypes.Error);
    } finally {
      setProveedor("");
      setResponsable(null);
      setJefe(null);
      setFiles([]);
      setIsVisibleLog(false);
    }
  };

  const validateForm = () => {
    let isValid = true;
    if (!proveedor) {
      setErrorProveedor("Este es un campo obligatorio.");
      isValid = false;
    }

    const filesToAdd = files.filter((file) => !file.deleted);
    if (filesToAdd.length !== 1) {
      isValid = false;
      setErrorFiles("Este es un campo obligatorio.");
    }

    if (correspondeResponsable && (!responsable || !responsable.Id)) {
      setErrorResponsable("Este es un campo obligatorio.");
      isValid = false;
    }

    if (isValid) {
      setIsVisible(true);
    }
  };

  const mensajeDeErrorProveedor = "Caracter ingresado inválido.";
  const maximaLongitudPermitida = 100; // es la maxima longitud permitida de los internal name en SharePoint

  const handleChange = (_, v) => {
    if (v === undefined) return;

    // 1) quitar todo lo que no sea A-Za-z0-9 o _
    let limpio = v.replace(/[^A-Za-z0-9_]/g, "");

    // 2) limitar a 100 chars
    limpio = limpio.slice(0, maximaLongitudPermitida);

    // 3) reglas: debe empezar con letra/numero, y no permitir '__'
    const empiezaBien = limpio === "" || /^[A-Za-z0-9]/.test(limpio);
    const noTieneDobles = !/__/.test(limpio);

    if (empiezaBien && noTieneDobles) {
      setProveedor(limpio);
      setErrorProveedor("");
    } else {
      setErrorProveedor(mensajeDeErrorProveedor);
    }
  };

  const handleBlur = (e) => {
    const actual = e.currentTarget.value ?? "";

    // si termina en '_', sacar SOLO el ultimo
    const recortado = actual.endsWith("_") ? actual.slice(0, -1) : actual;

    // revalidar una vez confirmado en blur
    const empiezaBien = recortado === "" || /^[A-Za-z0-9]/.test(recortado);
    const noTieneDobles = !/__/.test(recortado);

    if (empiezaBien && noTieneDobles) {
      if (recortado !== proveedor) setProveedor(recortado);
      setErrorProveedor("");
    } else {
      setErrorProveedor(mensajeDeErrorProveedor);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    // misma poda que en blur al presionar Enter
    const actual = e.currentTarget.value ?? "";
    let recortado = actual;
    if (actual.endsWith("_")) {
      recortado = actual.slice(0, -1);
    }
    if (recortado !== proveedor) {
      setErrorProveedor("");
      setProveedor(recortado);
    }
  };

  const colorError = "#af4045";
  const colorNormal = "#605e5c";
  return (
    <>
      <PopupDeAcciones
        accion={Accion.GUARDAR}
        isOpen={isVisible}
        setIsOpen={setIsVisible}
        onDismiss={() => setIsVisible(false)}
        handleConfirmacionAsync={handleCreate}
      />

      <ModalComponent
        isOpen={isVisibleLog}
        onDismiss={() => setIsVisibleLog(false)}
        title="Creación de proveedor"
      >
        <Stack
          tokens={{ childrenGap: "20px" }}
          styles={{
            root: { height: "100%", display: "flex", justifyContent: "center" },
          }}
        >
          <Stack.Item grow>
            <Spinner
              size={SpinnerSize.large}
              label="Por favor, no cierre el navegador ni actualice la página. Creando listas..."
              ariaLive="assertive"
            />
          </Stack.Item>
          <Stack.Item grow>
            <div style={{ width: "100%", height: "60px", overflow: "hidden" }}>
              <Text>{logMessage}</Text>
            </div>
          </Stack.Item>
        </Stack>
      </ModalComponent>
      <div className={headerStyles.header}>
        <BackButton onClick={handleBack} />
        <h1 className={headerStyles.title}>Crear nuevo proveedor</h1>
      </div>
      <Stack horizontal className={styles.container} tokens={{ childrenGap: 20 }}>
        <Stack.Item styles={{ root: {flexBasis: "60%"} }}>
          <TextField
            required
            label="Nombre del proveedor"
            value={proveedor}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Ejemplo: 'SERVICIOS_NORTE'"
            maxLength={maximaLongitudPermitida}
            styles={{
              fieldGroup: {
                border: `1px solid ${errorProveedor ? colorError : colorNormal}`,
                borderRadius: 2,
                boxShadow: "none",
                selectors: {
                  ":hover, :focus-within": {
                    borderColor: errorProveedor ? colorError : colorNormal,
                  },
                },
              },
            }}
          />
          <MessageBar
            messageBarType={MessageBarType.info}
            styles={{
              root: {
                background: "transparent",
                selectors: {
                  ".ms-MessageBar-text": { fontStyle: "italic" },
                },
              },
            }}
          >
            {`Debe usar solo letras (sin tildes ni Ñ) y/o números. No se permiten espacios. Único separador válido entre palabras: guion bajo (_)`}
          </MessageBar>
          {errorProveedor && (
            <span style={{ color: colorError, fontSize: 12 }}>{errorProveedor}</span>
          )}

          <Checkbox
            label="¿Corresponde responsable del Proveedor?"
            boxSide="end"
            checked={correspondeResponsable}
            onChange={(_, checked) => {
              setCorrespondeResponsable(checked);
            }}
            styles={{
              root: {
                marginTop: 12,
              },
            }}
          />

          {correspondeResponsable && (
            <>
              <PeoplePicker
                context={peoplePickerContext}
                ensureUser
                titleText="Responsable"
                personSelectionLimit={1}
                showtooltip={true}
                required={true}
                onChange={(items) => {
                  handleResponsableChange(items as IPersonaProps[]);
                  setErrorResponsable("");
                }}
                principalTypes={[PrincipalType.User]}
                resolveDelay={1000}
                defaultSelectedUsers={responsable ? [responsable.EMail] : []}
                styles={{
                  root: {
                    selectors: {
                      ".ms-BasePicker-text": {
                        border: errorResponsable
                          ? "1px solid " + colorError
                          : "1px solid " + colorNormal,
                        borderRadius: 2,
                        boxShadow: "none",
                      },
                      ".ms-BasePicker-text:hover, .ms-BasePicker-text:focus-within": {
                        borderColor: errorResponsable ? colorError : colorNormal,
                      },
                    },
                  },
                }}
              />
              {errorResponsable && (
                <span style={{ color: colorError, fontSize: 12 }}>
                  {errorResponsable}
                </span>
              )}

              <PeoplePicker
                context={peoplePickerContext}
                ensureUser
                titleText="Jefe"
                personSelectionLimit={1}
                showtooltip={true}
                onChange={(items) => {
                  if (items) {
                    setJefe(new User(items[0]));
                  }
                }}
                principalTypes={[PrincipalType.User]}
                resolveDelay={1000}
                defaultSelectedUsers={jefe ? [jefe.EMail] : []}
              />
            </>
          )}
        </Stack.Item>

        <Stack.Item styles={{ root: {flexBasis: "40%"} }}>
          <FilesComponent
            className={styles.filesComponent}
            files={files}
            setFiles={(files) => {
              handleProveedorFiles(files);
              setErrorFiles("");
            }}
            options={options}
            message="Puede adjuntar un único archivo de hasta 5 MB, en formato JPEG, JPG o PNG."
            errorFiles={errorFiles}
          />
        </Stack.Item>
      </Stack>
      <Stack
        horizontal
        tokens={{ childrenGap: 10 }}
        styles={{
          root: {
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: "10px",
          },
        }}
      >
        <CustomButton text="Cancelar" variant="blueDark" outline onClick={handleBack} />
        <CustomButton text="Guardar" variant="blueDark" onClick={() => validateForm()} />
      </Stack>
    </>
  );
};

export default NewProveedor;
