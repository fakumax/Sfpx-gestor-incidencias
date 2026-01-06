import * as React from "react";

import { useParams, useNavigate } from "react-router-dom";
import { Stack, IStackTokens, Separator, TextField, IconButton, Link } from "@fluentui/react";
import moment from "moment";
import { BackButton, CustomButton } from "../../../../../core/ui/components";
import {
  Accion,
  CodigoEmail,
  ESTADO_GENERAL_CERRADO,
  ETAPAS_CON_EQUIPO,
  Lista,
  Roles,
} from "../../../../../core/utils/Constants";
import styles from "./FormAdd.module.scss";
import { createObiraDataSource } from "../../../../../core/api/factory";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import {
  useItemAccionDatasource,
  useItemProveedorDatasource,
  useItemEquipoDataSource,
  useItemResponsableEtapaDatasource,
} from "../../../../../core";

import {
  IAcciones,
  IAnormalidades,
  IErrorsAcciones,
  IErrorsAnormalidades,
  IForm,
  IFormErrors,
} from ".././IFormulario";
import useItemGestionAnormalidadDataSource from "../../../../../core/api/GestionAnormalidad/useItemGestionAnormalidadDataSource";
import { useUserContext } from "../../../../../core/context/UserContext";
import LocacionDatasource from "../../../../../core/api/Locacion/LocacionDataSource";
import Locacion from "../../../../../core/entities/Locacion";
import { IDropdownOption } from "@fluentui/react";
import { IFileAdd } from "../Formulario";
import { INITIAL_OBIRA_STATE, ObiraSection } from "./ObiraSection";
import { AnormalidadSection } from "./AnormalidadSection";
import { AccionSection } from "./AccionSection";
import Obira from "../../../../../core/entities/Obira";
import {
  validateForm,
  validateAnormalidades,
  validateAcciones,
  emptyErrorAccion,
  emptyErrorAnormalidad,
} from "../helpers/Helpers";
import { uploadAnormalidad } from "../../../services/anormalidad-service";
import { uploadAccion, uploadFilesAccion } from "../../../services/accion-service";
import { uploadFilesAnormalidad } from "../../../services/anormalidad-service";
import useEmailManager from "../../../../../core/api/email/useEmailManager";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import PopupDeAcciones from "../helpers/PopupDeAcciones";
import { MessageTypes, useMessage } from "../../../../../core/context/MessageContext";


interface IObirasProps {
  context: any;
}

interface IPeoplePickerContext {
  absoluteUrl: string;
  msGraphClientFactory: any;
  spHttpClient: any;
}

const FormAdd: React.FC<IObirasProps> = (props) => {
  const navigate = useNavigate();
  const { setMessage } = useMessage();
  const { proveedorNombre, obiraId } = useParams<{
    proveedorNombre: string;
    obiraId: string;
  }>();
  // Convertir el nombre de proveedor de la URL al formato correcto
  // Mock usa UPPERCASE con underscores: "CONSTRUCCIONES_NORTE"
  const proveedorNombreDecodificado = decodeURIComponent(proveedorNombre)
    .replace(/-/g, "_")
    .toUpperCase();

  const isProveedorInterno = false;

  const { role, isAdmin, group, listasAsociadas, setListasAsociadas } = useUserContext();

  const [listasCargadas, setListasCargadas] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

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

  const [
    { items: equipos, isLoading: isLoadingEquipos },
    getEquipos,
    ,
    ,
    ,
    ,
    getFilteredEquipos,
  ] = useItemEquipoDataSource(Lista.Equipos);

  const [{ items: proveedores }, , , , , , , getFilteredProveedores] =
    useItemProveedorDatasource(Lista.Proveedores);

  const [{ items: responsablesEtapa }, getResponsablesEtapa] =
    useItemResponsableEtapaDatasource(Lista.ResponsableEtapa);

  React.useEffect(() => {
    getResponsablesEtapa();
  }, []);

  // Estado principal de Obira, solo debe declararse una vez
  const [obiraData, setObiraData] = React.useState<IForm>(INITIAL_OBIRA_STATE);

  const [isValidFechaDeRepeticionDelProblema, setIsValidFechaDeRepeticionDelProblema] =
    React.useState(true);

  const peoplePickerContext: IPeoplePickerContext = {
    absoluteUrl: props.context.pageContext.web.absoluteUrl,
    msGraphClientFactory: props.context.msGraphClientFactory,
    spHttpClient: props.context.spHttpClient,
  };

  const [{ error: errorEmail }, sendEmail, sendEmailTo] = useEmailManager();

  // Eliminada la declaración duplicada de obiraData
  const [accionesData, setAccionesData] = React.useState<IAcciones[]>([]);
  const [anormalidadesData, setAnormalidadesData] = React.useState<IAnormalidades[]>([]);

  const handleAccionesChange = (acciones: IAcciones[]) => {
    const accionesMarcadas = acciones.map((a) => ({
      ...a,
      isNewResponsableSeguimiento: true,
    }));
    setAccionesData(accionesMarcadas);
    if (accionesMarcadas.length > errorsAcciones.length) {
      setErrorsAcciones((prev) => [...prev, { ...emptyErrorAccion }]);
    }
  };

  const handleAnormalidadesChange = (anormalidades: IAnormalidades[]) => {
    const anormalidadesMarcadas = anormalidades.map((a) => ({
      ...a,
      isNewResponsableSeguimiento: true,
    }));
    setAnormalidadesData(anormalidadesMarcadas);
    if (anormalidadesMarcadas.length > errorsAnormalidades.length) {
      setErrorsAnormalidades((prev) => [...prev, { ...emptyErrorAnormalidad }]);
    }
  };

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

  const [errorsAcciones, setErrorsAcciones] = React.useState<IErrorsAcciones[]>(
    accionesData.map(() => ({ ...emptyErrorAccion }))
  );
  const [errorsAnormalidades, setErrorsAnormalidades] = React.useState<
    IErrorsAnormalidades[]
  >(anormalidadesData.map(() => ({ ...emptyErrorAnormalidad })));

  const [isPopupDeAccionesOpen, setIsPopupDeAccionesOpen] = React.useState(false);
  const [accionRealizada, setAccionRealizada] = React.useState<Accion>(null);

  const popupVolver = () => {
    setIsPopupDeAccionesOpen(true);
    setAccionRealizada(Accion.VOLVER);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const popupCancelar = () => {
    setIsPopupDeAccionesOpen(true);
    setAccionRealizada(Accion.CANCELAR);
  };

  const handleCancel = () => {
    navigate(-1);
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
    const [errorsForm, isValidForm] = validateForm(obiraData);
    setErrorsForm(errorsForm);
    const hasFormErrors = Object.values(errorsForm).some((error) => !!error);
    if (hasFormErrors || !isValidFechaDeRepeticionDelProblema) {
      return false;
    }

    let anormalidadesErrors: any[] = [];
    let anormalidadesValidas = true;
    const anormalidadesActivas = anormalidadesData.filter((a) => !a.deleted);

    if (anormalidadesActivas.length > 0) {
      anormalidadesErrors = anormalidadesActivas.map((anormalidad) => {
        const [errors, isValid] = validateAnormalidades(anormalidad);
        if (!isValid) anormalidadesValidas = false;
        return errors;
      });
    }
    let accionesErrors: any[] = [];
    let accionesValidas = true;
    const accionesActivas = accionesData.filter((a) => !a.deleted);

    if (accionesActivas.length > 0) {
      accionesErrors = accionesActivas.map((accion) => {
        const [errors, isValid] = validateAcciones(accion);
        if (!isValid) accionesValidas = false;
        return errors;
      });
    }

    if (isProveedorInterno) {
      anormalidadesErrors = anormalidadesErrors.map((err) => ({
        ...err,
        ResponsableSeguimiento: "",
      }));

      const tieneOtrosErroresAnormalidad = anormalidadesErrors.some((err) => {
        const { ResponsableSeguimiento, ...rest } = err;
        return Object.values(rest).some((v) => !!v);
      });
      anormalidadesValidas = !tieneOtrosErroresAnormalidad;
      accionesErrors = accionesErrors.map((err) => ({
        ...err,
        ResponsableSeguimiento: "",
      }));

      const tieneOtrosErroresAccion = accionesErrors.some((err) => {
        const { ResponsableSeguimiento, ...rest } = err;
        return Object.values(rest).some((v) => !!v);
      });
      accionesValidas = !tieneOtrosErroresAccion;
    }

    setErrorsAnormalidades(anormalidadesErrors);
    setErrorsAcciones(accionesErrors);

    if (!anormalidadesValidas || !accionesValidas) {
      return false;
    }

    return true;
  };

  const popupGuardar = async () => {
    if (!isValidForm()) {
      return;
    }

    setIsPopupDeAccionesOpen(true);
    setAccionRealizada(Accion.GUARDAR);
  };

  const stackTokens: IStackTokens = { childrenGap: 20 };

  React.useEffect(() => {
    // Siempre intentar cargar el proveedor si hay un nombre de proveedor
    if (proveedorNombreDecodificado) {
      getFilteredProveedores(`Activo eq 1 and Title eq '${proveedorNombreDecodificado}'`);
    }
  }, [proveedorNombreDecodificado]);

  React.useEffect(() => {
    const id = parseInt(obiraId);
    if (
      listasAsociadas.acciones !== "" &&
      listasAsociadas.obiras !== "" &&
      listasAsociadas.gestiones !== "" &&
      group &&
      obiraId &&
      !isNaN(id) &&
      id > 0
    ) {
      getAnormalidadesByObira(id);
      getAccionesByObira(id);
    }
  }, [listasAsociadas, group, obiraId]);

  React.useEffect(() => {
    if (proveedores && proveedores.length > 0 && proveedores[0].ListaAsociada) {
      const newListasAsociadas = {
        acciones: proveedores[0].ListaAsociada.acciones || "",
        gestiones: proveedores[0].ListaAsociada.gestiones || "",
        obiras: proveedores[0].ListaAsociada.obiras || "",
      };
      setListasAsociadas(newListasAsociadas);
    }
  }, [proveedores]);

  const uploadFiles = async (listTitle: string, adjuntos: IFileAdd[], itemId: number) => {
    const obiraDataSource = createObiraDataSource(listTitle);
    const filteredFiles = adjuntos
      .filter((file) => !file.deleted)
      .map((file) => file.file);
    if (filteredFiles.length > 0) {
      await obiraDataSource.addMultiple(filteredFiles, itemId);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!listasAsociadas?.obiras) return;

      const fechaCierreStr =
        obiraData.EstadoGeneral === ESTADO_GENERAL_CERRADO
          ? moment().toISOString()
          : null;

      const obiraDataSource = createObiraDataSource(listasAsociadas.obiras);
      const obiraToSave = new Obira({
        ...obiraData,
        FechaCierre: fechaCierreStr,
        Bloque: obiraData.Bloque,
        FechaDeOcurrenciaDelProblema: obiraData.FechaOcurrencia
          ? moment(obiraData.FechaOcurrencia).toISOString()
          : null,
        FechaDeRepeticionDelProblema: obiraData.FechaRepeticion,
        PADLocacion: obiraData.PAD,
        Proveedor: proveedores[0]?.Title,
        Activo: true,
      });
      const obiraToListItem = await obiraToSave.toListItem();
      const savedObira = await obiraDataSource.add(obiraToListItem);
      if (obiraData.Files && obiraData.Files.length > 0) {
        await uploadFiles(listasAsociadas.obiras, obiraData.Files, savedObira.Id);
      }

      // Guardar anormalidades y acciones
      const anormalidadesResult = await uploadAnormalidad(
        anormalidadesData,
        listasAsociadas.gestiones,
        savedObira.Id
      );
      if (anormalidadesResult.added && anormalidadesResult.added.length > 0) {
        anormalidadesResult.added.forEach((addedItem, idx) => {
          const original = anormalidadesData.filter((a) => a.added && !a.deleted)[idx];
          if (original && original.Files && original.Files.length > 0) {
            uploadFilesAnormalidad(
              [
                {
                  ...addedItem,
                  Files: original.Files,
                  Id: addedItem.Id,
                },
              ],
              listasAsociadas.gestiones
            );
          }
        });
      }
      const accionesResult = await uploadAccion(
        accionesData,
        listasAsociadas.acciones,
        savedObira.Id
      );
      if (accionesResult.added && accionesResult.added.length > 0) {
        accionesResult.added.forEach((addedItem, idx) => {
          const original = accionesData.filter((a) => a.added && !a.deleted)[idx];
          if (original && original.Files && original.Files.length > 0) {
            uploadFilesAccion(
              [
                {
                  ...addedItem,
                  Files: original.Files,
                  Id: addedItem.Id,
                },
              ],
              listasAsociadas.acciones
            );
          }
        });
      }

      const tieneGestionAnormalidad =
        anormalidadesResult.added && anormalidadesResult.added.length > 0;
      const tieneAccionDefinitiva =
        accionesResult.added && accionesResult.added.length > 0;
      if (tieneGestionAnormalidad || tieneAccionDefinitiva) {
        await obiraDataSource.edit({
          Id: savedObira.Id,
          ...(tieneGestionAnormalidad && { tieneGestionAnormalidad: true }),
          ...(tieneAccionDefinitiva && { tieneAccionDefinitiva: true }),
        });
      }

      const accionesToAdd = accionesData.filter(
        (accion) => accion.added && !accion.deleted
      );
      const anormaldiadesToAdd = anormalidadesData.filter(
        (anormalidad) => anormalidad.added && !anormalidad.deleted
      );
      const proveedor = proveedores.length > 0 ? proveedores[0] : null;

      const etapa = obiraData.Etapa;
      let destinatarioCO001 = [];

      // 1. Primero verificar si el proveedor tiene notificaciones activas
      if (proveedor?.Notificacion === true) {

        if (proveedor.Responsable?.EMail) {
          destinatarioCO001.push(proveedor.Responsable.EMail);
        }
        if (proveedor.Jefe?.EMail) {
          destinatarioCO001.push(proveedor.Jefe.EMail);
        }

      } else {
        // 2. Si el proveedor no tiene notificación, verificar si la etapa está en ETAPAS_CON_EQUIPO
        if (ETAPAS_CON_EQUIPO.includes(etapa)) {
          const responsableEtapaMatch = responsablesEtapa.find((r) => r.Etapa === etapa);
          if (responsableEtapaMatch) {
            if (responsableEtapaMatch.Responsable?.EMail) {
              destinatarioCO001.push(responsableEtapaMatch.Responsable.EMail);
            }
            if (responsableEtapaMatch.Jefe?.EMail) {
              destinatarioCO001.push(responsableEtapaMatch.Jefe.EMail);
            }
          } else {
            console.log("No se encontró la etapa en ResponsableEtapa:", etapa);
          }
        }
        // 3. Si no está en ETAPAS_CON_EQUIPO o no se encontró responsable, usar el equipo seleccionado
        else {
          // El equipo ya viene expandido en obiraData.Equipo desde SharePoint
          const equipoSeleccionado = obiraData.Equipo;
          if (
            equipoSeleccionado &&
            "Responsable" in equipoSeleccionado &&
            (equipoSeleccionado as any).Responsable?.EMail
          ) {
            const responsable = (equipoSeleccionado as any).Responsable;
            destinatarioCO001.push(responsable.EMail);
          } else {
            console.log(
              "No se encontró Responsable de equipo para el equipo seleccionado",
              equipoSeleccionado
            );
          }

          if (
            equipoSeleccionado &&
            "Jefe" in equipoSeleccionado &&
            (equipoSeleccionado as any).Jefe?.EMail
          ) {
            const jefe = (equipoSeleccionado as any).Jefe;
            destinatarioCO001.push(jefe.EMail);
          } else {
            console.log(
              "No se encontró Jefe para el equipo seleccionado",
              equipoSeleccionado
            );
          }
        }
      }
      if(isProveedorInterno){
      const extrasEtapa = getDestinatariosEtapa(etapa);
      destinatarioCO001.push(...extrasEtapa);}

      // Enviar el email si hay destinatarioCO001
      if (destinatarioCO001.length > 0) {
        await sendEmailTo(
          CodigoEmail.CO001,
          destinatarioCO001,
          { ...obiraData },
          accionesData,
          anormalidadesData,
          savedObira.Id,
          props.context,
          proveedor
        );
      }

      if (typeof sendEmailTo !== "undefined" && typeof CodigoEmail !== "undefined") {
        const emailsAnormalidadNueva = Array.from(
          new Set([
            ...anormaldiadesToAdd
              .filter((a) => a.Responsable && a.Responsable.EMail)
              .map((a) => a.Responsable.EMail),
            ...anormaldiadesToAdd
              .filter(
                (a) => a.ResponsableSeguimiento && a.ResponsableSeguimiento.EMail
              )
              .map((a) => a.ResponsableSeguimiento.EMail),
          ])
        );
        if (emailsAnormalidadNueva.length > 0) {
          await sendEmailTo(
            CodigoEmail.CO002,
            emailsAnormalidadNueva,
            { ...obiraData },
            accionesData,
            anormalidadesData,
            savedObira.Id,
            props.context,
            proveedor
          );
        }

        // Solo enviar CO003 si hay acciones definitivas nuevas
        if (accionesToAdd.length > 0) {
          let destinatarioCO003: string[] = [];
          // Lógica de destinatarios igual que CO001 si notificación es false
          if (proveedor?.Notificacion === true) {
            if (proveedor?.Responsable?.EMail)
              destinatarioCO003.push(proveedor.Responsable.EMail);
            if (proveedor?.Jefe?.EMail) destinatarioCO003.push(proveedor.Jefe.EMail);
          } else {
            if (ETAPAS_CON_EQUIPO.includes(etapa)) {
              const responsableEtapaMatch = responsablesEtapa.find(
                (r) => r.Etapa === etapa
              );
              if (responsableEtapaMatch) {
                if (responsableEtapaMatch.Responsable?.EMail)
                  destinatarioCO003.push(responsableEtapaMatch.Responsable.EMail);
                if (responsableEtapaMatch.Jefe?.EMail)
                  destinatarioCO003.push(responsableEtapaMatch.Jefe.EMail);
              }
            } else {
              const equipoSeleccionado = obiraData.Equipo;
              if (
                equipoSeleccionado &&
                "Responsable" in equipoSeleccionado &&
                (equipoSeleccionado as any).Responsable?.EMail
              ) {
                destinatarioCO003.push((equipoSeleccionado as any).Responsable.EMail);
              }
              if (
                equipoSeleccionado &&
                "Jefe" in equipoSeleccionado &&
                (equipoSeleccionado as any).Jefe?.EMail
              ) {
                destinatarioCO003.push((equipoSeleccionado as any).Jefe.EMail);
              }
            }
          }

          if(isProveedorInterno){
          const extrasEtapa = getDestinatariosEtapa(etapa);
          destinatarioCO003.push(...extrasEtapa);}

          const emailsResponsablesSeguimiento = !isProveedorInterno
            ? accionesToAdd
              .map((accion) => accion.ResponsableSeguimiento?.EMail)
              .filter((email) => !!email)
            : [];

          // Agregar responsables de acciones
          destinatarioCO003 = Array.from(
            new Set([
              ...destinatarioCO003,
              ...accionesToAdd
                .filter((a) => a.Responsable && a.Responsable.EMail)
                .map((a) => a.Responsable.EMail),
              ...emailsResponsablesSeguimiento

            ])
          );
          if (destinatarioCO003.length > 0) {
            await sendEmailTo(
              CodigoEmail.CO003,
              destinatarioCO003,
              { ...obiraData },
              accionesData,
              anormalidadesData,
              savedObira.Id,
              props.context,
              proveedor
            );
          }
        }
      }

      const destinatariosResponsableItem: string[] = obiraData.ResponsableItem?.map((usuario) => usuario.EMail);
      if (destinatariosResponsableItem && destinatariosResponsableItem.length > 0) {
        await sendEmailTo(
          CodigoEmail.CO006,
          destinatariosResponsableItem,
          { ...obiraData },
          accionesData,
          anormalidadesData,
          savedObira.Id,
          props.context,
          proveedor
        );
      }
      setMessage("El ítem se ha creado correctamente.", MessageTypes.Success);
      navigate(`/proveedores/${proveedorNombre}/${savedObira.Id}`, { state: { listasAsociadas } });
      //navigate(`/proveedores/${proveedorNombre}`, {
      //   state: { listasAsociadas },
      // });
    } catch (error) {
      setErrorsForm((prev) => ({
        ...prev,
        submit: "Error al guardar el ítem: " + (error as Error).message,
      }));
    } finally {
      setIsLoading(false);
      setIsPopupDeAccionesOpen(false);
      setAccionRealizada(null as any);
    }
  };

  return (
    <>
      <LoadingSpinner
        isLoading={
          isLoading || isLoadingAccion || isLoadingAnormalidad || isLoadingEquipos
        }
      />
      {isPopupDeAccionesOpen && (
        <PopupDeAcciones
          accion={accionRealizada}
          isOpen={isPopupDeAccionesOpen}
          setIsOpen={setIsPopupDeAccionesOpen}
          onDismiss={() => setIsPopupDeAccionesOpen(false)}
          handleConfirmacion={
            accionRealizada === Accion.VOLVER
              ? handleBack
              : accionRealizada === Accion.CANCELAR
                ? handleCancel
                : null
          }
          handleConfirmacionAsync={
            accionRealizada === Accion.GUARDAR ? handleSubmit : null
          }
        />
      )}
      <Stack className={styles.stack}>
        <Stack className={styles.containerStack}>
          <div className={styles.header}>
            <BackButton onClick={popupVolver} />
            <h1 className={styles.title}>Cargar nuevo Ítem</h1>
          </div>
          <Separator />

          <div className={styles.formContainer}>
            <Stack tokens={stackTokens}>
              <ObiraSection
                obiraData={obiraData}
                setObiraData={setObiraData}
                obiraId={obiraId}
                proveedorNombre={proveedores[0]?.Title}
                peoplePickerContext={peoplePickerContext}
                errors={errorsForm}
                setIsValidFechaDeRepeticionDelProblema={
                  setIsValidFechaDeRepeticionDelProblema
                }
              />

              <Stack.Item>
                <Accordion
                  allowZeroExpanded
                  allowMultipleExpanded
                  preExpanded={["gestAnormalidades", "accionesDefinitivas"]}
                >
                  <AccordionItem uuid="gestAnormalidades">
                    <AccordionItemHeading>
                      <AccordionItemButton>
                        Gestión de anormalidades
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <AnormalidadSection
                        anormalidadesData={anormalidadesData}
                        handleAnormalidadesChange={handleAnormalidadesChange}
                        peoplePickerContext={peoplePickerContext}
                        errorsAnormalidades={errorsAnormalidades}
                        fechaOcurrencia={obiraData.FechaOcurrencia}
                        isProveedorInterno={isProveedorInterno}
                      />
                    </AccordionItemPanel>
                  </AccordionItem>
                  <AccordionItem uuid="accionesDefinitivas">
                    <AccordionItemHeading>
                      <AccordionItemButton>Acciones definitivas</AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <AccionSection
                        peoplePickerContext={peoplePickerContext}
                        accionesData={accionesData}
                        handleAccionesChange={handleAccionesChange}
                        errorsAcciones={errorsAcciones}
                        fechaOcurrencia={obiraData.FechaOcurrencia}
                        isProveedorInterno={isProveedorInterno}
                      />
                    </AccordionItemPanel>
                  </AccordionItem>
                </Accordion>

                <TextField
                  label="Link al Plan"
                  placeholder="https://"
                  value={obiraData?.LinkAlPlan || ""}
                  onChange={(e, value) => {
                    setObiraData((prev) => ({
                      ...prev,
                      ["LinkAlPlan"]: value
                    }));
                  }}
                  onRenderSuffix={() =>
                    obiraData?.LinkAlPlan ? (
                      <Link
                        href={obiraData.LinkAlPlan}
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
                />

              </Stack.Item>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "24px",
                  gap: "1rem",
                }}
              >
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
                  type="button"
                  onClick={popupGuardar}
                />
              </div>
            </Stack>
          </div>
        </Stack>
      </Stack>
    </>
  );
};

export default FormAdd;
