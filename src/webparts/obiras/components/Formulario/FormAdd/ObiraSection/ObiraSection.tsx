import * as React from "react";
import {
  Stack,
  Dropdown,
  TextField,
  DatePicker,
  DayOfWeek,
  Link,
  ITextFieldProps,
  IconButton,
  TagPicker,
  ITag,
  MessageBar,
  MessageBarType,
  IPersonaProps,
  IDropdownOption,
} from "@fluentui/react";
import {
  renderDropdownOptionWithTooltip,
  renderDropdownTitleWithTooltip,
} from "../../helpers/helperForm";
import {
  useItemEquipoDataSource,
  useItemLocacionDataSource,
  useItemSubKPIDataSource,
  useItemObiraDataSource,
  Locacion,
} from "../../../../../../core";
import { Lista } from "../../../../../../core/utils/Constants";
import { IDropdownOptionObira, IObiraSectionProps } from "./types";
import styles from "../FormAdd.module.scss";
import { useUserContext } from "../../../../../../core/context/UserContext";
import CustomDropdown from "../../../../../../core/ui/components/CustomDropdown/CustomDropdown";

import moment from "moment";
import FilesComponent from "../../../Files/FilesComponent";
import { IFileAdd } from "../../Formulario";
import { datePickerStrings, formatDate } from "../../../../../../core/utils/dateUtils";
import { IForm } from "../../IFormulario";
import { ETAPAS_CON_EQUIPO } from "../../../../../../core/utils/Constants";
import { createLocacionDataSource, createEtiquetaDataSource, createObiraDataSource } from "../../../../../../core/api/factory";
import { FechaRepeticionList } from "../FechaRepeticionField";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";

interface IPeoplePickerContext {
  absoluteUrl: string;
  msGraphClientFactory: any;
  spHttpClient: any;
}

export const ObiraSection: React.FC<IObiraSectionProps> = ({
  obiraData,
  setObiraData,
  proveedorNombre,
  obiraId,
  errors,
  setIsValidFechaDeRepeticionDelProblema,
  peoplePickerContext,
}) => {
  // Estado para TagPicker de PAD
  const [padTags, setPadTags] = React.useState<ITag[]>([]);
  const { isAdmin, group, listasAsociadas } = useUserContext();

  const [
    { items: obiras, item: obira, isLoading: isLoadingObira },
    getObiras,
    addObira,
    editObira,
    deleteObira,
    getObiraById,
  ] = useItemObiraDataSource(listasAsociadas.obiras);

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
    { items: subKPI, isLoading: isLoadingSubKPI },
    getSubKPI,
    ,
    ,
    ,
    ,
    getFilteredSubKPI,
  ] = useItemSubKPIDataSource(Lista.SubKPIAfectado);

  const [dropdownOptions, setDropdownOptions] = React.useState<IDropdownOptionObira>({
    etapaOptions: [],
    equipoOptions: [],
    tipoProblemaOptions: [],
    unidadOptions: [],
    subKPIOptions: [],
    estadoGeneralOptions: [],
  });

  const [locaciones, setLocaciones] = React.useState<Locacion[]>([]);
  const [bloques, setBloques] = React.useState<IDropdownOption[]>([]);
  const [bloqueSeleccionado, setBloqueSeleccionado] = React.useState<string>('');
  const [pads, setPads] = React.useState<ITag[]>([]);
  const [padSeleccionado, setPadSeleccionado] = React.useState<ITag>(null);
  const [hayEtapaSeleccionada, setHayEtapaSeleccionada] = React.useState(false);

  React.useEffect(() => {
    if (obiraData && obiraData.Etapa) {
      setHayEtapaSeleccionada(true);
    }
  }, [obiraData, obiraData.Etapa]);

  React.useEffect(() => {
    const loadChoiceFields = async () => {
      try {
        // En modo mock, cargar siempre los choice fields
        // En modo real, necesita listasAsociadas.obiras
        const obiraDataSource = createObiraDataSource(listasAsociadas?.obiras || '');
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

  // Sincronizar padTags con obiraData.PAD
  React.useEffect(() => {
    if (obiraData.PAD && obiraData.PAD.Title) {
      setPadTags([
        {
          key: obiraData.PAD.Id,
          name: obiraData.PAD.Title,
        },
      ]);
    } else {
      setPadTags([]);
    }
  }, [obiraData.PAD]);

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
    const proveedorParaFiltrar = proveedorNombre ? proveedorNombre : group;
    getFilteredEquipos(`Proveedor/Title eq '${proveedorParaFiltrar}'`);
  };

  const loadSubKPIdATA = async (etapa: string) => {
    getFilteredSubKPI(`Etapa eq '${etapa}'`);
  };

  React.useEffect(() => {
    if (obiraId && listasAsociadas.obiras) {
      const id = parseInt(obiraId);
      getObiraById(id);
    }
  }, [obiraId, listasAsociadas]);

  const uploadFiles = async (listTitle: string, adjuntos: IFileAdd[], itemId: number) => {
    const obiraDataSource = createObiraDataSource(listTitle);
    const filteredFiles = adjuntos
      .filter((file) => !file.deleted)
      .map((file) => file.file);
    if (filteredFiles.length > 0) {
      await obiraDataSource.addMultiple(filteredFiles, itemId);
    }
  };

  React.useEffect(() => {
    if (padSeleccionado) {
      const bloqueAGuardar = {
        Id: Number(padSeleccionado.key),
        Title: bloqueSeleccionado,
      }

      const padAGuardar = {
        Id: Number(padSeleccionado.key),
        Title: padSeleccionado.name
      }

      setObiraData((prev) => ({
        ...prev,
        Bloque: bloqueAGuardar,
        PAD: padAGuardar,
      }));
    }
  }, [padSeleccionado]);

  React.useEffect(() => {
    if (bloqueSeleccionado) {
      const locacionesFiltradasPorArea: Locacion[] = locaciones.filter((l) => l.AREA === bloqueSeleccionado);
      const opcionesPad: ITag[] = locacionesFiltradasPorArea.map((locacion) => ({
        key: locacion.Id,
        name: locacion.Title
      }));
      setPads(opcionesPad);
    }
  }, [bloqueSeleccionado]);

  React.useEffect(() => {
    const LocacionesDataSource = createLocacionDataSource(Lista.Locaciones);
    (
      async () => {
        try {
          const locacionesObtenidas: Locacion[] = await LocacionesDataSource.getItems();
          if (locacionesObtenidas && locacionesObtenidas.length > 0) {
            setLocaciones(locacionesObtenidas);
            const bloquesUnicos: string[] = Array.from(new Set(locacionesObtenidas.map(l => l.AREA)));
            // utilizo el bloque como key, ya que no hay duplicados
            const opcionesBloquesUnicos: IDropdownOption[] = bloquesUnicos.map((bloque) => ({
              key: bloque,
              text: bloque
            })).sort((a, b) => a.text.localeCompare(b.text));
            setBloques(opcionesBloquesUnicos);
          }
        } catch (error: unknown) {
          console.error("Error al cargar locaciones.", error);
        }
      }
    )();
  }, [])

  const onChangeBloqueDropdown = (_, opcionSeleccionada: IDropdownOption) => {
    if (!opcionSeleccionada) {
      return;
    }
    const bloqueAGuardar = {
      Id: null,
      Title: opcionSeleccionada.text,
    }
    setObiraData((prev) => ({
      ...prev,
      Bloque: bloqueAGuardar,
    }));
    setBloqueSeleccionado(opcionSeleccionada.text);
    setPadSeleccionado(null);
  }

  const mostrarSugerenciasPad = (textoIngresado: string, tagSeleccionado: ITag[]) => {
    const minimaCantidadDeCaracteres: number = 3;
    if (!textoIngresado || textoIngresado.length < minimaCantidadDeCaracteres) {
      return [];
    }

    // busco match
    return pads.filter((pad) =>
      pad.name.toLowerCase().includes(textoIngresado.toLowerCase())
      && !(tagSeleccionado || []).some((tag) => tag.key === pad.key)
    );
  }

  const onChangePadTagPicker = (tags: ITag[]) => {
    if (tags && tags.length > 0) {
      setPadSeleccionado(tags[0]); // como utilizo itemLimit, solo pude elegir 1 pad de los pads
    } else {
      setPadSeleccionado(null); // no hay seleccion de pad
    }
  }

  React.useEffect(() => {
    if (obira) {
      if (obira.Etapa) {
        const provider = isAdmin ? proveedorNombre : group;
        getFilteredEquipos(`Proveedor/Title eq '${provider}'`);
        getFilteredSubKPI(`Etapa eq '${obira.Etapa}'`);
      }

      setObiraData((prev) => ({
        ...prev,
        Etapa: obira.Etapa,
        Equipo: obira.Equipo || { Title: "", Id: 0 },
        Bloque: obira.Bloque || { Title: "", Id: 0 },
        PAD: obira.PADLocacion || { Title: "", Id: 0 },
        FechaOcurrencia: obira.FechaDeOcurrenciaDelProblema
          ? moment(obira.FechaDeOcurrenciaDelProblema)
          : null,
        TipoDeProblema: obira.TipoDeProblema,
        TituloDelProblema: obira.TituloDelProblema,
        Detalle: obira.Detalle,
        SubKPIAfectado: obira.SubKPIAfectado || { Title: "", Id: 0 },
        QTY: obira.QTY,
        Unidad: obira.Unidad,
        EstadoGeneral: obira.EstadoGeneral,
        FechaRepeticion: obira.FechaDeRepeticionDelProblema || "",
        AccionInmediata: obira.AccionInmediata,
        LinkAlPlan: obira.LinkAlPlan,
        Files: [],
        CausaRaizPreliminar: obira.CausaRaizPreliminar || "",
      }));
    }
  }, [obira]);

  const handleObiraFiles = (files: IFileAdd[]) => {
    handleFieldChange("Files", files);
  };

  const handleFieldChange = (field: keyof IForm, value: any) => {
    let newValue = value;

    if (field === "ResponsableItem" && Array.isArray(value)) {
      newValue = value.length > 0
        ? value.map((item) => ({
          EMail: (item.secondaryText ?? "").trim(),
          Id: item.id ?? 0,
        }))
        : [];
    }

    setObiraData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  React.useEffect(() => {
    if (!obiraData.Etiquetas || obiraData.Etiquetas.length === 0) return;
    if (obiraData.Etiquetas.some((et) => et.Etapa === undefined)) {
      (async () => {
        const ds = createEtiquetaDataSource(Lista.Etiquetas);
        const ids = obiraData.Etiquetas.map((et) => et.Id);
        const filterStr = ids.map((id) => `Id eq ${id}`).join(" or ");
        const etiquetasFull = await ds.getFilteredItems(filterStr);
        setObiraData((prev) => ({
          ...prev,
          Etiquetas: etiquetasFull
            .filter((et) => !et.Etapa || et.Etapa === "" || et.Etapa === obiraData.Etapa)
            .map((et) => ({
              Id: et.Id,
              Title: et.Title,
              Etapa: et.Etapa ?? "",
            })),
        }));
      })();
    } else {
      setObiraData((prev) => ({
        ...prev,
        Etiquetas: prev.Etiquetas.filter(
          (et) => !et.Etapa || et.Etapa === "" || et.Etapa === obiraData.Etapa
        ),
      }));
    }
  }, [obiraData.Etapa]);

  const requiereEquipo = obiraData.Etapa && !ETAPAS_CON_EQUIPO.includes(obiraData.Etapa);

  return (
    <>
      {/* Primera fila */}
      <Stack.Item>
        <div className={styles.gridContainer}>
          <Dropdown
            label="Fase"
            required
            options={dropdownOptions.etapaOptions}
            placeholder="Seleccionar fase"
            selectedKey={obiraData.Etapa}
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
            errorMessage={errors?.Etapa}
            onRenderOption={renderDropdownOptionWithTooltip}
            onRenderTitle={renderDropdownTitleWithTooltip}
          />
          {requiereEquipo ? (
            <CustomDropdown
              label="Equipo"
              required={requiereEquipo}
              options={dropdownOptions.equipoOptions.slice().sort((a, b) => a.text.localeCompare(b.text))}
              placeholder="Seleccionar equipo"
              selectedKey={obiraData.Equipo.Id}
              onChange={(e, option) => {
                const equipoSeleccionado = equipos.find((eq) => eq.Id === option?.key);
                handleFieldChange(
                  "Equipo",
                  equipoSeleccionado || {
                    Title: option?.text || "",
                    Id: (option?.key as number) || 0,
                  }
                );
              }}
              isLoading={isLoadingEquipos}
              errorMessage={errors?.Equipo}
            />
          ) : (
            <div />
          )}
          <Dropdown
            label="Bloque"
            required
            options={bloques}
            placeholder="Seleccionar bloque"
            selectedKey={bloqueSeleccionado}
            onChange={onChangeBloqueDropdown}
            errorMessage={errors?.Bloque}
            onRenderOption={renderDropdownOptionWithTooltip}
            onRenderTitle={renderDropdownTitleWithTooltip}
          />
          <div className={styles.labelFieldContainer}>
            <label className={styles.labelField}>
              <span className={styles.requiredAsterisk}>* </span>
              PAD
            </label>
            <TagPicker
              required
              disabled={!bloqueSeleccionado}
              onResolveSuggestions={mostrarSugerenciasPad}
              selectedItems={!padSeleccionado ? [] : [padSeleccionado]}
              itemLimit={1}
              onChange={onChangePadTagPicker}
              inputProps={{ placeholder: "Buscar PAD (mínimo 3 letras)" }}
              pickerSuggestionsProps={{
                suggestionsHeaderText: "",
                noResultsFoundText: "Sin resultados",
              }}
              errorMessage={errors?.PAD}
            />
          </div>
        </div>
      </Stack.Item>

      {/* Segunda fila */}
      <Stack.Item>
        <div className={styles.gridContainer}>
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <DatePicker
              className={errors?.FechaOcurrencia ? styles.datePickerError : undefined}
              label="Fecha de ocurrencia del problema"
              isRequired={true}
              strings={datePickerStrings}
              placeholder="Seleccionar fecha"
              value={
                obiraData?.FechaOcurrencia
                  ? new Date(obiraData?.FechaOcurrencia.toISOString())
                  : undefined
              }
              formatDate={formatDate}
              onSelectDate={(date) =>
                handleFieldChange("FechaOcurrencia", date ? moment(date) : null)
              }
              firstDayOfWeek={DayOfWeek.Monday}
              maxDate={new Date()}
            />
            {errors?.FechaOcurrencia && (
              <span style={{ color: "#a4262c", fontSize: 12, marginTop: "-4px" }}>
                {errors.FechaOcurrencia}
              </span>
            )}
          </div>
          <Dropdown
            label="Tipo de problema"
            required
            options={dropdownOptions.tipoProblemaOptions}
            placeholder="Seleccionar tipo de problema"
            selectedKey={obiraData?.TipoDeProblema}
            onChange={(e, option) => handleFieldChange("TipoDeProblema", option?.key)}
            errorMessage={errors?.TipoDeProblema}
            onRenderOption={renderDropdownOptionWithTooltip}
            onRenderTitle={renderDropdownTitleWithTooltip}
         />

          <div className={styles.labelFieldContainer}>
            <label className={styles.labelField}>Responsable Ítem</label>
            <PeoplePicker
              context={peoplePickerContext}
              ensureUser
              placeholder="Seleccionar un responsable"
              showtooltip={true}
              personSelectionLimit={10}
              onChange={(items) => {
                console.log(items)
                handleFieldChange("ResponsableItem", items as IPersonaProps[]);
              }}
              defaultSelectedUsers={obiraData.ResponsableItem?.map((usuario) => usuario.EMail) ?? []}
              principalTypes={[PrincipalType.User]}
              resolveDelay={1000}
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
                placeholder="Ingresar nombre descriptivo para el problema"
                value={obiraData?.TituloProblema || ""}
                multiline
                rows={6}
                onChange={(e, value) => {
                  handleFieldChange("TituloProblema", value || "");
                }}
                onBlur={(e) => {
                  let cleanValue = obiraData?.TituloProblema?.trim() || "";
                  if (cleanValue === ".") {
                    cleanValue = "";
                  }
                  handleFieldChange("TituloProblema", cleanValue);
                }}
                errorMessage={errors?.TituloProblema}
              />
            </div>
          </div>
          <div className={styles.tripleColumn}>
            <TextField
              label="Detalle"
              placeholder="Ingresar detalle del problema"
              multiline
              rows={6}
              value={obiraData?.Detalle || ""}
              onChange={(e, value) => handleFieldChange("Detalle", value)}
            />
          </div>
        </div>
      </Stack.Item>

      {/* Tercera fila */}
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
              selectedKey={obiraData.SubKPIAfectado?.Id}
              onChange={(e, option) => {
                handleFieldChange("SubKPIAfectado", {
                  Title: option?.text || "",
                  Id: (option?.key as number) || 0,
                });
              }}
              isLoading={isLoadingSubKPI}
              errorMessage={errors?.SubKPIAfectado}
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
              placeholder="Ingresar número"
              value={obiraData?.QTY?.toString() ?? ""}
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
                const value = obiraData?.QTY?.toString() ?? "";
                if (value) {
                  const num = parseFloat(value);
                  if (!isNaN(num) && num >= 0) {
                    handleFieldChange("QTY", num.toFixed(2));
                  } else if (num < 0) {
                    handleFieldChange("QTY", "");
                  }
                }
              }}
              errorMessage={errors?.QTY}
            />
          </div>
          <Dropdown
            label="Unidad"
            required
            options={dropdownOptions.unidadOptions}
            placeholder="Seleccionar unidad"
            selectedKey={obiraData?.Unidad}
            onChange={(e, option) => handleFieldChange("Unidad", option?.key)}
            errorMessage={errors?.Unidad}
            onRenderOption={renderDropdownOptionWithTooltip}
            onRenderTitle={renderDropdownTitleWithTooltip}
          />

          <Dropdown
            label="Estado General"
            required
            options={dropdownOptions.estadoGeneralOptions}
            placeholder="Seleccionar estado"
            selectedKey={obiraData?.EstadoGeneral}
            onChange={(e, option) => handleFieldChange("EstadoGeneral", option?.key)}
            errorMessage={errors?.EstadoGeneral}
            onRenderOption={renderDropdownOptionWithTooltip}
            onRenderTitle={renderDropdownTitleWithTooltip}
          />
        </div>
      </Stack.Item>

      <Stack.Item>
        <div className={styles.gridContainer}>
          <div style={{ gridColumn: "1 / span 4", width: "100%" }}>
            <FechaRepeticionList
              value={obiraData.FechaRepeticion}
              onChange={(val) => handleFieldChange("FechaRepeticion", val)}
              setIsValidFechaDeRepeticionDelProblema={
                setIsValidFechaDeRepeticionDelProblema
              }
            />
          </div>
        </div>
      </Stack.Item>

      {/* Cuarta fila */}
      <Stack.Item>
        <div className={styles.gridContainer}>
          <div className={styles.labelFieldContainer}>
            <label className={styles.labelField}>
              Etiquetas
            </label>
            <TagPicker
              disabled={!hayEtapaSeleccionada}
              onResolveSuggestions={async (filter, tagList) => {
                if (!filter || filter.length < 1) return [];
                const ds = createEtiquetaDataSource(Lista.Etiquetas);
                let etapa = obiraData.Etapa ? obiraData.Etapa.replace("'", "''") : "";
                const filterStr = `substringof('${filter}', Title) and (Etapa eq null or Etapa eq '' or Etapa eq '${etapa}')`;
                const etiquetas = await ds.getFilteredItems(filterStr);
                return (etiquetas || []).map((et) => ({
                  key: et.Id,
                  name: et.Title,
                  data: { Etapa: et.Etapa ?? "" },
                }));
              }}
              selectedItems={
                obiraData.Etiquetas?.map((et) => ({
                  key: et.Id,
                  name: et.Title,
                  data: { Etapa: et.Etapa ?? "" },
                })) || []
              }
              onChange={async (tags) => {
                if (!tags || tags.length === 0) {
                  setObiraData((prev) => ({ ...prev, Etiquetas: [] }));
                  return;
                }
                const ds = createEtiquetaDataSource(Lista.Etiquetas);
                const ids = tags.map((t) => Number(t.key));
                const filterStr = ids.map((id) => `Id eq ${id}`).join(" or ");
                const etiquetasFull = await ds.getFilteredItems(filterStr);
                setObiraData((prev) => ({
                  ...prev,
                  Etiquetas: etiquetasFull.map((et) => ({
                    Id: et.Id,
                    Title: et.Title,
                    Etapa: et.Etapa ?? "",
                  })),
                }));
              }}
              inputProps={{ placeholder: "Buscar etiqueta" }}
              pickerSuggestionsProps={{
                suggestionsHeaderText: "",
                noResultsFoundText: "Sin resultados",
              }}
              itemLimit={5}
              errorMessage={errors?.Etiquetas}
            />
          </div>
          <div className={styles.tripleColumn}>
            <TextField
              label="Acción inmediata"
              multiline
              rows={3}
              placeholder="Describir la acción inmediata tomada"
              value={obiraData?.AccionInmediata}
              onChange={(e, value) => handleFieldChange("AccionInmediata", value)}
            />
          </div>
        </div>
      </Stack.Item>
      {/* Quinta fila */}
      <Stack.Item>
        <div className={styles.gridContainer}>
          <div className={styles.fullWidth}>
            <FilesComponent
              files={obiraData.Files}
              setFiles={(files) => {
                handleObiraFiles(files);
              }}
            />
          </div>
        </div>
      </Stack.Item>

      {/* Campo Causa raíz preliminar */}
      <Stack.Item>
        <div className={styles.doubleColumn}>
          <TextField
            label="Causa raíz preliminar"
            multiline
            rows={3}
            placeholder="Describir la causa raíz preliminar"
            value={obiraData?.CausaRaizPreliminar || ""}
            onChange={(e, value) => handleFieldChange("CausaRaizPreliminar", value)}
          />
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
    </>
  );
};
