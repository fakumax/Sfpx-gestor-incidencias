import * as React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Stack,
  TextField,
  DatePicker,
  Label,
  MessageBar,
  MessageBarType,
  DayOfWeek,
  Dropdown,
  IDropdownOption,
  Checkbox,
  IStackTokens,
  IDropdownStyles,
  IPersonaProps,
  Link,
  IconButton,
  TagPicker,
  ITag,
} from "@fluentui/react";
import {
  renderDropdownOptionWithTooltip,
  renderDropdownTitleWithTooltip,
} from "./helpers/helperForm";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { BackButton, CustomButton } from "../../../../core/ui/components";
import {
  Accion as AccionPopup,
  CodigoEmail,
  Lista,
  Roles,
  ETAPAS_CON_EQUIPO,
  ESTADO_GENERAL_CERRADO,
} from "../../../../core/utils/Constants";
import adjuntarIcon from "../../../../core/ui/icons/AdjuntarIcon.svg";
import agregarIcon from "../../../../core/ui/icons/AgregarIcon.svg";
import styles from "./Formulario.module.scss";
import { createObiraDataSource, createEquipoDataSource, createLocacionDataSource, createSubKPIDataSource, createAccionDefinitivaDataSource, createGestionAnormalidadDataSource, createAccionDataSource, createProveedorDataSource, createEtiquetaDataSource } from "../../../../core/api/factory";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import { datePickerStrings, formatDate } from "../../../../core/utils/dateUtils";
import {
  Accion,
  AccionDefinitiva,
  GestionAnormalidad,
  Locacion,
  Obira,
  Proveedor,
} from "../../../../core/entities";
import FilesComponent from "../Files/FilesComponent";
import {
  useItemAccionDatasource,
  useItemEquipoDataSource,
  useItemLocacionDataSource,
  useItemObiraDataSource,
  useItemProveedorDatasource,
  useItemSubKPIDataSource,
  useItemResponsableEtapaDatasource,
} from "../../../../core";
import {
  CustomDropdownOption,
  IAcciones,
  IAnormalidades,
  IErrorsAcciones,
  IErrorsAnormalidades,
  IForm,
  IFormErrors,
} from "./IFormulario";
import moment from "moment";
import useItemGestionAnormalidadDataSource from "../../../../core/api/GestionAnormalidad/useItemGestionAnormalidadDataSource";
import User from "../../../../core/entities/User";
import { useUserContext } from "../../../../core/context/UserContext";
import FilePnp from "../../../../core/entities/FilePnp";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import CustomDropdown from "../../../../core/ui/components/CustomDropdown/CustomDropdown";

import stylesFormadd from "./FormAdd/FormAdd.module.scss";
import { uploadAccion, uploadFilesAccion } from "../../services/accion-service";
import {
  uploadAnormalidad,
  uploadFilesAnormalidad,
} from "../../services/anormalidad-service";
import { uploadFilesObira } from "../../services/obira-service";
import useEmailManager from "../../../../core/api/email/useEmailManager";
import { FechaRepeticionList } from "./FormAdd/FechaRepeticionField";
import {
  emptyErrorAccion,
  emptyErrorAnormalidad,
  validateAcciones,
  validateAnormalidades,
  validateForm,
} from "./helpers/Helpers";
import PopupDeAcciones from "./helpers/PopupDeAcciones";
import { MessageTypes, useMessage } from "../../../../core/context/MessageContext";
export interface IFileAdd {
  id: string;
  file: File;
  ServerRelativeUrl?: string;
  added: boolean;
  deleted: boolean;
}
interface IObirasProps {
  context: any;
}

interface IDropdownOptions {
  etapaOptions: IDropdownOption[];
  bloqueOptions: IDropdownOption[];
  equipoOptions: IDropdownOption[];
  padOptions: IDropdownOption[];
  tipoProblemaOptions: IDropdownOption[];
  unidadOptions: IDropdownOption[];
  estadoGeneralOptions: IDropdownOption[];
  subKPIOptions: IDropdownOption[];
  statusOptions: IDropdownOption[];
  statusAccionDefinitivaOptions: IDropdownOption[];
  tipoCausaRaizOptions: IDropdownOption[];
  statusYokotenOptions: IDropdownOption[];
}

interface IPeoplePickerContext {
  absoluteUrl: string;
  msGraphClientFactory: any;
  spHttpClient: any;
}

const Formulario: React.FC<IObirasProps> = (props) => {
  const [padTags, setPadTags] = React.useState<ITag[]>([]);
  const { setMessage } = useMessage();
  // Hook para responsables de etapa
  const [{ items: responsablesEtapa }, getResponsablesEtapa] =
    useItemResponsableEtapaDatasource(Lista.ResponsableEtapa);

  React.useEffect(() => {
    getResponsablesEtapa();
  }, []);

  const topRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setTimeout(() => {
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: "auto" });
      }
    }, 100);
  }, []);

  const navigate = useNavigate();
  const { proveedorNombre, obiraId } = useParams<{
    proveedorNombre: string;
    obiraId: string;
  }>();
  const proveedorNombreDecodificado = decodeURIComponent(proveedorNombre).replace(
    /-/g,
    " "
  );

  const isProveedorInterno = false;

  const { role, isAdmin, isConsultor, group, listasAsociadas, sendEmailObj, setListasAsociadas } =
    useUserContext();

  const isReadOnly = role === Roles.Consultores;

  const [
    { items: obiras, item: obira, isLoading: isLoadingObira },
    getObiras,
    addObira,
    editObira,
    deleteObira,
    getObiraById,
  ] = useItemObiraDataSource(listasAsociadas.obiras);
  const [
    { items: anormalidades, isLoading: isLoadingAnormalidad },
    getAnormalidades,
    addAnormalidad,
    editAnormalidad,
    deleteAnormalidad,
    getAnormalidadById,
    getAnormalidadesByObira,
  ] = useItemGestionAnormalidadDataSource(listasAsociadas.gestiones);
  const [
    { items: acciones, isLoading: isLoadingAccion },
    getAcciones,
    addAccion,
    editAccion,
    deleteAccion,
    getAccionById,
    ,
    getAccionesByObira,
  ] = useItemAccionDatasource(listasAsociadas.acciones);

  const [{ items: proveedores }, , , , , , , getFilteredProveedores] =
    useItemProveedorDatasource(Lista.Proveedores);

  const [
    { items: equipos, isLoading: isLoadingEquipos },
    getEquipos,
    ,
    ,
    ,
    ,
    getFilteredEquipos,
  ] = useItemEquipoDataSource(Lista.Equipos);
  const [
    { items: locaciones, isLoading: isLoadingLocaciones },
    getLocaciones,
    ,
    ,
    ,
    ,
    getFilteredLocaciones,
  ] = useItemLocacionDataSource(Lista.Locaciones);
  const [
    { items: subKPI, isLoading: isLoadingSubKPI },
    getSubKPI,
    ,
    ,
    ,
    ,
    getFilteredSubKPI,
  ] = useItemSubKPIDataSource(Lista.SubKPIAfectado);

  const proveedorDatasource = createProveedorDataSource(Lista.Proveedores);

  const [{ error: errorEmail }, sendEmail, sendEmailTo] = useEmailManager();

  // PeoplePicker context
  const peoplePickerContext: IPeoplePickerContext = {
    absoluteUrl: props.context.pageContext.web.absoluteUrl,
    msGraphClientFactory: props.context.msGraphClientFactory,
    spHttpClient: props.context.spHttpClient,
  };

  // State
  const [formData, setFormData] = React.useState<IForm>({
    Etapa: "",
    Equipo: {
      Title: "",
      Id: 0,
    },
    Bloque: {
      Title: "",
      Id: 0,
    },
    PAD: {
      Title: "",
      Id: 0,
    },
    FechaOcurrencia: undefined,
    TipoDeProblema: "",
    TituloProblema: "",
    Detalle: "",
    SubKPIAfectado: {
      Title: "",
      Id: 0,
    },
    QTY: undefined,
    Unidad: "",
    EstadoGeneral: "",
    FechaRepeticion: undefined,
    AccionInmediata: "",
    Proveedor: "",
    LinkAlPlan: "",
    Files: [],
    ResponsableItem: [],
  });

  const [errorsForm, setErrorsForm] = React.useState<IFormErrors>({
    Etapa: "",
    Equipo: "",
    Bloque: "",
    PAD: "",
    FechaOcurrencia: "",
    TipoDeProblema: "",
    TituloProblema: "",
    SubKPIAfectado: "",
    QTY: "",
    Unidad: "",
    EstadoGeneral: "",
    FechaRepeticion: "",
    AccionInmediata: "",
    LinkAlPlan: "",
  });

  const [errorsAcciones, setErrorsAcciones] = React.useState<IErrorsAcciones[]>([]);
  const [errorsAnormalidades, setErrorsAnormalidades] = React.useState<
    IErrorsAnormalidades[]
  >([]);

  const [anormalidadesData, setAnormalidadesData] = React.useState<IAnormalidades[]>([]);
  const [accionesData, setAccionesData] = React.useState<IAcciones[]>([]);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [dropdownOptions, setDropdownOptions] = React.useState<IDropdownOptions>({
    etapaOptions: [],
    bloqueOptions: [],
    equipoOptions: [],
    padOptions: [],
    tipoProblemaOptions: [],
    unidadOptions: [],
    estadoGeneralOptions: [],
    subKPIOptions: [],
    statusOptions: [],
    statusAccionDefinitivaOptions: [],
    tipoCausaRaizOptions: [],
    statusYokotenOptions: [],
  });

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const [isValidFechaDeRepeticionDelProblema, setIsValidFechaDeRepeticionDelProblema] =
    React.useState(true);

  const [isPopupDeAccionesOpen, setIsPopupDeAccionesOpen] = React.useState(false);
  const [accionRealizada, setAccionRealizada] = React.useState<AccionPopup>(null);

  const popupVolver = () => {
    if (isConsultor) {
      navigate(`/proveedores/${proveedorNombre}`);
    } else {
      setIsPopupDeAccionesOpen(true);
      setAccionRealizada(AccionPopup.VOLVER);
    }
  };

  const handleBack = () => {
    navigate(`/proveedores/${proveedorNombre}`);
  };

  const popupCancelar = () => {
    setIsPopupDeAccionesOpen(true);
    setAccionRealizada(AccionPopup.CANCELAR);
  };

  const handleCancel = () => {
    navigate(`/proveedores/${proveedorNombre}`);
  };

  const getDestinatariosEtapa = (etapa: string): string[] => {
    if (!etapa || !responsablesEtapa || responsablesEtapa.length === 0) {
      return [];
    }

    const matches = responsablesEtapa.filter((r) => r.Etapa === etapa);
    if (matches.length === 0) {
      return [];
    }

    const destinatarios = matches
      .map((m) => m.Responsable?.EMail)
      .filter((email): email is string => !!email);

    // eliminar duplicados
    return Array.from(new Set(destinatarios));
  };

  const isValidForm = (): boolean => {
    const [errorsForm, isValid] = validateForm(formData);
    setErrorsForm(errorsForm);
    const isValidAllAcciones = isValidAcciones();
    const isValidAllAnormalidades = isValidAnormalidades();

    if (
      isValid &&
      isValidAllAcciones &&
      isValidAllAnormalidades &&
      isValidFechaDeRepeticionDelProblema
    ) {
      return true;
    }
    return false;
  };
  const handleDeleteObira = async () => {
    try {
      // Baja lógica del ítem
      const obiraDataSource = createObiraDataSource(listasAsociadas.obiras);
      const deletedObira = { Id: obira.Id, Activo: false };
      await obiraDataSource.edit(deletedObira);
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setShowDeleteModal(false);
      navigate(`/proveedores/${proveedorNombre}`);
    }
  };

  const handleFieldChange = (fieldName: keyof IForm, value: any) => {
    setErrorsForm((prevErrors) => ({
      ...prevErrors,
      [fieldName]: "",
    }));
    let newValue = value;
    if (fieldName === "ResponsableItem") {
      newValue = Array.isArray(value)
        ? value.map((v) => ({ EMail: v.secondaryText, Id: v.id }))
        : [];
    }
    setFormData((prevData) => ({ ...prevData, [fieldName]: newValue }));
  };

  const handleAddAccionDefinitiva = () => {
    setAccionesData([
      ...accionesData,
      {
        InternalId: accionesData.length,
        Id: 0,
        CausaRaiz: "",
        Contramedida: "",
        TipoCausaRaiz: "",
        Responsable: new User(null),
        ResponsableSeguimiento: new User(null),
        FechaImplementacion: undefined,
        StatusAccionDefinitiva: "",
        MetodosEstandarizacion: "",
        FechaCierre: undefined,
        Transversalizacion: false,
        EquiposQueIntervienen: "",
        FechaFin: undefined,
        StatusTransversalizacion: "",
        Comentarios: "",
        Files: [],
        added: true,
        modified: false,
        deleted: false,
        isNewResponsableSeguimiento: false,
      },
    ]);
    setErrorsAcciones((prev) => [...prev, { ...emptyErrorAccion }]);
  };

  const popupGuardar = async () => {
    if (!isValidForm()) {
      return;
    }

    setIsPopupDeAccionesOpen(true);
    setAccionRealizada(AccionPopup.GUARDAR);
  };

  const handleAccionDefinitivaChange = (
    index: number,
    field: string,
    value: string | IPersonaProps[] | boolean | number | Date
  ) => {
    const updatedAcciones = [...accionesData];
    let accionToChange = updatedAcciones.find((accion) => accion.InternalId === index);
    const copyErrors = [...errorsAcciones];
    let errorToUpdate = copyErrors[index];

    if (Array.isArray(value)) {
      if (field == "ResponsableSeguimiento" && !accionToChange.added) {
        accionToChange.isNewResponsableSeguimiento = true;
      }

      accionToChange[field] = value.length > 0 ? new User(value[0]) : new User(null);
      errorToUpdate[field] = "";
    } else if (field == "Transversalizacion") {
      accionToChange.Transversalizacion = value as boolean;
      accionToChange.EquiposQueIntervienen = "";
      accionToChange.FechaFin = null;
      accionToChange.StatusTransversalizacion = "";
      errorToUpdate.EquiposQueIntervienen = "";
      errorToUpdate.FechaFin = "";
      errorToUpdate.StatusTransversalizacion = "";
    } else if (field === "FechaImplementacion" && value) {
      const fechaImpl = moment(value as Date);
      accionToChange.FechaImplementacion = fechaImpl;
      if (accionToChange.FechaCierre && fechaImpl.isAfter(accionToChange.FechaCierre)) {
        accionToChange.FechaCierre = undefined;
      }
      if (accionToChange.FechaFin && fechaImpl.isAfter(accionToChange.FechaFin)) {
        accionToChange.FechaFin = undefined;
      }
      errorToUpdate[field] = "";
    } else {
      accionToChange[field] = value;
      errorToUpdate[field] = "";
    }

    accionToChange["modified"] = true;

    const errorsToState = copyErrors.map((error, idx) => {
      if (idx === index) {
        return errorToUpdate;
      }
      return error;
    });
    setErrorsAcciones(errorsToState);

    const arrayToState = updatedAcciones.map((accion) => {
      if (accion.InternalId === index) {
        return accionToChange;
      }
      return accion;
    });

    setAccionesData(arrayToState);
  };

  const stackTokens: IStackTokens = { childrenGap: 20 };

  React.useEffect(() => {
    if (group === Roles.Administradores || group === Roles.Consultores) {
      getFilteredProveedores(`Activo eq 1 and Title eq '${proveedorNombreDecodificado}'`);
    }
  }, [group]);

  React.useEffect(() => {
    if (
      listasAsociadas.acciones != "" &&
      listasAsociadas.obiras != "" &&
      listasAsociadas.gestiones != "" &&
      group
    ) {
      const id = parseInt(obiraId);
      getObiraById(id);
      getAnormalidadesByObira(id);
      getAccionesByObira(id);
    }
  }, [listasAsociadas, group]);

  React.useEffect(() => {
    if (proveedores && proveedores.length > 0) {
      const newListasAsociadas = {
        acciones: proveedores[0].ListaAsociada.acciones || "",
        gestiones: proveedores[0].ListaAsociada.gestiones || "",
        obiras: proveedores[0].ListaAsociada.obiras || "",
      };
      setListasAsociadas(newListasAsociadas);
    }
  }, [proveedores]);

  React.useEffect(() => {
    if (obira && obira.Activo === false) {
      navigate("/");
    }
  }, [obira]);

  React.useEffect(() => {
    if (obira) {
      if (obira.Bloque) {
        const bloqueTitle = typeof obira.Bloque === 'object' ? obira.Bloque.Title : obira.Bloque;
        getFilteredLocaciones(`AREA eq '${bloqueTitle}'`);
      }
      if (obira.Etapa) {
        const provider = isAdmin || isConsultor ? proveedorNombreDecodificado : group;
        getFilteredEquipos(`Proveedor/Title eq '${provider}'`);
        getFilteredSubKPI(`Etapa eq '${obira.Etapa}'`);
      }
      setFormData({
        Etapa: obira.Etapa,
        Equipo: obira.Equipo || { Title: "", Id: 0 },
        Bloque: { Title: (obira.Bloque as any)?.AREA || "", Id: obira.Bloque?.Id || 0 },
        PAD: obira.PADLocacion || { Title: "", Id: 0 },
        FechaOcurrencia: obira.FechaDeOcurrenciaDelProblema
          ? moment(obira.FechaDeOcurrenciaDelProblema)
          : null,
        TipoDeProblema: obira.TipoDeProblema,
        TituloProblema: obira.TituloDelProblema,
        Detalle: obira.Detalle,
        SubKPIAfectado: obira.SubKPIAfectado || { Title: "", Id: 0 },
        QTY: obira.QTY,
        Unidad: obira.Unidad,
        EstadoGeneral: obira.EstadoGeneral,
        FechaRepeticion: obira.FechaDeRepeticionDelProblema || "",
        AccionInmediata: obira.AccionInmediata,
        LinkAlPlan: obira.LinkAlPlan,
        Proveedor: obira.Proveedor,
        Files:
          obira.Files.map((file: FilePnp) => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
            file: new File([], file.Name),
            ServerRelativeUrl: file.ServerRelativeUrl,
            added: file.added,
            deleted: file.deleted,
          })) || [],
        Etiquetas: obira.Etiquetas || [],
        CausaRaizPreliminar: obira.CausaRaizPreliminar || "",
        ResponsableItem: obira.ResponsableItem,
      });
    }
  }, [obira]);

  React.useEffect(() => {
    if (formData.PAD && formData.PAD.Id) {
      setFormData((prev) => {
        if (prev.Bloque.Id !== prev.PAD.Id) {
          return {
            ...prev,
            Bloque: {
              Id: prev.PAD.Id,
              Title: prev.Bloque.Title
            }
          };
        }

        return prev;
      });
    }
  }, [formData.PAD?.Id]);

  React.useEffect(() => {
    if (acciones && acciones.length > 0) {
      const formattedActions = acciones.map((accion, index) => ({
        InternalId: index,
        Id: accion.Id,
        CausaRaiz: accion.CausaRaiz,
        Contramedida: accion.Contramedida,
        TipoCausaRaiz: accion.TipoCausaRaiz,
        Responsable: accion.Responsable,
        ResponsableSeguimiento: accion.ResponsableSeguimiento,
        FechaImplementacion: accion.FechaImplementacion
          ? moment(accion.FechaImplementacion)
          : undefined,
        StatusAccionDefinitiva: accion.StatusAccion,
        MetodosEstandarizacion: accion.MetodoEstandarizacion,
        FechaCierre: accion.FechaCierre ? moment(accion.FechaCierre) : undefined,
        Transversalizacion: accion.AplicaTransversalizacion || false,
        EquiposQueIntervienen: accion.AQueEquipos,
        FechaFin: accion.FechaFinTransversalizacion
          ? moment(accion.FechaFinTransversalizacion)
          : undefined,
        StatusTransversalizacion: accion.StatusTransversalizacion,
        Comentarios: accion.Comentarios,
        Files:
          accion.Files.map((file: FilePnp) => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
            file: new File([], file.Name),
            ServerRelativeUrl: file.ServerRelativeUrl,
            added: file.added,
            deleted: file.deleted,
          })) || [],
        added: false,
        modified: false,
        deleted: false,
        isNewResponsableSeguimiento: false,
      }));
      const emptyAccions = formattedActions.map(() => emptyErrorAccion);
      setErrorsAcciones(emptyAccions);
      setAccionesData(formattedActions);
    }
  }, [acciones]);

  React.useEffect(() => {
    if (anormalidades && anormalidades.length > 0) {
      const formattedAnormalidades = anormalidades.map((anormalidad, index) => ({
        InternalId: index,
        Id: anormalidad.Id,
        AccionesATomar: anormalidad.AccionesATomar,
        Responsable: {
          EMail: anormalidad.Responsable?.EMail || "",
          Id: anormalidad.Responsable?.Id || 0,
        },
        FechaRealizacion: anormalidad.FechaDeFinalizacion
          ? moment(anormalidad.FechaDeFinalizacion)
          : undefined,
        Status: anormalidad.Status || "",
        ResponsableSeguimiento: {
          EMail: anormalidad.ResponsableSeguimiento?.EMail || "",
          Id: anormalidad.ResponsableSeguimiento?.Id || 0,
        },
        Comentarios: anormalidad.Comentarios || "",
        Files:
          anormalidad.Files.map((file: FilePnp) => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
            file: new File([], file.Name),
            ServerRelativeUrl: file.ServerRelativeUrl,
            added: file.added,
            deleted: file.deleted,
          })) || [],
        added: false,
        modified: false,
        deleted: false,
        isNewResponsableSeguimiento: false,
      }));
      const emptyAnormalidades = formattedAnormalidades.map(() => emptyErrorAnormalidad);
      setErrorsAnormalidades(emptyAnormalidades);
      setAnormalidadesData(formattedAnormalidades);
    }
  }, [anormalidades]);

  React.useEffect(() => {
    const loadChoiceFields = async () => {
      try {
        if (listasAsociadas.obiras) {
          const obiraDataSource = createObiraDataSource(listasAsociadas.obiras);
          const choiceFields = await obiraDataSource.getChoiceFields();

          setDropdownOptions((prev) => ({
            ...prev,
            etapaOptions:
              choiceFields["Etapa"]?.map((choice) => ({
                key: choice,
                text: choice,
              })) || [],
            tipoProblemaOptions:
              choiceFields["TipoDeProblema"]?.map((choice) => ({
                key: choice,
                text: choice,
              })) || [],
            unidadOptions:
              choiceFields["Unidad"]?.map((choice) => ({
                key: choice,
                text: choice,
              })) || [],
            estadoGeneralOptions:
              choiceFields["EstadoGeneral"]?.map((choice) => ({
                key: choice,
                text: choice,
              })) || [],
          }));
        }
      } catch (error) {
        console.error("Error al cargar los campos choice:", error);
      }
    };

    loadChoiceFields();
  }, [listasAsociadas]);

  React.useEffect(() => {
    if (equipos && equipos.length > 0) {
      setDropdownOptions((prev) => ({
        ...prev,
        equipoOptions: equipos.map((equipo) => ({
          key: equipo.Id,
          text: equipo.Title,
        })),
      }));
    }
  }, [equipos]);

  React.useEffect(() => {
    if (locaciones && locaciones.length > 0) {
      let i: number = 0;
      setDropdownOptions((prev) => ({
        ...prev,
        padOptions: locaciones.map((locacion) => ({
          key: locacion.Id,
          text: locacion.Title,
        })),
      }));
    }
  }, [locaciones]);

  React.useEffect(() => {
    (async () => {
      const LocacionesDataSource = createLocacionDataSource(Lista.Locaciones);
      const locaciones: Locacion[] = await LocacionesDataSource.getItems();
      if (locaciones && locaciones.length > 0) {
        setDropdownOptions((prev) => ({
          ...prev,
          bloqueOptions: locaciones.map((locacion) => ({
            key: locacion.Id,
            text: locacion.AREA,
          })),
        }));
      }
    })();
  }, []);

  React.useEffect(() => {
    if (subKPI && subKPI.length > 0) {
      setDropdownOptions((prev) => ({
        ...prev,
        subKPIOptions: subKPI.map((equipo) => ({
          key: equipo.Id,
          text: equipo.Title,
        })),
      }));
    }
  }, [subKPI]);

  const loadEquipoData = async (etapa: string) => {
    const provider = isAdmin ? proveedorNombreDecodificado : group;
    getFilteredEquipos(`Proveedor/Title eq '${provider}'`);
  };

  const loadLocacionesData = async (bloque: string) => {
    getFilteredLocaciones(`AREA eq '${bloque}'`);
  };

  const loadSubKPIdATA = async (etapa: string) => {
    getFilteredSubKPI(`Etapa eq '${etapa}'`);
  };

  const handleAddAnormalidad = () => {
    setAnormalidadesData([
      ...anormalidadesData,
      {
        InternalId: anormalidadesData.length,
        Id: 0,
        AccionesATomar: "",
        Responsable: { EMail: "", Id: 0 },
        FechaRealizacion: undefined,
        ResponsableSeguimiento: { EMail: "", Id: 0 },
        Status: "",
        Comentarios: "",
        Files: [],
        added: true,
        modified: false,
        deleted: false,
        isNewResponsableSeguimiento: false,
      },
    ]);
    setErrorsAnormalidades((prev) => [...prev, { ...emptyErrorAnormalidad }]);
  };

  const isValidAcciones = (): boolean => {
    let isValidAllAcciones = true;

    if (accionesData.length > 0) {
      let copyAcciones = [...accionesData];
      copyAcciones = copyAcciones.filter((accion) => !accion.deleted);

      const newErrorsAcciones = copyAcciones.map((accion, index) => {
        let [errorsAcciones, isValid] = validateAcciones(accion);

        if (isProveedorInterno) {
          errorsAcciones.ResponsableSeguimiento = "";

          const stillHasError = Object.values(errorsAcciones).some(
            (err) => !!err
          );
          if (!stillHasError) {
            isValid = true;
          }
        }

        if (!isValid) {
          isValidAllAcciones = false;
        }

        return errorsAcciones;
      });

      setErrorsAcciones(newErrorsAcciones);
    }
    return isValidAllAcciones;
  };

  const isValidAnormalidades = (): boolean => {
    let isValidAllAnormalidades = true;
    if (anormalidadesData.length > 0) {
      let copyAnormalidades = [...anormalidadesData];
      copyAnormalidades = copyAnormalidades.filter((anormalidad) => !anormalidad.deleted);

      const newErrorsAnormalidades = copyAnormalidades.map((anormalidad, index) => {
        let [errorsAcciones, isValid] = validateAnormalidades(anormalidad);

        if (isProveedorInterno) {
          errorsAcciones.ResponsableSeguimiento = "";

          const stillHasError = Object.values(errorsAcciones).some(
            (err) => !!err
          );
          if (!stillHasError) {
            isValid = true;
          }
        }

        if (!isValid) {
          isValidAllAnormalidades = false;
        }

        return errorsAcciones;
      });

      setErrorsAnormalidades(newErrorsAnormalidades);
    }
    return isValidAllAnormalidades;
  };

  const getNewResponsableEmail = (elements: IAnormalidades[] | IAcciones[]): string[] => {
    const emailsSet = new Set<string>();
    elements.forEach((element) => {
      if (element.isNewResponsableSeguimiento) {
        if (element.ResponsableSeguimiento?.EMail) {
          emailsSet.add(element.ResponsableSeguimiento.EMail);
        }
        if (element.ResponsableSeguimiento?.email) {
          emailsSet.add(element.ResponsableSeguimiento.email);
        }
      }
      if (element.Responsable?.EMail) {
        emailsSet.add(element.Responsable.EMail);
      }
      if (element.Responsable?.email) {
        emailsSet.add(element.Responsable.email);
      }
    });
    return Array.from(emailsSet).filter((email) => !!email);
  };

  const cleanFiles = <T extends { Files: { added: boolean; deleted: boolean }[] }>(
    items: T[]
  ): T[] => {
    return items.map((item) => ({
      ...item,
      Files: (item.Files || [])
        .filter((file) => !file.deleted)
        .map((file) => ({
          ...file,
          added: false,
          deleted: false,
        })),
    }));
  };

  const cleanFilesObiras = (item: IForm): IForm => {
    let files: IFileAdd[] = [];

    if (item.Files && item.Files.length > 0) {
      item.Files.forEach((file) => {
        if (!file.deleted) {
          files.push({
            ...file,
            added: false,
            deleted: false,
          });
        }
      });
    }
    const itemCleaned: IForm = {
      ...item,
      Files: files,
    };

    return itemCleaned;
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // 0. Eliminar anormalidades y acciones marcadas como deleted
      const anormalidadesEliminadas = anormalidadesData.filter((a) => a.deleted && a.Id);
      const accionesEliminadas = accionesData.filter((a) => a.deleted && a.Id);
      if (anormalidadesEliminadas.length > 0) {
        const gestionAnormalidadDataSource = createGestionAnormalidadDataSource(
          listasAsociadas.gestiones
        );
        for (const anormalidad of anormalidadesEliminadas) {
          await gestionAnormalidadDataSource.delete(anormalidad.Id);
        }
      }
      if (accionesEliminadas.length > 0) {
        const accionDatasource = createAccionDataSource(listasAsociadas.acciones);
        for (const accion of accionesEliminadas) {
          await accionDatasource.delete(accion.Id);
        }
      }

      // 0.1 Eliminar adjuntos marcados como deleted en anormalidades y acciones (SharePoint)
      // ANORMALIDADES
      const anormalidadesConAdjuntosAEliminar = anormalidadesData.filter(
        (a) => !a.deleted && a.Id && a.Files && a.Files.some((f) => f.deleted)
      );
      if (anormalidadesConAdjuntosAEliminar.length > 0) {
        const gestionAnormalidadDataSource = createGestionAnormalidadDataSource(
          listasAsociadas.gestiones
        );
        for (const anormalidad of anormalidadesConAdjuntosAEliminar) {
          const filesToDelete = anormalidad.Files.filter((f) => f.deleted);
          // Usar siempre el nombre real de SharePoint
          const fileNames = filesToDelete
            .map((f) => {
              if (f.ServerRelativeUrl) {
                const parts = f.ServerRelativeUrl.split("/");
                return parts[parts.length - 1];
              }
              return f.file?.name;
            })
            .filter(Boolean);
          if (fileNames.length > 0) {
            await gestionAnormalidadDataSource.deleteMultipleFiles(
              fileNames as string[],
              anormalidad.Id
            );
          }
        }
      }
      // ACCIONES
      const accionesConAdjuntosAEliminar = accionesData.filter(
        (a) => !a.deleted && a.Id && a.Files && a.Files.some((f) => f.deleted)
      );
      if (accionesConAdjuntosAEliminar.length > 0) {
        const accionDatasource = createAccionDataSource(listasAsociadas.acciones);
        for (const accion of accionesConAdjuntosAEliminar) {
          const filesToDelete = accion.Files.filter((f) => f.deleted);
          const fileNames = filesToDelete
            .map((f) => {
              if (f.ServerRelativeUrl) {
                const parts = f.ServerRelativeUrl.split("/");
                return parts[parts.length - 1];
              }
              return f.file?.name;
            })
            .filter(Boolean);
          if (fileNames.length > 0) {
            await accionDatasource.deleteMultipleFiles(fileNames as string[], accion.Id);
          }
        }
      }

      // 1. Guardar nuevas anormalidades y acciones SIN adjuntos
      const anormalidadesNuevas = anormalidadesData.filter((a) => a.added && !a.deleted);
      const accionesNuevas = accionesData.filter((a) => a.added && !a.deleted);

      let anormalidadesIds = [];
      let anormalidadesGuardadas = [];
      if (anormalidadesNuevas.length > 0) {
        const gestionAnormalidadDataSource = createGestionAnormalidadDataSource(
          listasAsociadas.gestiones
        );
        const nuevasAnormalidades = anormalidadesNuevas.map(
          (anormalidad) =>
            new GestionAnormalidad({
              ...anormalidad,
              Files: [],
              ObirasId: obiraId,
            })
        );
        const results = await gestionAnormalidadDataSource.addMultiple(
          nuevasAnormalidades
        );
        for (let i = 0; i < results.length; i++) {
          const original = anormalidadesNuevas[i];
          const saved = results[i];
          const resultWithInternalIdAndFiles = {
            ...saved,
            InternalId: original.InternalId,
            Files: original.Files || [],
          };
          anormalidadesIds.push({
            internalId: original.InternalId,
            id: saved.Id,
          });
          anormalidadesGuardadas.push(resultWithInternalIdAndFiles);
        }
      }

      let accionesIds = [];
      let accionesGuardadas = [];

      const anormalidadesEditadas = anormalidadesData.filter(
        (a) => !a.added && !a.deleted && a.modified
      );
      if (anormalidadesEditadas.length > 0) {
        const gestionAnormalidadDataSource = createGestionAnormalidadDataSource(
          listasAsociadas.gestiones
        );
        const anormalidadesToUpdate = anormalidadesEditadas.map(
          (anormalidad) =>
            new GestionAnormalidad({
              ...anormalidad,
              ObirasId: obiraId,
              Files: [],
            })
        );
        await gestionAnormalidadDataSource.editMultiple(anormalidadesToUpdate);
      }

      const accionesEditadas = accionesData.filter(
        (a) => !a.added && !a.deleted && a.modified
      );
      if (accionesEditadas.length > 0) {
        const accionDatasource = createAccionDataSource(listasAsociadas.acciones);
        const accionesToUpdate = accionesEditadas.map(
          (accion) =>
            new Accion({
              ...accion,
              ObirasId: obiraId,
              Files: [],
              FechaImplementacion: accion.FechaImplementacion
                ? moment(accion.FechaImplementacion).toISOString()
                : null,
              FechaCierre: accion.FechaCierre
                ? moment(accion.FechaCierre).toISOString()
                : null,
              FechaFin: accion.FechaFin ? moment(accion.FechaFin).toISOString() : null,
            })
        );
        await accionDatasource.editMultiple(accionesToUpdate);
      }

      if (accionesNuevas.length > 0) {
        const accionDatasource = createAccionDataSource(listasAsociadas.acciones);
        for (const accion of accionesNuevas) {
          const nueva = new Accion({
            ...accion,
            Files: [],
            ObirasId: obiraId,
            FechaImplementacion: accion.FechaImplementacion
              ? moment(accion.FechaImplementacion).toISOString()
              : null,
            FechaCierre: accion.FechaCierre
              ? moment(accion.FechaCierre).toISOString()
              : null,
            FechaFin: accion.FechaFin ? moment(accion.FechaFin).toISOString() : null,
          });
          const result = await accionDatasource.add(nueva);
          const resultWithInternalId = {
            ...result,
            InternalId: accion.InternalId,
          };
          accionesIds.push({ internalId: accion.InternalId, id: result.Id });
          accionesGuardadas.push(resultWithInternalId);
        }
      }

      for (const saved of anormalidadesGuardadas) {
        if (saved.Files && saved.Files.length > 0) {
          await uploadFilesAnormalidad(
            [
              {
                ...saved,
                Files: saved.Files.filter((f) => f.added),
                Id: saved.Id,
              },
            ],
            listasAsociadas.gestiones
          );
        }
      }
      const anormalidadesExistentesConAdjuntos = anormalidadesData.filter(
        (a) => !a.added && !a.deleted && a.Files && a.Files.some((f) => f.added)
      );
      for (const anormalidad of anormalidadesExistentesConAdjuntos) {
        await uploadFilesAnormalidad(
          [
            {
              ...anormalidad,
              Files: anormalidad.Files.filter((f) => f.added),
              Id: anormalidad.Id,
            },
          ],
          listasAsociadas.gestiones
        );
      }

      for (const saved of accionesGuardadas) {
        const original = accionesData.find(
          (a) => a.InternalId === saved.InternalId || a.Id === saved.Id
        );
        if (original && original.Files && original.Files.length > 0) {
          await uploadFilesAccion(
            [
              {
                ...saved,
                Files: original.Files.filter((f) => f.added),
                Id: saved.Id,
              },
            ],
            listasAsociadas.acciones
          );
        }
      }
      const accionesExistentesConAdjuntos = accionesData.filter(
        (a) => !a.added && !a.deleted && a.Files && a.Files.some((f) => f.added)
      );
      for (const accion of accionesExistentesConAdjuntos) {
        await uploadFilesAccion(
          [
            {
              ...accion,
              Files: accion.Files.filter((f) => f.added),
              Id: accion.Id,
            },
          ],
          listasAsociadas.acciones
        );
      }

      const copyFiles = [...formData.Files];
      await uploadFilesObira(copyFiles, listasAsociadas.obiras, obira.Id);

      const fechaCierreStr =
        formData.EstadoGeneral === ESTADO_GENERAL_CERRADO ? moment().toISOString() : null;

      const obiraDataSource = createObiraDataSource(listasAsociadas.obiras);
      const obiraToList = new Obira({
        Id: obira.Id,
        ...formData,
        FechaCierre: fechaCierreStr,
        FechaOcurrencia: formData.FechaOcurrencia
          ? moment(formData.FechaOcurrencia).toISOString()
          : null,
        FechaDeRepeticionDelProblema: formData.FechaRepeticion,
      });
      await obiraDataSource.edit(obiraToList.toListItem());
      const tieneGestionAnormalidad =
        anormalidadesData.filter((a) => !a.deleted).length > 0;
      const tieneAccionDefinitiva = accionesData.filter((a) => !a.deleted).length > 0;
      await obiraDataSource.edit({
        Id: obira.Id,
        tieneGestionAnormalidad,
        tieneAccionDefinitiva,
      });

      const obirasCleaned = cleanFilesObiras({ ...formData });
      setFormData(obirasCleaned);
      const accionesCleaned = cleanFiles([...accionesData]);
      setAccionesData(accionesCleaned);
      const anormalidadesCleaned = cleanFiles([...anormalidadesData]);
      setAnormalidadesData(anormalidadesCleaned);

      const accionesEmails = getNewResponsableEmail(accionesData);
      // Para CO004 (edición de anormalidades existentes): solo enviar al nuevo Responsable de Seguimiento
      const anormalidadesEditToSend = anormalidadesData.filter(
        (a) => !a.added && a.isNewResponsableSeguimiento
      );
      const anormalidadesEmails = anormalidadesEditToSend
        .map((a) => a.ResponsableSeguimiento?.EMail)
        .filter((email) => !!email);

      // Para CO005 (edición de acciones existentes): solo enviar al nuevo Responsable de Seguimiento
      const accionesEditToSend = accionesData.filter(
        (a) => !a.added && a.isNewResponsableSeguimiento
      );
      const accionesEditEmails = accionesEditToSend
        .map((a) => a.ResponsableSeguimiento?.EMail)
        .filter((email) => !!email);

      const proveedoresArray: Proveedor[] = await proveedorDatasource.getFilteredItems(
        `Activo eq 1 and Title eq '${proveedorNombre}'`
      );
      let proveedor = proveedoresArray.length > 0 ? proveedoresArray[0] : null;

      if (anormalidadesNuevas.length > 0) {
        const getToEmails = []
          .concat(
            ...anormalidadesNuevas.map((anormalidad) => [
              anormalidad.Responsable.EMail,

            ])
          )
          .filter((email) => !!email);
        const uniqueEmails = Array.from(new Set(getToEmails));
        await sendEmailTo(
          CodigoEmail.CO002,
          uniqueEmails,
          { ...formData },
          accionesData,
          anormalidadesData,
          obira.Id,
          props.context,
          proveedor
        );
      }
      if (accionesNuevas.length > 0) {
        let destinatarioCO003 = [];
        if (proveedor?.Notificacion === true) {
          if (proveedor?.Responsable?.EMail)
            destinatarioCO003.push(proveedor.Responsable.EMail);
          if (proveedor?.Jefe?.EMail) destinatarioCO003.push(proveedor.Jefe.EMail);
        } else {
          // Lógica de etapa/equipo igual que FormAdd.tsx
          if (ETAPAS_CON_EQUIPO.includes(formData.Etapa)) {
            const responsableEtapaMatch = responsablesEtapa?.find(
              (r) => r.Etapa === formData.Etapa
            );
            if (responsableEtapaMatch) {
              if (responsableEtapaMatch.Responsable?.EMail)
                destinatarioCO003.push(responsableEtapaMatch.Responsable.EMail);
              if (responsableEtapaMatch.Jefe?.EMail)
                destinatarioCO003.push(responsableEtapaMatch.Jefe.EMail);
            }
          } else {
            const equipoSeleccionado = formData.Equipo as any;
            const equipoEnLista = equipos.find((e) => e.Id === equipoSeleccionado.Id);

            if (equipoEnLista) {
              if (equipoEnLista.Responsable?.EMail) {
                destinatarioCO003.push(equipoEnLista.Responsable.EMail);
              }
              if (equipoEnLista.Jefe?.EMail) {
                destinatarioCO003.push(equipoEnLista.Jefe.EMail);
              }
            }
          }
        }
        if (isProveedorInterno) {
          const extrasEtapa = getDestinatariosEtapa(formData.Etapa);
          destinatarioCO003.push(...extrasEtapa);
        }

        const emailsResponsables = accionesNuevas
          .map((accion) => accion.Responsable?.EMail)
          .filter((email) => !!email);

        // Emails del ResponsableSeguimiento SOLO si NO es proveedor interno
        const emailsResponsablesSeguimiento = !isProveedorInterno
          ? accionesNuevas
            .map((accion) => accion.ResponsableSeguimiento?.EMail)
            .filter((email) => !!email)
          : [];

        destinatarioCO003 = Array.from(
          new Set([
            ...destinatarioCO003,
            ...emailsResponsables,
            ...emailsResponsablesSeguimiento,
          ])
        );
        if (destinatarioCO003.length > 0) {
          await sendEmailTo(
            CodigoEmail.CO003,
            destinatarioCO003,
            { ...formData },
            accionesData,
            anormalidadesData,
            obira.Id,
            props.context,
            proveedor
          );
        }
      }
      if (!isProveedorInterno && anormalidadesEmails.length > 0) {
        const uniqueEmails = Array.from(new Set(anormalidadesEmails));
        await sendEmailTo(
          CodigoEmail.CO004,
          uniqueEmails,
          { ...formData },
          accionesData,
          anormalidadesData,
          obira.Id,
          props.context,
          proveedor
        );
      }
      if (!isProveedorInterno && accionesEditEmails.length > 0) {
        const uniqueEmails = Array.from(new Set(accionesEditEmails));
        await sendEmailTo(
          CodigoEmail.CO005,
          uniqueEmails,
          { ...formData },
          accionesData,
          anormalidadesData,
          obira.Id,
          props.context,
          proveedor
        );
      }

      const emailsAnteriores: string[] = obira.ResponsableItem?.map(u => u.EMail.trim().toLowerCase()) ?? [];
      const emailsActuales: string[] = formData.ResponsableItem?.map(u => u.EMail.trim().toLowerCase()) ?? [];
      const nuevosEmails: string[] = emailsActuales.filter(email => !emailsAnteriores.includes(email));

      if (nuevosEmails.length > 0) {
        await sendEmailTo(
          CodigoEmail.CO006,
          nuevosEmails,
          { ...formData },
          accionesData,
          anormalidadesData,
          obira.Id,
          props.context,
          proveedor
        );
      }
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    } finally {
      setIsLoading(false);
      setIsPopupDeAccionesOpen(false);
      setAccionRealizada(null as any);
      setMessage("Los cambios se han guardado correctamente.", MessageTypes.Success);
      //navigate(`/proveedores/${proveedorNombre}`);
    }
  };

  React.useEffect(() => {
    const loadAnormalidadChoiceFields = async () => {
      try {
        if (listasAsociadas.gestiones) {
          const gestionAnormalidadDataSource = createGestionAnormalidadDataSource(
            listasAsociadas.gestiones
          );
          const choiceFields = await gestionAnormalidadDataSource.getChoiceFields();

          setDropdownOptions((prev) => ({
            ...prev,
            statusOptions:
              choiceFields["Status"]?.map((choice) => ({
                key: choice,
                text: choice,
              })) || [],
          }));
        }
      } catch (error) {
        console.error("Error al cargar los campos choice de anormalidades:", error);
      }
    };

    loadAnormalidadChoiceFields();
  }, [listasAsociadas]);

  React.useEffect(() => {
    const loadAccionDefinitivaChoiceFields = async () => {
      try {
        if (listasAsociadas.acciones) {
          const accionDefinitivaDataSource = createAccionDefinitivaDataSource(
            listasAsociadas.acciones
          );
          const choiceFields = await accionDefinitivaDataSource.getChoiceFields();

          setDropdownOptions((prev) => ({
            ...prev,
            statusAccionDefinitivaOptions:
              choiceFields["StatusAccionDefinitiva"]?.map((choice) => ({
                key: choice,
                text: choice,
              })) || [],
            tipoCausaRaizOptions:
              choiceFields["TipoDeCausaRaiz"]?.map((choice) => ({
                key: choice,
                text: choice,
              })) || [],
            statusYokotenOptions:
              choiceFields["StatusYokoten"]?.map((choice) => ({
                key: choice,
                text: choice,
              })) || [],
          }));
        }
      } catch (error) {
        console.error(
          "Error al cargar los campos choice de acciones definitivas:",
          error
        );
      }
    };

    loadAccionDefinitivaChoiceFields();
  }, [listasAsociadas]);

  const handleDeleteAnormalidad = (internalId: number) => {
    setAnormalidadesData((prevAnormalidadesData) =>
      prevAnormalidadesData.map((anormalidad) =>
        anormalidad.InternalId === internalId
          ? { ...anormalidad, deleted: true }
          : anormalidad
      )
    );
  };

  const handleDeleteAccion = (internalId: number) => {
    setAccionesData((prevAccionesData) =>
      prevAccionesData.map((accion) =>
        accion.InternalId === internalId ? { ...accion, deleted: true } : accion
      )
    );
  };

  const handleAnormalidadChange = (
    index: number,
    field: string,
    value: string | IPersonaProps[] | boolean | number | Date
  ) => {
    const updatedAnormalidades = [...anormalidadesData];
    let anormalidadToChange = updatedAnormalidades.find(
      (anormalidad) => anormalidad.InternalId === index
    );

    const copyErrors = [...errorsAnormalidades];
    let errorToUpdate = copyErrors[index];

    if (Array.isArray(value)) {
      if (field === "ResponsableSeguimiento" && !anormalidadToChange.added) {
        anormalidadToChange.isNewResponsableSeguimiento = true;
      }
      if (value.length > 0) {
        anormalidadToChange[field] = {
          EMail: value[0].secondaryText || "",
          Id: value[0].id || 0,
        };
      } else {
        anormalidadToChange[field] = {
          EMail: "",
          Id: 0,
        };
      }
    } else {
      anormalidadToChange[field] = value;
    }

    errorToUpdate[field] = "";
    anormalidadToChange["modified"] = true;

    const arrayToState = updatedAnormalidades.map((anormalidad) => {
      if (anormalidad.InternalId === index) {
        return anormalidadToChange;
      }
      return anormalidad;
    });

    const errorsToState = copyErrors.map((error, idx) => {
      if (idx === index) {
        return errorToUpdate;
      }
      return error;
    });

    setErrorsAnormalidades(errorsToState);

    setAnormalidadesData(arrayToState);

  };

  const handleAnormalidadFiles = (index: number, files: IFileAdd[]) => {
    const updatedAnormalidades = [...anormalidadesData];
    const anormalidadToChange = updatedAnormalidades.find(
      (anormalidad) => anormalidad.InternalId === index
    );
    anormalidadToChange.Files = files;
    anormalidadToChange.modified = true;
    setAnormalidadesData(updatedAnormalidades);
  };

  const handleAccionFiles = (index: number, files: IFileAdd[]) => {
    const updatedAcciones = [...accionesData];
    const accionToChange = updatedAcciones.find(
      (anormalidad) => anormalidad.InternalId === index
    );
    accionToChange.Files = files;
    accionToChange.modified = true;
    setAccionesData(updatedAcciones);
  };

  const handleObiraFiles = (files: IFileAdd[]) => {
    const updatedFormData = { ...formData };
    updatedFormData.Files = files;
    setFormData(updatedFormData);
  };

  React.useEffect(() => {
    if (formData.PAD && formData.PAD.Title) {
      setPadTags([
        {
          key: formData.PAD.Id,
          name: formData.PAD.Title,
        },
      ]);
    } else {
      setPadTags([]);
    }
  }, [formData.PAD]);

  return (
    <>
      <LoadingSpinner
        isLoading={isLoadingObira || isLoadingAccion || isLoadingAnormalidad || isLoading}
      />
      {isPopupDeAccionesOpen && (
        <PopupDeAcciones
          accion={accionRealizada}
          isOpen={isPopupDeAccionesOpen}
          setIsOpen={setIsPopupDeAccionesOpen}
          onDismiss={() => setIsPopupDeAccionesOpen(false)}
          handleConfirmacion={
            accionRealizada === AccionPopup.VOLVER
              ? handleBack
              : accionRealizada === AccionPopup.CANCELAR
                ? handleCancel
                : null
          }
          handleConfirmacionAsync={
            accionRealizada === AccionPopup.GUARDAR ? handleSave : null
          }
        />
      )}

      <Stack className={styles.stack}>
        <div ref={topRef}></div>
        <Stack.Item className={styles.header}>
          <BackButton onClick={popupVolver} />
          <h1 className={styles.title}>
            {"Editar Ítem"}
            {(obira?.Id ?? obiraId) ? ` ${obira?.Id ?? obiraId}` : ""}</h1>
        </Stack.Item>

        <Stack className={styles.containerStack} tokens={stackTokens}>
          {/* Primera fila */}
          <Stack.Item>
            <div className={styles.gridContainer}>
              <div className={styles.labelFieldContainer}>
                <label className={styles.labelField}>
                  <span className={styles.requiredAsterisk}>* </span>
                  Fase
                </label>
                <Dropdown
                  options={dropdownOptions.etapaOptions}
                  placeholder="Seleccionar Fase"
                  selectedKey={formData.Etapa}
                  onChange={(e, option) => {
                    handleFieldChange("Etapa", option?.key);
                    handleFieldChange("Equipo", {
                      Title: "",
                      Id: 0,
                    });
                    handleFieldChange("SubKPIAfectado", {
                      Title: "",
                      Id: 0,
                    });
                    loadEquipoData(option.text as string);
                    loadSubKPIdATA(option.text as string);
                  }}
                  errorMessage={errorsForm.Etapa}
                  disabled={true}
                  onRenderOption={renderDropdownOptionWithTooltip}
                  onRenderTitle={renderDropdownTitleWithTooltip}
                />
              </div>
              {formData.Etapa && !ETAPAS_CON_EQUIPO.includes(formData.Etapa) ? (
                <div className={styles.labelFieldContainer}>
                  <label className={styles.labelField}>
                    <span className={styles.requiredAsterisk}>* </span>
                    Equipo
                  </label>
                  <CustomDropdown
                    label={null}
                    options={dropdownOptions.equipoOptions}
                    placeholder="Seleccionar equipo"
                    selectedKey={formData.Equipo.Id}
                    onChange={(e, option) => {
                      const customOption = option as CustomDropdownOption;
                      handleFieldChange("Equipo", {
                        Title: option?.text || "",
                        Id: (option?.key as number) || 0,
                      });
                    }}
                    isLoading={isLoadingEquipos}
                    errorMessage={errorsForm.Equipo}
                    disabled={true}
                  />
                </div>
              ) : (
                <div />
              )}
              <div className={styles.labelFieldContainer}>
                <label className={styles.labelField}>
                <span className={styles.requiredAsterisk}>* </span>
                  Bloque
                </label>
                <Dropdown
                  options={dropdownOptions.bloqueOptions}
                  placeholder="Seleccionar bloque"
                  selectedKey={formData?.Bloque.Id}
                  onChange={(e, option) => {
                    handleFieldChange("Bloque", option?.key);
                    handleFieldChange("PAD", {
                      Title: "",
                      Id: 0,
                    });
                    loadLocacionesData(option?.key as string);
                  }}
                  errorMessage={errorsForm.Bloque}
                  disabled={true}
                  onRenderOption={renderDropdownOptionWithTooltip}
                  onRenderTitle={renderDropdownTitleWithTooltip}
                />
              </div>
              <div className={styles.labelFieldContainer}>
                <label className={styles.labelField}>
                  <span className={styles.requiredAsterisk}>* </span>
                  PAD
                </label>
                <TagPicker
                  onResolveSuggestions={async (filter, tagList) => {
                    if (!filter || filter.length < 3) return [];
                    const ds = createLocacionDataSource(Lista.Locaciones);
                    const locaciones = await ds.getFilteredItems(
                      `substringof('${filter}', Title) and AREA eq '${formData.Bloque.Title}'`
                    );
                    return (locaciones || []).map((loc) => ({
                      key: loc.Id,
                      name: loc.Title,
                    }));
                  }}
                  selectedItems={padTags}
                  onChange={(tags) => {
                    setPadTags(tags || []);
                    if (tags && tags.length > 0) {
                      handleFieldChange("PAD", {
                        Title: tags[0].name,
                        Id: tags[0].key,
                      });
                    } else {
                      handleFieldChange("PAD", { Title: "", Id: 0 });
                    }
                  }}
                  inputProps={{ placeholder: "Buscar PAD (mínimo 3 letras)" }}
                  pickerSuggestionsProps={{
                    suggestionsHeaderText: "",
                    noResultsFoundText: "Sin resultados",
                  }}
                  itemLimit={1}
                  errorMessage={errorsForm.PAD}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </Stack.Item>

          {/* Segunda fila */}
          <Stack.Item>
            <div className={styles.gridContainer}>
              <div className={styles.labelFieldContainer}>
                <label className={styles.labelField}>
                  <span className={styles.requiredAsterisk}>* </span>
                  Fecha de ocurrencia del problema
                </label>
                <DatePicker
                  className={styles.datePickerDisabled}
                  strings={datePickerStrings}
                  placeholder="Seleccionar fecha"
                  value={
                    formData?.FechaOcurrencia
                      ? new Date(formData?.FechaOcurrencia.toISOString())
                      : undefined
                  }
                  formatDate={formatDate}
                  onSelectDate={(date) => handleFieldChange("FechaOcurrencia", date)}
                  firstDayOfWeek={DayOfWeek.Monday}
                  disabled={true}
                />
              </div>
              <div className={styles.labelFieldContainer}>
                <label className={styles.labelField}>
                  <span className={styles.requiredAsterisk}>* </span>
                  Tipo de problema
                </label>
                <Dropdown
                  options={dropdownOptions.tipoProblemaOptions}
                  placeholder="Seleccionar tipo de problema"
                  selectedKey={formData?.TipoDeProblema}
                  onChange={(e, option) =>
                    handleFieldChange("TipoDeProblema", option?.key)
                  }
                  errorMessage={errorsForm.TipoDeProblema}
                  disabled={true}
                  onRenderOption={renderDropdownOptionWithTooltip}
                  onRenderTitle={renderDropdownTitleWithTooltip}
                />
              </div>

              <div className={styles.labelFieldContainer}>
                <label className={styles.labelField}>Responsable Ítem</label>
                <PeoplePicker
                  context={peoplePickerContext}
                  ensureUser
                  placeholder="Seleccionar un responsable"
                  showtooltip={true}
                  personSelectionLimit={10}
                  onChange={(items) => {
                    handleFieldChange("ResponsableItem", items as IPersonaProps[]);
                  }}
                  defaultSelectedUsers={formData.ResponsableItem?.map((usuario) => usuario.EMail) ?? []}
                  principalTypes={[PrincipalType.User]}
                  resolveDelay={1000}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </Stack.Item>

          <Stack.Item>
            <div className={styles.gridContainer}>
              <div className={styles.simpleColumn}>
                <div className={styles.labelFieldContainer}>
                  <label className={styles.labelField}>
                    <span className={styles.requiredAsterisk}>* </span>
                    Título del problema
                  </label>
                  <TextField
                    value={formData?.TituloProblema || ""}
                    multiline
                    rows={6}
                    onChange={(e, value) =>
                      handleFieldChange("TituloProblema", value || "")
                    }
                    onBlur={(e) => {
                      let cleanValue = formData?.TituloProblema?.trim() || "";
                      if (cleanValue === ".") {
                        cleanValue = "";
                      }
                      handleFieldChange("TituloProblema", cleanValue);
                    }}
                    errorMessage={errorsForm.TituloProblema}
                    disabled={isReadOnly}
                  />
                </div>
              </div>
              <div className={styles.tripleColumn}>
                <div className={styles.labelFieldContainer}>
                  <label className={styles.labelField}>
                    Detalle
                  </label>
                  <TextField
                    placeholder="Ingresar detalle del problema"
                    multiline
                    rows={6}
                    value={formData?.Detalle || ""}
                    onChange={(e, value) => handleFieldChange("Detalle", value)}
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </div>
          </Stack.Item>

          <Stack.Item>
            <div className={styles.gridContainer}>
              <div className={styles.labelFieldContainer}>
                <label className={styles.labelField}>
                  <span className={styles.requiredAsterisk}>* </span>
                  Sub KPI afectado
                </label>
                <CustomDropdown
                  label={null}
                  options={dropdownOptions.subKPIOptions}
                  placeholder="Seleccionar Sub KPI"
                  selectedKey={formData.SubKPIAfectado?.Id}
                  onChange={(e, option) => {
                    handleFieldChange("SubKPIAfectado", {
                      Title: option?.text || "",
                      Id: (option?.key as number) || 0,
                    });
                  }}
                  isLoading={isLoadingSubKPI}
                  errorMessage={errorsForm.SubKPIAfectado}
                  disabled={isReadOnly}
                />
              </div>
              <div className={styles.labelFieldContainer}>
                <label className={styles.labelField}>
                  <span className={styles.requiredAsterisk}>* </span>
                  QTY
                </label>
                <TextField
                  type="number"
                  step="0.01"
                  min={0}
                  value={formData?.QTY?.toString() || ""}
                  onChange={(e, value) => {
                    if (value && value.includes("-")) {
                      return;
                    }
                    if (value === undefined || value === null || value === "") {
                      handleFieldChange("QTY", "");
                      return;
                    }
                    const num = parseFloat(value);
                    if (!isNaN(num) && num >= 0) {
                      handleFieldChange("QTY", value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "Subtract") {
                      e.preventDefault();
                    }
                  }}
                  onBlur={(e) => {
                    const value = formData?.QTY?.toString() || "";
                    if (value) {
                      const num = parseFloat(value);
                      if (!isNaN(num) && num >= 0) {
                        handleFieldChange("QTY", num.toFixed(2));
                      } else if (num < 0) {
                        handleFieldChange("QTY", "");
                      }
                    }
                  }}
                  errorMessage={errorsForm.QTY}
                  disabled={isReadOnly}
                />
              </div>
              <div className={styles.labelFieldContainer}>
                <label className={styles.labelField}>
                  <span className={styles.requiredAsterisk}>* </span>
                  Unidad
                </label>
                <Dropdown
                  options={dropdownOptions.unidadOptions}
                  placeholder="Seleccionar unidad"
                  selectedKey={formData?.Unidad}
                  onChange={(e, option) => handleFieldChange("Unidad", option?.key)}
                  errorMessage={errorsForm.Unidad}
                  onRenderOption={renderDropdownOptionWithTooltip}
                  onRenderTitle={renderDropdownTitleWithTooltip}
                  disabled={isReadOnly}
                />
              </div>
              <div className={styles.labelFieldContainer}>
                <label className={styles.labelField}>
                  <span className={styles.requiredAsterisk}>* </span>
                  Estado General
                </label>
                <Dropdown
                  options={dropdownOptions.estadoGeneralOptions}
                  placeholder="Seleccionar estado"
                  selectedKey={formData?.EstadoGeneral}
                  onChange={(e, option) =>
                    handleFieldChange("EstadoGeneral", option?.key)
                  }
                  errorMessage={errorsForm.EstadoGeneral}
                  onRenderOption={renderDropdownOptionWithTooltip}
                  onRenderTitle={renderDropdownTitleWithTooltip}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </Stack.Item>
          {/* Cuarta fila */}

          <Stack.Item>
            <div className={styles.gridContainer}>
              <div style={{ gridColumn: "1 / span 4", width: "100%" }}>
                <FechaRepeticionList
                  value={formData.FechaRepeticion}
                  onChange={(val) => handleFieldChange("FechaRepeticion", val)}
                  setIsValidFechaDeRepeticionDelProblema={
                    setIsValidFechaDeRepeticionDelProblema
                  }
                />
              </div>
            </div>
          </Stack.Item>

          {/* Quinta fila */}
          <Stack.Item>
            <div className={styles.gridContainer}>
              <div className={styles.labelFieldContainer}>
                <label className={styles.labelField}>
                  Etiquetas
                </label>
                <TagPicker
                  onResolveSuggestions={async (filter, selectedItems) => {
                    if (!filter || filter.length < 1) return [];
                    const ds = createEtiquetaDataSource(Lista.Etiquetas);
                    const etapa = formData.Etapa;
                    const etiquetas = await ds.getFilteredItems(
                      `(substringof('${filter}', Title)) and (Etapa eq null or Etapa eq '${etapa}')`
                    );

                    const currentTags = (formData.Etiquetas || []).map((et) => et.Id);
                    return etiquetas
                      .filter((et) => !currentTags.includes(et.Id))
                      .map((et) => ({
                        key: et.Id,
                        name: et.Title,
                      }));
                  }}
                  selectedItems={(formData.Etiquetas || []).map((et) => ({
                    key: et.Id,
                    name: et.Title,
                  }))}
                  onChange={(tags) => {
                    const etiquetas = (tags || []).map((tag) => ({
                      Id: tag.key,
                      Title: tag.name,
                    }));
                    handleFieldChange("Etiquetas", etiquetas);
                  }}
                  inputProps={{
                    placeholder: "Buscar etiqueta",
                  }}
                  pickerSuggestionsProps={{
                    suggestionsHeaderText: "",
                    noResultsFoundText: "Sin resultados",
                  }}
                  itemLimit={10}
                  errorMessage={errorsForm.Etiquetas}
                  disabled={isReadOnly}
                />
              </div>

              <div className={styles.tripleColumn}>
                <div className={styles.labelFieldContainer}>
                  <label className={styles.labelField}>
                    Acción inmediata
                  </label>
                  <TextField
                    multiline
                    rows={3}
                    placeholder="Describir la acción inmediata tomada"
                    value={formData?.AccionInmediata}
                    onChange={(e, value) => handleFieldChange("AccionInmediata", value)}
                    errorMessage={errorsForm.AccionInmediata}
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </div>
            <Stack.Item>
              <div className={stylesFormadd.gridContainer}>
                <div className={stylesFormadd.fullWidth}>
                  <FilesComponent
                    files={formData.Files}
                    setFiles={(files) => {
                      handleObiraFiles(files);
                    }}
                    siteUrl={props.context.pageContext.web.absoluteUrl}
                  />
                </div>
              </div>
            </Stack.Item>
          </Stack.Item>

          {/* Campo Causa raíz preliminar */}
          <Stack.Item>
            <div className={styles.doubleColumn}>
              <div className={styles.labelFieldContainer}>
                <label className={styles.labelField}>
                  Causa raíz preliminar
                </label>
                <TextField
                  multiline
                  rows={3}
                  placeholder="Describir la causa raíz preliminar"
                  value={formData?.CausaRaizPreliminar || ""}
                  onChange={(e, value) => handleFieldChange("CausaRaizPreliminar", value)}
                  disabled={isReadOnly}
                />
              </div>
            </div>
            <MessageBar
              messageBarType={MessageBarType.info}
              styles={{
                root: {
                  marginTop: "0.5rem",
                  background: "none",
                  border: "none",
                  padding: 0,
                },
                text: {
                  fontStyle: "italic",
                  color: "#323130",
                },
              }}
            >
              Utilice este campo para volcar la causa raíz o el resumen de avance en su
              investigación.
            </MessageBar>
          </Stack.Item>

          {/* Nueva sección: Gestión de anormalidades */}
          <Stack.Item>
            <Accordion
              allowZeroExpanded
              allowMultipleExpanded
              preExpanded={["gestAnormalidades", "accionesDefinitivas"]}
            >
              <AccordionItem uuid="gestAnormalidades">
                <AccordionItemHeading>
                  <AccordionItemButton>Gestión de anormalidades</AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: "16px",
                    }}
                  >
                    {!isReadOnly && (
                      <CustomButton
                        text="Agregar"
                        variant="purple"
                        iconSrc={agregarIcon}
                        iconAlt="Agregar"
                        iconPosition="left"
                        onClick={handleAddAnormalidad}
                        outline
                      />
                    )}
                  </div>
                  {anormalidadesData.map((anormalidad, index) => {
                    if (!anormalidad.deleted) {
                      return (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              marginBottom: "16px",
                            }}
                          >
                            {!isReadOnly && (
                              <CustomButton
                                text="Eliminar"
                                variant="blueDark"
                                onClick={() => handleDeleteAnormalidad(index)}
                              />
                            )}
                          </div>
                          <div key={index} className={styles.gridContainer}>
                            <div className={styles.labelFieldContainer}>
                              <label className={styles.labelField}>
                                <span className={styles.requiredAsterisk}>* </span>
                                Status
                              </label>
                              <Dropdown
                                options={dropdownOptions.statusOptions}
                                placeholder="Seleccionar una opción"
                                selectedKey={anormalidad.Status}
                                onChange={(_, option) =>
                                  handleAnormalidadChange(index, "Status", option?.key)
                                }
                                errorMessage={errorsAnormalidades[index]?.Status}
                                onRenderOption={renderDropdownOptionWithTooltip}
                                onRenderTitle={renderDropdownTitleWithTooltip}
                                disabled={isReadOnly}
                              />
                            </div>

                            <div className={styles.labelFieldContainer}>
                              <label className={styles.labelField}>
                                <span className={styles.requiredAsterisk}>* </span>
                                Responsable
                              </label>

                              <PeoplePicker
                                context={peoplePickerContext}
                                ensureUser
                                placeholder="Seleccionar un responsable"
                                personSelectionLimit={1}
                                showtooltip={true}
                                onChange={(items) =>
                                  handleAnormalidadChange(
                                    index,
                                    "Responsable",
                                    items as IPersonaProps[]
                                  )
                                }
                                defaultSelectedUsers={[anormalidad.Responsable?.EMail]}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000}
                                disabled={isReadOnly || (!isProveedorInterno && !anormalidadesData[index].added)}
                              />
                              {errorsAnormalidades &&
                                errorsAnormalidades[index]?.Responsable && (
                                  <span
                                    style={{
                                      color: "#a4262c",
                                      fontSize: 12,
                                      marginTop: "2px",
                                    }}
                                  >
                                    {errorsAnormalidades[index]?.Responsable}
                                  </span>
                                )}
                            </div>

                            <div className={styles.labelFieldContainer}>
                              <label className={styles.labelField}>
                                <span className={styles.requiredAsterisk}>* </span>
                                Fecha de finalización
                              </label>
                              <DatePicker
                                strings={datePickerStrings}
                                placeholder="Seleccionar una fecha"
                                value={
                                  anormalidad?.FechaRealizacion
                                    ? new Date(
                                      anormalidad.FechaRealizacion.toISOString()
                                    )
                                    : undefined
                                }
                                minDate={formData?.FechaOcurrencia?.toDate()}
                                formatDate={formatDate}
                                onSelectDate={(date) =>
                                  handleAnormalidadChange(
                                    index,
                                    "FechaRealizacion",
                                    date
                                  )
                                }
                                firstDayOfWeek={DayOfWeek.Monday}
                                disabled={
                                  !anormalidadesData[index].added ||
                                  !formData?.FechaOcurrencia
                                }
                              />
                              {errorsAnormalidades &&
                                errorsAnormalidades[index]?.FechaRealizacion && (
                                  <span
                                    style={{
                                      color: "#a4262c",
                                      fontSize: 12,
                                      marginTop: "-4px",
                                    }}
                                  >
                                    {errorsAnormalidades[index]?.FechaRealizacion}
                                  </span>
                                )}
                            </div>
                            {!isProveedorInterno && (
                              <div className={styles.labelFieldContainer}>
                                <label className={styles.labelField}>
                                  <span className={styles.requiredAsterisk}>* </span>
                                  Responsable de Seguimiento
                                </label>
                                <PeoplePicker
                                  context={peoplePickerContext}
                                  ensureUser
                                  placeholder="Seleccionar un responsable"
                                  personSelectionLimit={1}
                                  showtooltip={true}
                                  onChange={(items) => {
                                    handleAnormalidadChange(
                                      index,
                                      "ResponsableSeguimiento",
                                      items as IPersonaProps[]
                                    );
                                  }}
                                  defaultSelectedUsers={[
                                    anormalidad.ResponsableSeguimiento?.EMail,
                                  ]}
                                  principalTypes={[PrincipalType.User]}
                                  resolveDelay={1000}
                                  disabled={isReadOnly}
                                />
                                {errorsAnormalidades &&
                                  errorsAnormalidades[index]
                                    ?.ResponsableSeguimiento && (
                                    <span
                                      style={{
                                        color: "#a4262c",
                                        fontSize: 12,
                                        marginTop: "2px",
                                      }}
                                    >
                                      {
                                        errorsAnormalidades[index]
                                          ?.ResponsableSeguimiento
                                      }
                                    </span>
                                  )}
                              </div>
                            )}
                            <div className={styles.doubleColumn}>
                              <div
                                style={{
                                  position: "relative",
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "100%",
                                }}
                              >
                                <label className={styles.labelField}>
                                  <span className={styles.requiredAsterisk}>* </span>
                                  Acciones a tomar para minimizar el impacto
                                </label>
                                <TextField
                                  value={anormalidad.AccionesATomar}
                                  placeholder="Ingresar acciones a tomar"
                                  multiline
                                  rows={6}
                                  onChange={(_, value) =>
                                    handleAnormalidadChange(
                                      index,
                                      "AccionesATomar",
                                      value
                                    )
                                  }
                                  onBlur={(e) => {
                                    const cleanValue =
                                      anormalidad.AccionesATomar?.trim() || "";
                                    if (cleanValue === ".") {
                                      handleAnormalidadChange(
                                        index,
                                        "AccionesATomar",
                                        ""
                                      );
                                    } else {
                                      handleAnormalidadChange(
                                        index,
                                        "AccionesATomar",
                                        cleanValue
                                      );
                                    }
                                  }}
                                  errorMessage={
                                    errorsAnormalidades[index]?.AccionesATomar
                                  }

                                />
                              </div>
                            </div>

                            <div className={styles.doubleColumn}>
                              <div className={styles.labelFieldContainer}>
                                <label className={styles.labelField}>
                                  Comentarios
                                </label>
                                <TextField
                                  multiline
                                  rows={6}
                                  placeholder="Ingresar comentarios"
                                  className={styles.doubleColumn}
                                  value={anormalidad.Comentarios}
                                  onChange={(_, value) =>
                                    handleAnormalidadChange(index, "Comentarios", value)
                                  }
                                  onBlur={(e) => {
                                    const cleanValue =
                                      anormalidad.Comentarios?.trim() || "";
                                    handleAnormalidadChange(
                                      index,
                                      "Comentarios",
                                      cleanValue
                                    );
                                  }}
                                  disabled={isReadOnly}
                                />
                              </div>
                            </div>
                          </div>

                          <Stack.Item>
                            <div className={stylesFormadd.gridContainer}>
                              <div className={stylesFormadd.fullWidth}>
                                <FilesComponent
                                  files={anormalidad.Files}
                                  setFiles={(files) => {
                                    handleAnormalidadFiles(index, files);
                                  }}
                                  siteUrl={props.context.pageContext.web.absoluteUrl}
                                />
                              </div>
                            </div>
                          </Stack.Item>
                        </>
                      );
                    }
                  })}
                </AccordionItemPanel>
              </AccordionItem>
              <AccordionItem uuid="accionesDefinitivas">
                <AccordionItemHeading>
                  <AccordionItemButton>Acciones definitivas</AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: "16px",
                    }}
                  >
                    {!isReadOnly && (
                      <CustomButton
                        text="Agregar"
                        variant="purple"
                        iconSrc={agregarIcon}
                        iconAlt="Agregar"
                        iconPosition="left"
                        onClick={handleAddAccionDefinitiva}
                        outline
                        disabled={isReadOnly}
                      />
                    )}
                  </div>
                  {accionesData.map((accion, index) => {
                    if (!accion.deleted) {
                      return (
                        <React.Fragment key={index}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              marginBottom: "16px",
                            }}
                          >
                            {!isReadOnly && (
                              <CustomButton
                                text="Eliminar"
                                variant="blueDark"
                                onClick={() => handleDeleteAccion(index)}
                              />
                            )}
                          </div>

                          <div className={styles.gridContainer}>
                            <div className={styles.doubleColumn}>
                              <div className={styles.labelFieldContainer}>
                                <label className={styles.labelField}>
                                  <span className={styles.requiredAsterisk}>* </span>
                                  Causa Raíz
                                </label>
                                <TextField
                                  multiline
                                  rows={6}
                                  placeholder="Ingresar causa raíz"
                                  className={styles.doubleColumn}
                                  value={accion.CausaRaiz}
                                  onChange={(_, value) =>
                                    handleAccionDefinitivaChange(
                                      index,
                                      "CausaRaiz",
                                      value
                                    )
                                  }
                                  onBlur={(e) => {
                                    const cleanValue = accion.CausaRaiz?.trim() || "";
                                    if (cleanValue === ".") {
                                      handleAccionDefinitivaChange(
                                        index,
                                        "CausaRaiz",
                                        ""
                                      );
                                    } else {
                                      handleAccionDefinitivaChange(
                                        index,
                                        "CausaRaiz",
                                        cleanValue
                                      );
                                    }
                                  }}
                                  errorMessage={errorsAcciones[index]?.CausaRaiz}
                                  disabled={isReadOnly}
                                />
                              </div>
                            </div>
                            <div className={styles.doubleColumn}>
                              <div className={styles.labelFieldContainer}>
                                <label className={styles.labelField}>
                                  <span className={styles.requiredAsterisk}>* </span>
                                  Contramedida
                                </label>
                                <TextField
                                  multiline
                                  rows={6}
                                  placeholder="Ingresar contramedida"
                                  className={styles.doubleColumn}
                                  value={accion.Contramedida}
                                  onChange={(_, value) =>
                                    handleAccionDefinitivaChange(
                                      index,
                                      "Contramedida",
                                      value
                                    )
                                  }
                                  onBlur={(e) => {
                                    const cleanValue =
                                      accion.Contramedida?.trim() || "";
                                    if (cleanValue === ".") {
                                      handleAccionDefinitivaChange(
                                        index,
                                        "Contramedida",
                                        ""
                                      );
                                    } else {
                                      handleAccionDefinitivaChange(
                                        index,
                                        "Contramedida",
                                        cleanValue
                                      );
                                    }
                                  }}
                                  errorMessage={errorsAcciones[index]?.Contramedida}

                                />
                              </div>
                            </div>
                          </div>

                          <div className={styles.gridContainer}>
                            <div className={styles.labelFieldContainer}>
                              <label className={styles.labelField}>
                                <span className={styles.requiredAsterisk}>* </span>
                                Tipo de causa Raíz
                              </label>
                              <Dropdown
                                options={dropdownOptions.tipoCausaRaizOptions}
                                placeholder="Ingresar una opción"
                                selectedKey={accion.TipoCausaRaiz}
                                onChange={(_, option) =>
                                  handleAccionDefinitivaChange(
                                    index,
                                    "TipoCausaRaiz",
                                    option?.key as string
                                  )
                                }
                                errorMessage={errorsAcciones[index]?.TipoCausaRaiz}
                                onRenderOption={renderDropdownOptionWithTooltip}
                                onRenderTitle={renderDropdownTitleWithTooltip}
                              />
                            </div>

                            <div className={styles.labelFieldContainer}>
                              <label className={styles.labelField}>
                                <span className={styles.requiredAsterisk}>* </span>
                                Responsable
                              </label>

                              <PeoplePicker
                                context={peoplePickerContext}
                                ensureUser
                                placeholder="Seleccionar un responsable"
                                personSelectionLimit={1}
                                showtooltip={true}
                                onChange={(items) =>
                                  handleAccionDefinitivaChange(
                                    index,
                                    "Responsable",
                                    items as IPersonaProps[]
                                  )
                                }
                                defaultSelectedUsers={[accion.Responsable?.EMail]}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000}
                                disabled={isReadOnly || (!isProveedorInterno && !accionesData[index].added)}
                              />
                              {errorsAcciones && errorsAcciones[index]?.Responsable && (
                                <span
                                  style={{
                                    color: "#a4262c",
                                    fontSize: 12,
                                    marginTop: "2px",
                                  }}
                                >
                                  {errorsAcciones[index]?.Responsable}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className={styles.gridContainer}>
                            {!isProveedorInterno && (
                              <div className={styles.labelFieldContainer}>
                                <label className={styles.labelField}>
                                  <span className={styles.requiredAsterisk}>* </span>
                                  Responsable de Seguimiento
                                </label>
                                <PeoplePicker
                                  context={peoplePickerContext}
                                  ensureUser
                                  placeholder="Seleccionar un responsable"
                                  personSelectionLimit={1}
                                  showtooltip={true}
                                  onChange={(items) =>
                                    handleAccionDefinitivaChange(
                                      index,
                                      "ResponsableSeguimiento",
                                      items as IPersonaProps[]
                                    )
                                  }
                                  defaultSelectedUsers={[
                                    accion.ResponsableSeguimiento?.EMail,
                                  ]}
                                  principalTypes={[PrincipalType.User]}
                                  resolveDelay={1000}
                                  disabled={isReadOnly}
                                />
                                {errorsAcciones &&
                                  errorsAcciones[index]?.ResponsableSeguimiento && (
                                    <span
                                      style={{
                                        color: "#a4262c",
                                        fontSize: 12,
                                        marginTop: "2px",
                                      }}
                                    >
                                      {errorsAcciones[index]?.ResponsableSeguimiento}
                                    </span>
                                  )}
                              </div>
                            )}

                            <div className={styles.labelFieldContainer}>
                              <label className={styles.labelField}>
                                <span className={styles.requiredAsterisk}>* </span>
                                Fecha de implementación de contramedida
                              </label>
                              <DatePicker
                                strings={datePickerStrings}
                                placeholder="Seleccionar fecha"
                                value={
                                  accion.FechaImplementacion
                                    ? new Date(accion.FechaImplementacion.toISOString())
                                    : undefined
                                }
                                formatDate={formatDate}
                                onSelectDate={(date) =>
                                  handleAccionDefinitivaChange(
                                    index,
                                    "FechaImplementacion",
                                    date as Date
                                  )
                                }
                                firstDayOfWeek={DayOfWeek.Monday}
                                minDate={formData?.FechaOcurrencia?.toDate()}
                                disabled={!accionesData[index].added}
                              />
                              {errorsAcciones &&
                                errorsAcciones[index]?.FechaImplementacion && (
                                  <span
                                    style={{
                                      color: "#a4262c",
                                      fontSize: 12,
                                      marginTop: "-4px",
                                    }}
                                  >
                                    {errorsAcciones[index]?.FechaImplementacion}
                                  </span>
                                )}
                            </div>

                            <div className={styles.labelFieldContainer}>
                              <label className={styles.labelField}>
                                <span className={styles.requiredAsterisk}>* </span>
                                Status acción definitiva
                              </label>
                              <Dropdown
                                placeholder="Seleccionar una opción"
                                options={dropdownOptions.statusAccionDefinitivaOptions}
                                selectedKey={accion.StatusAccionDefinitiva}
                                onChange={(_, option) =>
                                  handleAccionDefinitivaChange(
                                    index,
                                    "StatusAccionDefinitiva",
                                    option?.key as string
                                  )
                                }
                                errorMessage={
                                  errorsAcciones[index]?.StatusAccionDefinitiva
                                }
                                style={{ width: "100%" }}
                                onRenderOption={renderDropdownOptionWithTooltip}
                                onRenderTitle={renderDropdownTitleWithTooltip}
                                disabled={isReadOnly}
                              />
                            </div>
                          </div>
                          <div className={styles.gridContainer}>
                            <div className={styles.labelFieldContainer}>
                              <label className={styles.labelField}>
                                Método de estandarización
                              </label>
                              <TextField
                                placeholder="Ingresar un método"
                                className={styles.doubleColumn}
                                value={accion.MetodosEstandarizacion}
                                onChange={(_, value) =>
                                  handleAccionDefinitivaChange(
                                    index,
                                    "MetodosEstandarizacion",
                                    value
                                  )
                                }
                                disabled={isReadOnly}
                              />
                            </div>
                            <div className={styles.labelFieldContainer}>
                              <label className={styles.labelField}>
                                Fecha de cierre (luego de seguimiento)
                              </label>
                              <DatePicker
                                strings={datePickerStrings}
                                placeholder="Seleccionar fecha"
                                disabled={isReadOnly || !accion.FechaImplementacion}
                                minDate={
                                  accion.FechaImplementacion
                                    ? new Date(accion.FechaImplementacion.toISOString())
                                    : undefined
                                }
                                value={
                                  accion.FechaCierre
                                    ? new Date(accion.FechaCierre.toISOString())
                                    : undefined
                                }
                                formatDate={formatDate}
                                onSelectDate={(date) =>
                                  handleAccionDefinitivaChange(
                                    index,
                                    "FechaCierre",
                                    date as Date
                                  )
                                }
                                firstDayOfWeek={DayOfWeek.Monday}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <Label>Aplica transversalización</Label>
                              <Checkbox
                                checked={accion.Transversalizacion || false}
                                onChange={(_, checked) =>
                                  handleAccionDefinitivaChange(
                                    index,
                                    "Transversalizacion",
                                    checked as boolean
                                  )
                                }
                                disabled={isReadOnly}
                              />
                            </div>
                            {accion.Transversalizacion && (
                              <>
                                <div className={`${styles.breakFull} ${styles.row3}`}>
                                  <div className={styles.labelFieldContainer}>
                                    <label className={styles.labelField}>
                                      <span className={styles.requiredAsterisk}>* </span>
                                      ¿A qué equipos?
                                    </label>
                                    <TextField
                                      placeholder="Ingresar equipos"
                                      value={accion.EquiposQueIntervienen}
                                      multiline
                                      rows={3}
                                      onChange={(_, value) =>
                                        handleAccionDefinitivaChange(
                                          index,
                                          "EquiposQueIntervienen",
                                          value
                                        )
                                      }
                                      onBlur={(e) => {
                                        const cleanValue =
                                          accion.EquiposQueIntervienen?.trim() || "";
                                        if (cleanValue === ".") {
                                          handleAccionDefinitivaChange(
                                            index,
                                            "EquiposQueIntervienen",
                                            ""
                                          );
                                        } else {
                                          handleAccionDefinitivaChange(
                                            index,
                                            "EquiposQueIntervienen",
                                            cleanValue
                                          );
                                        }
                                      }}
                                      disabled={isReadOnly}
                                      errorMessage={
                                        errorsAcciones[index]?.EquiposQueIntervienen
                                      }
                                    />
                                  </div>

                                  <div className={styles.labelFieldContainer}>
                                    <label className={styles.labelField}>
                                      <span className={styles.requiredAsterisk}>* </span>
                                      Fecha (fin de la transversalización)
                                    </label>
                                    <DatePicker
                                      strings={datePickerStrings}
                                      placeholder="Seleccionar fecha"
                                      disabled={isReadOnly || !accion.FechaImplementacion}
                                      minDate={
                                        accion.FechaImplementacion
                                          ? new Date(
                                            accion.FechaImplementacion.toISOString()
                                          )
                                          : undefined
                                      }
                                      value={
                                        accion.FechaFin
                                          ? new Date(accion.FechaFin.toISOString())
                                          : undefined
                                      }
                                      formatDate={formatDate}
                                      onSelectDate={(date) =>
                                        handleAccionDefinitivaChange(
                                          index,
                                          "FechaFin",
                                          date as Date
                                        )
                                      }
                                      firstDayOfWeek={DayOfWeek.Monday}
                                    />
                                    {errorsAcciones &&
                                      errorsAcciones[index]?.FechaFin && (
                                        <span
                                          style={{
                                            color: "#a4262c",
                                            fontSize: 12,
                                            marginTop: "2px",
                                          }}
                                        >
                                          {errorsAcciones[index]?.FechaFin}
                                        </span>
                                      )}
                                  </div>
                                  <div className={styles.labelFieldContainer}>
                                    <label className={styles.labelField}>
                                      <span className={styles.requiredAsterisk}>* </span>
                                      Status transversalización
                                    </label>
                                    <Dropdown
                                      placeholder="Seleccionar una opción"
                                      options={dropdownOptions.statusYokotenOptions}
                                      selectedKey={accion.StatusTransversalizacion}
                                      onChange={(_, option) =>
                                        handleAccionDefinitivaChange(
                                          index,
                                          "StatusTransversalizacion",
                                          option?.key as string
                                        )
                                      }
                                      errorMessage={
                                        errorsAcciones[index]?.StatusTransversalizacion
                                      }
                                      disabled={isReadOnly}
                                      onRenderOption={renderDropdownOptionWithTooltip}
                                      onRenderTitle={renderDropdownTitleWithTooltip}
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          <div className={styles.gridContainer}>
                            <div className={styles.doubleColumn}>
                              <div className={styles.labelFieldContainer}>
                                <label className={styles.labelField}>
                                  Comentarios
                                </label>
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Ingresar comentarios"
                                  className={styles.doubleColumn}
                                  value={accion.Comentarios}
                                  onChange={(_, value) =>
                                    handleAccionDefinitivaChange(
                                      index,
                                      "Comentarios",
                                      value
                                    )
                                  }
                                  disabled={isReadOnly}
                                />
                              </div>
                            </div>
                          </div>
                          <Stack.Item>
                            <div className={stylesFormadd.gridContainer}>
                              <div className={stylesFormadd.fullWidth}>
                                <FilesComponent
                                  files={accion.Files}
                                  setFiles={(files) => {
                                    handleAccionFiles(index, files);
                                  }}
                                  siteUrl={props.context.pageContext.web.absoluteUrl}
                                />
                              </div>
                            </div>
                          </Stack.Item>
                        </React.Fragment>
                      );
                    }
                  })}
                </AccordionItemPanel>
              </AccordionItem>
            </Accordion>

            <div className={styles.labelFieldContainer}>
              <label className={styles.labelField}>
                Link al Plan
              </label>
              <TextField
                placeholder="https://"
                value={formData?.LinkAlPlan}
                onChange={(e, value) => handleFieldChange("LinkAlPlan", value)}
                onRenderSuffix={() =>
                  formData?.LinkAlPlan ? (
                    <Link
                      href={formData.LinkAlPlan}
                      target="_blank"
                      style={{ marginRight: "8px" }}
                    >
                      <IconButton
                        iconProps={{ iconName: "Link" }}
                        title="Abrir enlace"
                        ariaLabel="Abrir enlace en nueva pestaña"
                      />
                    </Link>
                  ) : null
                }
                disabled={isReadOnly}
              />
            </div>
          </Stack.Item>

          {/* Botones de acción */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "24px",
              gap: "1rem",
            }}
          >
            {!isConsultor && (
              <>
                <CustomButton
                  text="Cancelar"
                  variant="blueDark"
                  outline
                  onClick={popupCancelar}
                  type="button"
                />
                <CustomButton
                  text="Guardar"
                  variant="blueDark"
                  onClick={popupGuardar}
                  type="button"
                />
              </>
            )}
            {isAdmin && (
              <CustomButton
                text="Eliminar Ítem"
                variant="blueDark"
                outline
                onClick={() => setShowDeleteModal(true)}
                type="button"
              />
            )}
          </div>
          {obira && obira.Id && (
            <PopupDeAcciones
              accion={AccionPopup.ELIMINAR}
              isOpen={showDeleteModal}
              setIsOpen={setShowDeleteModal}
              onDismiss={() => setShowDeleteModal(false)}
              handleConfirmacionAsync={handleDeleteObira}
            />
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default Formulario;
