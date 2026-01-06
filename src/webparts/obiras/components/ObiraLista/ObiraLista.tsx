import * as React from "react";
import { useEffect, useState } from "react";
import {
  Stack,
  IStackTokens,
  DetailsList,
  IColumn,
  SelectionMode,
  DetailsListLayoutMode,
  Image,
  Spinner,
  CheckboxVisibility,
  IObjectWithKey,
  DetailsRow,
  Selection,
} from "@fluentui/react";
import { useNavigate, useParams } from "react-router-dom";
import Paginado from "./Paginado";
import { BackButton, CustomButton } from "../../../../core/ui/components";
import ExportarExcel from "../ExportarExcel/ExportarExcel";

import { Obira } from "../../../../core/entities";
import { getAccionesPorObiraIdsFull } from "../../services/accion-service";
import ObiraDataSource from "../../../../core/api/Obira/ObiraDataSource";
import { Accion, ESTADO_ITEM, ESTADOS_GENERALES_DEFAULT, Lista, Roles } from "../../../../core/utils/Constants";
import { useUserContext } from "../../../../core/context/UserContext";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { getDatasource, ObiraMock } from "../../../../core/mock";

import checkCelesteIcon from "../../../../core/ui/icons/checkCelesteIcon.svg";
import flechaAzulIcon from "../../../../core/ui/icons/FlechaAzulIcon.svg";
import recargarIcon from "../../../../core/ui/icons/RecargarIcon.svg";
import filtroIcon from "../../../../core/ui/icons/FiltroIcon.svg";
import agregarIcon from "../../../../core/ui/icons/AgregarIcon.svg";
import styles from "./ObiraLista.module.scss";
import { useItemProveedorDatasource, Utils } from "../../../../core";
import ObiraFiltro from "./ObiraFiltro";
import { renderWithTooltip } from "../common/renderWithTooltip";
import PopupDeAcciones from "../Formulario/helpers/PopupDeAcciones";

interface ObiraListaProps {
  context: WebPartContext;
}

const ObiraLista: React.FC<ObiraListaProps> = ({ context }) => {
  const { proveedorNombre } = useParams<{ proveedorNombre: string }>();
  const { role: userRole, listasAsociadas, setListasAsociadas } = useUserContext();
  const [obiras, setObiras] = useState<Obira[]>([]);
  const [obirasOriginal, setObirasOriginal] = useState<Obira[]>([]);
  const [obiraFlags, setObiraFlags] = useState<
    Record<number, { hasAnormalidades: boolean; hasAcciones: boolean }>
  >({});
  const [loading, setLoading] = useState(true);
  const [accionesPorObira, setAccionesPorObira] = useState<Record<number, any[]>>({});
  const [hayItemSeleccionado, setHayItemSeleccionado] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [filteredObiras, setFilteredObiras] = useState<Obira[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [selectionsPerPage, setSelectionsPerPage] = useState<Record<number, string[]>>(
    {}
  );
  const [paginatedItems, setPaginatedItems] = useState<Obira[]>([]);
  const [lastClickedId, setLastClickedId] = useState<number | null>(null);

  const [restaurarItems, setRestaurarItems] = useState(false);
  const [isPopupDeAccionesOpen, setIsPopupDeAccionesOpen] = React.useState(false);
  const [resetFiltersSignal, setResetFiltersSignal] = useState(0);

  const navigate = useNavigate();

  const [{ items: proveedores }, , , , , , , getFilteredProveedores] =
    useItemProveedorDatasource(Lista.Proveedores);

  const filtrarPorDefecto = (items: Obira[]) => {
  return items.filter((item) =>
    ESTADOS_GENERALES_DEFAULT.includes(item.EstadoGeneral)
  );
};
 
  useEffect(() => {
    setObiras([]);
    setObiraFlags({});
    setFilteredObiras([]);
    if (proveedorNombre) {
      // En modo mock, convertir guiones a underscores para coincidir con formato mock
      // En modo real SharePoint, convertir guiones a espacios
      const nombreProveedor = decodeURIComponent(proveedorNombre).replace(/-/g, "_").toUpperCase();
      getFilteredProveedores(`Activo eq 1 and Title eq '${nombreProveedor}'`);
    }
  }, [proveedorNombre]);

  useEffect(() => {
    if (proveedores && proveedores.length > 0 && proveedores[0].ListaAsociada) {
      const newListasAsociadas = {
        acciones: proveedores[0].ListaAsociada.acciones || "",
        gestiones: proveedores[0].ListaAsociada.gestiones || "",
        obiras: proveedores[0].ListaAsociada.obiras || "",
      };
      setListasAsociadas(newListasAsociadas);
    }
  }, [proveedores]);

  useEffect(() => {
    setHayItemSeleccionado(
      !Object.values(selectionsPerPage).every((arr) => (arr?.length ?? 0) === 0)
    );
  }, [selectionsPerPage]);

  const stackTokens: IStackTokens = { childrenGap: 20 };

  const cargarObiras = async (estadoItems: ESTADO_ITEM = ESTADO_ITEM.ACTIVO) => {
    setHayItemSeleccionado(false);
    setSelectionsPerPage({});
    setLoading(true);
    try {
      const filtroDeItems: string = `Activo eq ${estadoItems}`;
      
      // Obtener el nombre del proveedor desde la URL
      // Convertir guiones a guiones bajos para coincidir con el formato del mock
      const nombreProveedor = proveedorNombre 
        ? decodeURIComponent(proveedorNombre).replace(/-/g, "_").toUpperCase()
        : "";
      
      const obiraDatasource = getDatasource(
        new ObiraDataSource(listasAsociadas.obiras),
        new ObiraMock(nombreProveedor)
      );
      const obirasData = await obiraDatasource.getFilteredItems(filtroDeItems);
      const items = Array.isArray(obirasData) ? obirasData : [];
      const filtrados = filtrarPorDefecto(items);
      setObirasOriginal(items);
      setObiras(filtrarPorDefecto(items));

      const flags: Record<number, { hasAnormalidades: boolean; hasAcciones: boolean }> =
        {};
      if (Array.isArray(obirasData)) {
        obirasData.forEach((obira: any) => {
          flags[obira.Id] = {
            hasAnormalidades: !!obira.tieneGestionAnormalidad,
            hasAcciones: !!obira.tieneAccionDefinitiva,
          };
        });
      }
      setObiraFlags(flags);

      const obiraIdsConAcciones = (obirasData || [])
        .filter((o: any) => !!o.tieneAccionDefinitiva)
        .map((o: any) => o.Id);

      if (obiraIdsConAcciones.length > 0 && listasAsociadas.acciones) {
        const acciones = await getAccionesPorObiraIdsFull(
          obiraIdsConAcciones,
          listasAsociadas.acciones
        );
        const agrupadas: Record<number, any[]> = {};
        acciones.forEach((accion: any) => {
          if (!agrupadas[accion.ObirasId]) agrupadas[accion.ObirasId] = [];
          agrupadas[accion.ObirasId].push(accion);
        });
        setAccionesPorObira(agrupadas);
      } else {
        setAccionesPorObira({});
      }
    } catch (err) {
      console.error("Error al cargar obiras:", err);
      setObiras([]);
      setObiraFlags({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      listasAsociadas?.acciones &&
      listasAsociadas?.gestiones &&
      listasAsociadas?.obiras
    ) {
      cargarObiras();
    }
  }, [listasAsociadas]);

  const handleBack = () => {
    if (userRole === Roles.Administradores || userRole === Roles.Consultores) {
      navigate("/proveedores");
    } else {
      navigate("/");
    }
  };
  const handleCargarObira = () => navigate(`/proveedores/${proveedorNombre}/new`);

  const handleRecargar = () => {
    SelectObira.current.setAllSelected(false);
    setLastClickedId(null); 
    cargarObiras(); 
    setResetFiltersSignal(prev => prev + 1);
  }

  const siteUrl = context.pageContext.web.absoluteUrl;
  const planesBase = `${siteUrl}/PlanesDeAccion/Forms/AllItems.aspx`;
  const proveedorFolder = decodeURIComponent(proveedorNombre || "").replace(/-/g, " ");
  const folderPath = `${siteUrl}/PlanesDeAccion/${proveedorFolder}`;
  const encodedFolderPath = encodeURIComponent(folderPath);
  const planesUrl = `${planesBase}?id=${encodedFolderPath}&rootFolder=${encodeURIComponent(
    proveedorFolder
  )}`;

  useEffect(() => {}, [restaurarItems]);

  useEffect(() => {
    const newPaginatedItems = filteredObiras.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
    setPaginatedItems(newPaginatedItems);
  }, [currentPage, pageSize, filteredObiras]);

  useEffect(() => {
    setFilteredObiras(obiras);
  }, [obiras]);

  const SelectObira = React.useRef<Selection<IObjectWithKey>>(
    new Selection({
      getKey: (item: unknown) => (item as Obira)?.Id?.toString(),
      selectionMode: SelectionMode.multiple,
      canSelectItem: () => true,
      onSelectionChanged: () => {
        if (isRestoringSelectionRef.current) return;

        const selection = SelectObira.current;
        const selected = selection.getSelection() as Obira[];
        const selectedIds = selected.map((item) => item.Id.toString());
        setSelectionsPerPage((prev) => {
          const newSelections = {
            ...prev,
            [currentPageRef.current]: selectedIds,
          };
          return newSelections;
        });
      },
    })
  );

  const currentPageRef = React.useRef(currentPage);
  const isRestoringSelectionRef = React.useRef(false);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    isRestoringSelectionRef.current = true;

    SelectObira.current.setItems(paginatedItems as unknown as IObjectWithKey[]);
    const savedSelections = selectionsPerPage[currentPage] || [];
    paginatedItems.forEach((item) => {
      const idStr = item.Id.toString();
      if (savedSelections.includes(idStr)) {
        SelectObira.current.setKeySelected(idStr, true, false);
      } else {
        SelectObira.current.setKeySelected(idStr, false, false);
      }
    });

    setTimeout(() => {
      isRestoringSelectionRef.current = false;
    }, 0);
  }, [currentPage, paginatedItems]);

  const handleFiltroChange = (result: Obira[]) => {
     if (result === obiras) {
    setFilteredObiras(obirasOriginal); 
  } else {
    setFilteredObiras(result); 
  }

  setIsFilterPanelOpen(false);
  setLoading(false);
  setCurrentPage(1);
};

  // Lógica de restaurar ítems
  const onItemsEliminadosClick = async () => {
    setRestaurarItems(true);
    await cargarObiras(ESTADO_ITEM.ELIMINADO);
  };

  const onRestaurarItemsClick = async () => {
    const items: Obira[] = getSelectedItems();
    try {
      // Dar de alta nuevamente los ítems seleccionados
      const nombreProveedor = proveedorNombre 
        ? decodeURIComponent(proveedorNombre).replace(/-/g, "_").toUpperCase()
        : "";
      const obiraDataSource = getDatasource(
        new ObiraDataSource(listasAsociadas.obiras),
        new ObiraMock(nombreProveedor)
      );
      for (const item of items) {
        const itemToActivate = { Id: item.Id, Activo: true };
        await obiraDataSource.edit(itemToActivate);
      }
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setRestaurarItems(false);
      setIsPopupDeAccionesOpen(false);
      await cargarObiras();
    }
  };

  const getSelectedItems = (): Obira[] => {
    const allSelectedIds = Object.values(selectionsPerPage).reduce(
      (acc, curr) => [...acc, ...curr],
      []
    );

    return allSelectedIds.length > 0
      ? filteredObiras.filter((item) => allSelectedIds.includes(item.Id.toString()))
      : !restaurarItems
      ? filteredObiras
      : [];
  };

  const handleBackRestaurarItems = async () => {
    setRestaurarItems(false);
    await cargarObiras();
  };

  const columns: IColumn[] = [
    {
      key: "accion",
      name: "",
      minWidth: 30,
      maxWidth: 30,
      isResizable: true,
      onRender: (item: Obira) =>
        !restaurarItems && (
          <div
            style={{ cursor: "pointer", width: "fit-content" }}
            onClick={() => {
              const baseURL: string = `${context.pageContext.web.absoluteUrl}/SitePages/Home.aspx#/proveedores`;
              const proveedorURL: string = encodeURIComponent(proveedorNombre);
              Utils.openInNewTab(`${baseURL}/${proveedorURL}/${item.Id}`);
            }}
          >
            <Image src={flechaAzulIcon} alt="Acción" width={20} height={20} />
          </div>
        ),
    },
    {
      key: "id",
      name: "ID",
      fieldName: "Id",
      minWidth: 30,
      maxWidth: 30,
      isResizable: true,
      onRender: (item: Obira) => renderWithTooltip(item.Id?.toString()),
    },
    {
      key: "etapa",
      name: "Fase",
      fieldName: "Etapa",
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      onRender: (item: Obira) => renderWithTooltip(item.Etapa),
    },
    {
      key: "equipo",
      name: "Equipo",
      minWidth: 60,
      maxWidth: 60,
      isResizable: true,
      onRender: (item: Obira) =>
        renderWithTooltip(item.Equipo?.Title ? item.Equipo.Title : "N/A"),
    },
    {
      key: "pad",
      name: "PAD",
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      onRender: (item: Obira) => renderWithTooltip(item.PADLocacion?.Title),
    },
    {
      key: "tituloproblema",
      name: "Título del problema",
      fieldName: "TituloDelProblema",
      minWidth: 200,
      maxWidth: 350,
      isResizable: true,
      onRender: (item: Obira) => renderWithTooltip(item.TituloDelProblema),
    },
    {
      key: "tipoproblema",
      name: "Tipo de Problema",
      fieldName: "TipoDeProblema",
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      onRender: (item: Obira) => renderWithTooltip(item.TipoDeProblema),
    },
    {
      key: "subkpi",
      name: "SubKPI afectado",
      minWidth: 100,
      maxWidth: 100,
      isResizable: true,
      onRender: (item: Obira) => renderWithTooltip(item.SubKPIAfectado?.Title),
    },
    // {
    //   key: "fechaResolucion",
    //   name: "Fecha Resolución",
    //   minWidth: 100,
    //   maxWidth: 150,
    //   isResizable: true,
    //   onRender: (item: Obira) => {
    //     if (obiraFlags[item.Id]?.hasAcciones && accionesPorObira[item.Id]) {
    //       const hoy = new Date();
    //       const fechas = accionesPorObira[item.Id]
    //         .map((accion: any) => accion.FechaImplementacion)
    //         .filter((fecha: Date) => !!fecha);
    //       if (fechas.length > 0) {
    //         fechas.sort(
    //           (a, b) =>
    //             Math.abs(hoy.getTime() - new Date(a).getTime()) -
    //             Math.abs(hoy.getTime() - new Date(b).getTime())
    //         );
    //         const fechaCercana = fechas[0];
    //         return renderWithTooltip(
    //           new Date(fechaCercana).toLocaleDateString()
    //         );
    //       }
    //     }
    //     return "";
    //   },
    // },
    {
      key: "gestionAnormalidades",
      name: "Gestión de anormalidades",
      minWidth: 30,
      maxWidth: 30,
      isResizable: true,
      onRender: (item: Obira) =>
        obiraFlags[item.Id]?.hasAnormalidades ? (
          <Image
            src={checkCelesteIcon}
            alt="Gestión de anormalidades"
            width={16}
            height={16}
          />
        ) : null,
    },
    {
      key: "accionesdefinitivas",
      name: "Acciones Definitivas",
      minWidth: 30,
      maxWidth: 30,
      isResizable: true,
      onRender: (item: Obira) =>
        obiraFlags[item.Id]?.hasAcciones ? (
          <Image
            src={checkCelesteIcon}
            alt="Acciones Definitivas"
            width={16}
            height={16}
          />
        ) : null,
    },
    {
      key: "estadoGeneral",
      name: "Estado General",
      fieldName: "EstadoGeneral",
      minWidth: 80,
      maxWidth: 120,
      isResizable: true,
      onRender: (item: Obira) => renderWithTooltip(item.EstadoGeneral),
    },
  ];

  return (
    <Stack className={styles.stack}>
      <Stack.Item className={styles.header}>
        <BackButton onClick={!restaurarItems ? handleBack : handleBackRestaurarItems} />
        <h1 className={styles.title}>
          {`Listado de Ítems ${!restaurarItems ? "" : "eliminados"} | `}
          {decodeURIComponent(proveedorNombre || "")
            .replace(/-/g, " ")
            .toUpperCase()}
        </h1>
      </Stack.Item>

      <Stack className={styles.containerStack} tokens={stackTokens}>
        <Stack.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            {!restaurarItems ? (
              <>
                <CustomButton
                  text="Recargar"
                  variant="green"
                  iconSrc={recargarIcon}
                  iconAlt="Recargar"
                  iconPosition="left"
                  onClick={handleRecargar}
                />
                <CustomButton
                  text="Filtros"
                  variant="green"
                  iconSrc={filtroIcon}
                  iconAlt="Filtros"
                  iconPosition="left"
                  onClick={() => setIsFilterPanelOpen(true)}
                />
                <ExportarExcel
                  selectedItems={getSelectedItems()}
                  pageSize={filteredObiras.length}
                  maxExport={300}
                />
                <CustomButton
                  text="Planes de acción"
                  variant="green"
                  onClick={() => Utils.openInNewTab(planesUrl)}
                />
                {userRole === Roles.Administradores && (
                  <CustomButton
                    text="Ítems eliminados"
                    variant="green"
                    onClick={onItemsEliminadosClick}
                  />
                )}
                {userRole !== Roles.Consultores && (
                  <CustomButton
                    text="Cargar Ítem"
                    variant="purple"
                    iconSrc={agregarIcon}
                    iconAlt="Cargar Ítem"
                    iconPosition="left"
                    onClick={handleCargarObira}
                  />
                )}
              </>
            ) : (
              <>
                {isPopupDeAccionesOpen && (
                  <PopupDeAcciones
                    accion={
                      !hayItemSeleccionado
                        ? Accion.RESTAURAR_INCOMPLETO
                        : Accion.RESTAURAR
                    }
                    isOpen={isPopupDeAccionesOpen}
                    setIsOpen={setIsPopupDeAccionesOpen}
                    onDismiss={() => setIsPopupDeAccionesOpen(false)}
                    handleConfirmacion={
                      !hayItemSeleccionado && (() => setIsPopupDeAccionesOpen(false))
                    }
                    handleConfirmacionAsync={hayItemSeleccionado && onRestaurarItemsClick}
                  />
                )}
                <CustomButton
                  text="Restaurar ítems"
                  variant="green"
                  onClick={() => setIsPopupDeAccionesOpen(true)}
                />
              </>
            )}
          </div>
        </Stack.Item>
      </Stack>

      {loading && (
        <Stack.Item>
          <div
            className={styles.loading}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              minHeight: 120,
            }}
          >
            <Spinner size={3} />
            <span style={{ fontSize: 16, color: "#01225e", marginTop: 8 }}>
              Buscando resultados...
            </span>
          </div>
        </Stack.Item>
      )}

      {!loading && (
        <Stack.Item style={{ width: "100%", marginTop: "2rem" }}>
          <DetailsList
            items={paginatedItems}
            columns={columns}
            selectionMode={SelectionMode.multiple}
            selection={SelectObira.current}
            selectionPreservedOnEmptyClick={true}
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
            checkboxVisibility={CheckboxVisibility.always}
            onRenderRow={(props) => {
              if (!props) return null;
              const isLast = props.item?.Id === lastClickedId;
              return (
                <DetailsRow
                  {...props}
                  className={`${props.className ?? ""} ${
                    isLast ? styles.lastClickedRow : ""
                  }`}
                />
              );
            }}
          />

          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Paginado
              currentPage={currentPage}
              totalPages={Math.max(1, Math.ceil(filteredObiras.length / pageSize))}
              onPageChange={setCurrentPage}
            />
          </div>
        </Stack.Item>
      )}

      {/* Panel de filtros */}
      <ObiraFiltro
        isOpen={isFilterPanelOpen}
        onCancel={() => setIsFilterPanelOpen(false)}
        obiras={obiras}
        obiraFlags={obiraFlags}
        onChange={handleFiltroChange}
        onStartLoading={() => setLoading(true)}
        onEndLoading={() => setLoading(false)}
        resetFiltersSignal={resetFiltersSignal}
        
      />
    </Stack>
  );
};

export default ObiraLista;
