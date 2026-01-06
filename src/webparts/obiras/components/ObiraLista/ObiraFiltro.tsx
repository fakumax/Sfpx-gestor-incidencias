import * as React from "react";
import { useState } from "react";
import { useUserContext } from "../../../../core/context/UserContext";
import { useParams } from "react-router-dom";
import useItemEquipoDataSource from "../../../../core/api/Equipo/useItemEquipoDataSource";
import {
  Dropdown,
  IDropdownOption,
  DefaultButton,
  PrimaryButton,
  TagPicker,
  ITag,
  TextField,
} from "@fluentui/react";
import FormPanel from "../../../../core/ui/components/FormPanel/FormPanel";
import styles from "./ObiraFiltro.module.scss";
import { PanelType } from "@fluentui/react";
import { ESTADO_ITEM, Lista, ESTADOS_GENERALES_DEFAULT } from "../../../../core/utils/Constants";

interface ObiraFiltroProps {
  isOpen: boolean;
  onCancel: () => void;
  obiras: any[];
  obiraFlags: Record<number, { hasAnormalidades: boolean; hasAcciones: boolean }>;
  onChange: (result: any[]) => void;
  onStartLoading?: () => void;
  onEndLoading?: () => void;
  onRegisterFilterFunction?: (fn: () => void) => void;
  resetFiltersSignal?: number;
}

import useItemLocacionDataSource from "../../../../core/api/Locacion/useItemLocacionDataSource";
import Locacion from "../../../../core/entities/Locacion";
import { 
  createLocacionDataSource, 
  createEtiquetaDataSource,
  createObiraDataSource 
} from "../../../../core/api/factory";

const ObiraFiltro: React.FC<ObiraFiltroProps> = ({
  isOpen,
  onCancel,
  obiras,
  obiraFlags,
  onChange,
  onStartLoading,
  onEndLoading,
  onRegisterFilterFunction,
  resetFiltersSignal,
}) => {

  const [filterEtapas, setFilterEtapas] = useState<string[]>([]);
  const [filterEquipos, setFilterEquipos] = useState<string[]>([]);
  const [filterBloques, setFilterBloques] = useState<string[]>([]);
  const [filterEstadosGenerales, setFilterEstadosGenerales] = useState<string[]>(ESTADOS_GENERALES_DEFAULT);
  const [equipoOptions, setEquipoOptions] = useState<IDropdownOption[]>([]);
  const [padTags, setPadTags] = useState<ITag[]>([]);
  const [tituloTags, setTituloTags] = useState<ITag[]>([]);
  const [padLocacionOptions, setPadLocacionOptions] = useState<IDropdownOption[]>([]);
  const [filterAnormalidades, setFilterAnormalidades] = useState<string | undefined>(undefined);
  const [filterAcciones, setFilterAcciones] = useState<string | undefined>(undefined);
  const [choiceEstadoGeneralOptions, setChoiceEstadoGeneralOptions] = useState<IDropdownOption[]>([]);
  const [choiceEtapaOptions, setChoiceEtapaOptions] = useState<IDropdownOption[]>([]);
  const [bloqueOptions, setBloqueOptions] = useState<IDropdownOption[]>([]);
  const [etiquetaTags, setEtiquetaTags] = useState<ITag[]>([]);

  const { listasAsociadas } = useUserContext();
  const { proveedorNombre } = useParams<{ proveedorNombre: string }>();
  const [{ items: padLocaciones }] = useItemLocacionDataSource(Lista.Locaciones);
  const [filtroInicialAplicado, setFiltroInicialAplicado] = useState(false);
  const [tituloDelProblema, setTituloDelProblema] = useState("");
 
  // PAD
  React.useEffect(() => {
    if (padLocaciones && padLocaciones.length > 0) {
      setPadLocacionOptions(
        padLocaciones.map((pad) => ({ key: pad.Title, text: pad.Title }))
      );
    }
  }, [padLocaciones]);

  React.useEffect(() => {
  if (
    !filtroInicialAplicado &&
    obiras.length > 0 &&
    choiceEstadoGeneralOptions.length > 0
  ) {
    handleFilter();                 
    setFiltroInicialAplicado(true); 
  }
}, [obiras, choiceEstadoGeneralOptions]);

React.useEffect(() => {
  if (resetFiltersSignal === undefined) return;

  setFilterEtapas([]);
  setFilterEquipos([]);
  setFilterBloques([]);

  setPadTags([]);
  setTituloTags([]);
  setEtiquetaTags([]);

  setFilterAnormalidades(undefined);
  setFilterAcciones(undefined);
  setFilterEstadosGenerales(ESTADOS_GENERALES_DEFAULT);
}, [resetFiltersSignal]);
  const [{ items: equipos }, , , , , , getFilteredEquipos] = useItemEquipoDataSource(Lista.Equipos);

  React.useEffect(() => {
    if (proveedorNombre) {
      getFilteredEquipos(`Proveedor/Title eq '${proveedorNombre}'`);
    }
  }, [proveedorNombre]);

  React.useEffect(() => {
    if (equipos && equipos.length > 0) {
      setEquipoOptions([
        { key: "", text: "N/A" },
        ...equipos.map((equipo) => ({ key: equipo.Title, text: equipo.Title })),
      ]);
    } else {
      setEquipoOptions([{ key: "", text: "N/A" }]);
    }
  }, [equipos]);

  React.useEffect(() => {
    const listTitle = listasAsociadas?.obiras || "";
    // En modo mock, crear datasource aunque no haya listTitle
    const obiraDataSource = createObiraDataSource(listTitle, proveedorNombre);
    
    obiraDataSource.getChoiceFields?.().then((choiceFields: any) => {
      console.log("📋 [ObiraFiltro] choiceFields cargados:", choiceFields);
      setChoiceEtapaOptions(
        choiceFields["Etapa"]?.map((choice: string) => ({
          key: choice,
          text: choice,
        })) || []
      );
      setChoiceEstadoGeneralOptions(
        choiceFields["EstadoGeneral"]?.map((choice: string) => ({
          key: choice,
          text: choice,
        })) || []
      );
    }).catch((err) => {
      console.error("❌ [ObiraFiltro] Error cargando choiceFields:", err);
      // Mock no tiene getChoiceFields, usar defaults
      setChoiceEtapaOptions([]);
      setChoiceEstadoGeneralOptions([]);
    });
  }, [listasAsociadas, proveedorNombre]);

  React.useEffect(() => {
    (async () => {
      const LocacionesDataSource = createLocacionDataSource(Lista.Locaciones);
      const locaciones: Locacion[] = await LocacionesDataSource.getItems();

      if (locaciones && locaciones.length > 0) {
        const mapa = new Map<string, Locacion>();
        locaciones.forEach((l) => {
          if (l.AREA && !mapa.has(l.AREA)) mapa.set(l.AREA, l);
        });

        const opciones = Array.from(mapa.entries())
          .map(([area, loc]) => ({
            key: String(loc.Id),
            text: area,
            data: { realId: loc.Id },
          }))
          .sort((a, b) => a.text.localeCompare(b.text));

        setBloqueOptions(opciones);
      }
    })();
  }, []);

  const escapeOData = (v?: string) =>
    (v ?? "")
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "''")
      .trim();

  const normalizar = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[ \u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .replace(/[-_]/g, "")
    .toLowerCase();
 
  const toggleMultiKey = (prev: string[], key: string) =>
    prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];

  const handleFilter = async () => {
    onStartLoading?.();

    const filters: string[] = [`Activo eq ${ESTADO_ITEM.ACTIVO}`];

    // Etapa
    if (filterEtapas.length > 0) {
      const orEtapa = filterEtapas.map(v => `Etapa eq '${escapeOData(v)}'`).join(" or ");
      filters.push(`(${orEtapa})`);
    }

    // Equipo
    if (filterEquipos.length > 0) {
      const hasNA = filterEquipos.includes("");
      const otros = filterEquipos.filter(k => k !== "");
      const parts: string[] = [];
      if (hasNA) parts.push(`EquipoId eq null`);
      if (otros.length > 0) {
        parts.push(otros.map(v => `Equipo/Title eq '${escapeOData(v)}'`).join(" or "));
      }
      filters.push(`(${parts.join(" or ")})`);
    }

    // Bloque
    if (filterBloques.length > 0) {
      const selectedAreas = filterBloques
        .map(k => bloqueOptions.find(o => String(o.key) === String(k))?.text)
        .filter((a): a is string => !!a);

      if (selectedAreas.length > 0) {
        const orBloque = selectedAreas
          .map(area => `Bloque/AREA eq '${escapeOData(area)}'`)
          .join(" or ");
        filters.push(`(${orBloque})`);
      }
    }

    // Estado General
    if (filterEstadosGenerales.length > 0) {
      const orEstado = filterEstadosGenerales
        .map(v => `EstadoGeneral eq '${escapeOData(v)}'`)
        .join(" or ");
      filters.push(`(${orEstado})`);
    }

    // PAD
    if (padTags.length > 0) {
      filters.push(`PADLocacion/Title eq '${escapeOData(padTags[0].name)}'`);
    }

    // Etiquetas
    if (etiquetaTags.length > 0) {
      const orFiltro = etiquetaTags
        .map(tag => `Etiquetas/Title eq '${escapeOData(tag.name)}'`)
        .join(" or ");
      filters.push(`(${orFiltro})`);
    }

    if (filterAnormalidades && filterAnormalidades !== "") {
      if (filterAnormalidades === "si") {
        filters.push(`tieneGestionAnormalidad eq 1`);
      } else if (filterAnormalidades === "no") {
        filters.push(`(tieneGestionAnormalidad eq 0 or tieneGestionAnormalidad eq null)`);
      }
    }
    if (filterAcciones && filterAcciones !== "") {
      if (filterAcciones === "si") {
        filters.push(`tieneAccionDefinitiva eq 1`);
      } else if (filterAcciones === "no") {
        filters.push(`(tieneAccionDefinitiva eq 0 or tieneAccionDefinitiva eq null)`);
      }
    }

    const filterStr = filters.join(" and ");
    const listTitle = listasAsociadas?.obiras || "";
    const obiraDataSource = createObiraDataSource(listTitle, proveedorNombre);
    let result = await obiraDataSource.getFilteredItems(filterStr);

    // TITULO DEL PROBLEMA
    if (tituloDelProblema.trim() !== "") {
      const buscado = normalizar(tituloDelProblema.trim());

      result = result.filter((it) =>
        normalizar(it.TituloDelProblema || "").includes(buscado)
      );
    }
 
    onEndLoading?.();
    onChange(result);
  };

  const handleClearFilters = () => {
    setFilterEtapas([]);
    setFilterEquipos([]);
    setFilterBloques([]);
    setFilterEstadosGenerales([]);

    setPadTags([]);
    setTituloTags([]);
    setEtiquetaTags([]);
    setFilterAnormalidades(undefined);
    setFilterAcciones(undefined);
    setTituloDelProblema("");
    onChange(obiras);
  };

  const handlePanelClose = () => {
    if (onCancel) onCancel();
  };
  
  React.useEffect(() => {
  if (onRegisterFilterFunction) {
    onRegisterFilterFunction(handleFilter);
  }
}, [onRegisterFilterFunction, handleFilter]);
 

  return (
    <FormPanel
      isOpen={isOpen}
      onCancel={handlePanelClose}
      panelType={PanelType.smallFixedNear}
      headerContent={
        <div className={styles.header}>
          <span className={styles.title}>Filtros</span>
        </div>
      }
    >
      <div className={styles.panelContent}>
        {/* Etapa */}
        <Dropdown
          label="Fase"
          multiSelect
          options={choiceEtapaOptions}
          selectedKeys={filterEtapas}
          onChange={(_, option) => {
            if (!option) return;
            const key = String(option.key);
            setFilterEtapas(prev => toggleMultiKey(prev, key));
          }}
          placeholder="Seleccionar fase/s"
        />

        {/* Equipo */}
        <Dropdown
          label="Equipo"
          multiSelect
          options={equipoOptions.slice().sort((a, b) => a.text.localeCompare(b.text))}
          selectedKeys={filterEquipos}
          onChange={(_, option) => {
            if (!option) return;
            const key = String(option.key);
            setFilterEquipos(prev => toggleMultiKey(prev, key));
          }}
          placeholder="Seleccionar equipo/s"
        />

        {/* Bloque*/}
        <Dropdown
          label="Bloque"
          multiSelect
          options={bloqueOptions}
          selectedKeys={filterBloques}
          onChange={(_, option) => {
            if (!option) return;
            const key = String(option.key);
            setFilterBloques(prev => toggleMultiKey(prev, key));
          }}
          placeholder="Seleccionar bloque/s"
        />

        {/* PAD */}
        <TagPicker
          onResolveSuggestions={async (filter, tagList) => {
            if (!filter || filter.length < 3) return [];
            const ds = createLocacionDataSource(Lista.Locaciones);
            const locaciones = await ds.getFilteredItems(
              `substringof('${escapeOData(filter)}', Title)`
            );
            return (locaciones || []).map((loc) => ({
              key: loc.Title,
              name: loc.Title,
            }));
          }}
          selectedItems={padTags}
          onChange={(tags) => setPadTags(tags || [])}
          inputProps={{ placeholder: "Buscar PAD (mínimo 3 letras)" }}
          pickerSuggestionsProps={{
            suggestionsHeaderText: "",
            noResultsFoundText: "Sin resultados",
          }}
          itemLimit={1}
          label="PAD"
        />

        {/* Título del problema */}
        <TextField
          label="Título del problema"
          placeholder="Buscar título del problema"
          value={tituloDelProblema}
          onChange={(_, v) => setTituloDelProblema(v || "")}
        />
 
        {/* Etiquetas */}
        <TagPicker
          label="Etiquetas"
          onResolveSuggestions={async (filter, tagList) => {
            if (!filter || filter.length < 1) return [];
            const ds = createEtiquetaDataSource(Lista.Etiquetas);
            const etiquetas = await ds.getFilteredItems(
              `substringof('${escapeOData(filter)}', Title)`
            );
            const selectedKeys = (tagList || []).map((t) => t.key);
            return (etiquetas || [])
              .filter((et) => !selectedKeys.includes(et.Id))
              .map((et) => ({
                key: et.Id,
                name: et.Title,
                data: { Etapa: et.Etapa ?? "" },
              }));
          }}
          selectedItems={etiquetaTags}
          onChange={(tags) => setEtiquetaTags(tags || [])}
          inputProps={{ placeholder: "Buscar etiqueta" }}
          pickerSuggestionsProps={{
            suggestionsHeaderText: "",
            noResultsFoundText: "Sin resultados",
          }}
          itemLimit={10}
        />

        <Dropdown
          label="¿Tiene Gestión de anormalidades?"
          options={[
            { key: "", text: "Buscar todos" },
            { key: "si", text: "Sí" },
            { key: "no", text: "No" },
          ]}
          selectedKey={filterAnormalidades ?? ""}
          onChange={(_, option) => setFilterAnormalidades(option?.key as string)}
          placeholder="Buscar todos"
        />
        <Dropdown
          label="¿Tiene Acciones definitivas?"
          options={[
            { key: "", text: "Buscar todos" },
            { key: "si", text: "Sí" },
            { key: "no", text: "No" },
          ]}
          selectedKey={filterAcciones ?? ""}
          onChange={(_, option) => setFilterAcciones(option?.key as string)}
          placeholder="Buscar todos"
        />

        {/* Estado General */}
        <Dropdown
          label="Estado General"
          multiSelect
          options={choiceEstadoGeneralOptions}
          selectedKeys={filterEstadosGenerales}
          onChange={(_, option) => {
            if (!option) return;
            const key = String(option.key);
            setFilterEstadosGenerales(prev => toggleMultiKey(prev, key));
          }}
          placeholder="Seleccionar estado/s"
        />
      </div>

      <div className={styles.footerButtons}>
        <DefaultButton
          text="Limpiar Filtros"
          onClick={handleClearFilters}
          type="button"
          styles={{
            root: {
              borderColor: "#01225e",
              color: "#01225e",
              background: "#fff",
            },
            label: { color: "#01225e" },
          }}
        />
        <PrimaryButton
          text="Filtrar"
          onClick={handleFilter}
          styles={{
            root: { background: "#01225e", borderColor: "#01225e" },
            label: { color: "#fff" },
          }}
        />
      </div>
    </FormPanel>
  );
};

export default ObiraFiltro;
