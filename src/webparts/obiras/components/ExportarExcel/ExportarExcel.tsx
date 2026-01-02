import * as React from "react";
import ObiraDataSource from "../../../../core/api/Obira/ObiraDataSource";
import { CustomButton } from "../../../../core/ui/components";
import { getAnormalidadesPorObiraIdsFull } from "../../services/anormalidad-service";
import { getAccionesPorObiraIdsFull } from "../../services/accion-service";
import { useUserContext } from "../../../../core/context/UserContext";
import { ESTADO_ITEM } from "../../../../core/utils/Constants";
import User from "../../../../core/entities/User";

const parsearFechaDeRepeticionDelProblema = (jsonString: string): string => {
  // helper para intentar parsear y, si falla, normalizar comillas simples
  const safeParse = (s: string) => {
    try {
      return JSON.parse(s);
    } catch {
      // fallback simple: reemplazar comillas simples por dobles
      // (sirve si los textos no traen apóstrofes)
      const normalized = s.replace(/'/g, '"');
      return JSON.parse(normalized);
    }
  };

  try {
    const data = safeParse(jsonString) as Array<{
      fecha: string;
      qty: string;
      comentarios: string;
      pad?: { key: string | number; name: string } | null;
    }>;

    if (!Array.isArray(data) || data.length === 0) return "N/A";

    return data
      .map((item) => {
        const d = new Date(item.fecha);
        const fechaFormateada = !isNaN(d.valueOf())
          ? d.toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "N/A";

        const cantidad = item.qty?.trim() ? item.qty : "N/A";
        const pad = item.pad?.name ? item.pad.name : "N/A";
        const comentarios = item.comentarios?.trim() ? item.comentarios : "N/A";

        return `Fecha: ${fechaFormateada} - Cantidad: ${cantidad} - PAD: ${pad} - Comentarios: ${comentarios}`;
      })
      .join("\n");
  } catch (error) {
    console.error("Error al parsear Fechas de repetición del problema.", error);
    return "Formato inválido";
  }
};
interface ExportarExcelProps {
  selectedItems: any[];
  pageSize: number;
  maxExport: number;
}

const ExportarExcel: React.FC<ExportarExcelProps> = ({
  selectedItems,
  pageSize,
  maxExport,
}) => {
  const { listasAsociadas } = useUserContext();
  const [allObiras, setAllObiras] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (allObiras.length === 0 && listasAsociadas?.obiras) {
      const ds = new ObiraDataSource(listasAsociadas.obiras);
      ds.getFilteredItems(`Activo eq ${ESTADO_ITEM.ACTIVO}`).then((all) =>
        setAllObiras(all.slice(0, maxExport))
      );
    }
  }, [listasAsociadas, allObiras.length]);

  const handleExport = async () => {
    let itemsToExport = selectedItems;
    if (!selectedItems || selectedItems.length === 0) {
      if (!allObiras || allObiras.length === 0) {
        return;
      }
      itemsToExport = allObiras.slice(0, maxExport);
    }
    if (
      !listasAsociadas?.obiras ||
      !listasAsociadas?.gestiones ||
      !listasAsociadas?.acciones
    ) {
      return;
    }
    const obiraIds = itemsToExport.map((item) => item.Id);
    const [anormalidades, acciones] = await Promise.all([
      getAnormalidadesPorObiraIdsFull(obiraIds, listasAsociadas.gestiones),
      getAccionesPorObiraIdsFull(obiraIds, listasAsociadas.acciones),
    ]);
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const pad = (n) => (n < 10 ? `0${n}` : n);
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    };

    const anormalidadKeysOrdered = [
      {
        key: "AccionesATomar",
        header: "Acciones a tomar para minimizar el impacto",
      },
      { key: "Responsable", header: "Responsable" },
      { key: "FechaDeFinalizacion", header: "Fecha de finalización" },
      {
        key: "ResponsableSeguimiento",
        header: "Responsable Seguimiento",
      },
      { key: "Status", header: "Status" },
      { key: "Comentarios", header: "Comentarios" },
    ];
    const accionKeysOrdered = [
      { key: "CausaRaiz", header: "Causa raíz" },
      { key: "TipoCausaRaiz", header: "Tipo de causa raíz" },
      { key: "Contramedida", header: "Contramedida" },
      { key: "Responsable", header: "Responsable Acción" },
      { key: "ResponsableSeguimiento", header: "Responsable Seguimiento Acción" },
      {
        key: "FechaImplementacion",
        header: "Fecha de implementación de contramedida",
      },
      { key: "StatusAccion", header: "Status Acción definitiva" },
      { key: "MetodoEstandarizacion", header: "Método de estandarización" },
      { key: "FechaCierre", header: "Fecha de cierre (luego de seguimiento)" },
      { key: "AplicaTransversalizacion", header: "Aplica Transversalización " },
      { key: "AQueEquipos", header: "¿A qué equipos?" },
      {
        key: "FechaFinTransversalizacion",
        header: "Fecha (fin de la transversalizacion)",
      },
      { key: "StatusTransversalizacion", header: "Status transversalización" },
      { key: "Comentarios", header: "Comentarios Acción" },
    ];

    const obiraHeaders = [
      "Id Ítem",
      "Fase",
      "Equipo",
      "Bloque",
      "PAD",
      "Fecha de ocurrencia del problema",
      "Tipo de problema",
      "Título del Problema",
      "Detalle",
      "Sub KPI afectado",
      "QTY",
      "Unidad",
      "Fechas de repetición del problema",
      "Causa raíz preliminar",
      "Etiquetas",
      "Acción inmediata",
      "Responsable Ítem",
      "Link Al Plan",
      "Estado General",
    ];

    const dataRows = [];
    for (const item of itemsToExport) {
      const anormalidadesObira = anormalidades.filter((a) => a.IDObiraId === item.Id);
      const accionesObira = acciones.filter((a) => a.ObirasId === item.Id);
      const maxRows = Math.max(anormalidadesObira.length, accionesObira.length, 1);
      for (let i = 0; i < maxRows; i++) {
        let row = {};
        obiraHeaders.forEach((h) => {
          row[h] = (() => {
            switch (h) {
              case "Id Ítem":
                return item.Id;
              case "Fase":
                return item.Etapa;
              case "Equipo":
                return item.Equipo?.Title || "";
              case "Bloque":
                return item.Bloque?.AREA || "";
              case "PAD":
                return item.PADLocacion?.Title || "";
              case "Fecha de ocurrencia del problema":
                return formatDate(item.FechaDeOcurrenciaDelProblema);
              case "Tipo de problema":
                return item.TipoDeProblema;
              case "Título del Problema":
                return item.TituloDelProblema;
              case "Detalle":
                return item.Detalle;
              case "Sub KPI afectado":
                return item.SubKPIAfectado?.Title || "";
              case "QTY":
                return item.QTY;
              case "Unidad":
                return item.Unidad;
              case "Fechas de repetición del problema":
                return parsearFechaDeRepeticionDelProblema(
                  item.FechaDeRepeticionDelProblema
                );
              case "Causa raíz preliminar":
                return item.CausaRaizPreliminar;
              case "Etiquetas":
                return item.Etiquetas && Array.isArray(item.Etiquetas)
                  ? item.Etiquetas.map((et) => et.Title).join(", ")
                  : "";
              case "Acción inmediata":
                return item.AccionInmediata;
              case "Responsable Ítem":
                return (
                  item.ResponsableItem?.length > 0 
                    ? item.ResponsableItem
                      .map((u: User) => u?.Name?.trim() || '')
                      .join(' \n')
                    : ''
                );
              case "Link Al Plan":
                return item.LinkAlPlan;
              case "Estado General":
                return item.EstadoGeneral;
              default:
                return "";
            }
          })();
        });
        anormalidadKeysOrdered.forEach(({ key, header }) => {
          let value = anormalidadesObira[i]?.[key];
          if (key === "FechaDeFinalizacion" || key === "FechaRealizacion") {
            row[header] = formatDate(value) ?? "";
          } else if (key === "Responsable" || key === "ResponsableSeguimiento") {
            row[header] = value?.Name || value?.EMail || value || "";
          } else {
            row[header] = value ?? "";
          }
        });
        accionKeysOrdered.forEach(({ key, header }) => {
          let value = accionesObira[i]?.[key];
          if (
            key === "FechaImplementacion" ||
            key === "FechaCierre" ||
            key === "FechaFinTransversalizacion"
          ) {
            row[header] = formatDate(value) ?? "";
          } else if (key === "Responsable" || key === "ResponsableSeguimiento") {
            row[header] = value?.Name || value?.EMail || value || "";
          } else {
            row[header] = value ?? "";
          }
        });
        dataRows.push(row);
      }
    }

    const obiraCols = obiraHeaders.length;
    const anormCols = anormalidadKeysOrdered.length;
    const accionCols = accionKeysOrdered.length;
    const bloqueRow = [
      "Bloque: Obira",
      ...Array(obiraCols - 1).fill(""),
      "Bloque: Gestión de anormalidades",
      ...Array(anormCols - 1).fill(""),
      "Bloque: Acciones definitivas",
      ...Array(accionCols - 1).fill(""),
    ];
    const headerRow = [
      ...obiraHeaders,
      ...anormalidadKeysOrdered.map((a) => a.header),
      ...accionKeysOrdered.map((a) => a.header),
    ];
    const exportRows = [
      bloqueRow,
      headerRow,
      ...dataRows.map((row) =>
        [
          ...obiraHeaders,
          ...anormalidadKeysOrdered.map((a) => a.header),
          ...accionKeysOrdered.map((a) => a.header),
        ].map((h) => row[h] ?? "")
      ),
    ];
    let proveedor = "";
    if (itemsToExport.length > 0) {
      proveedor = (itemsToExport[0].Proveedor || "").toUpperCase();
    }
    const fecha = new Date();
    const pad = (n) => (n < 10 ? `0${n}` : n);
    const sufijo = `${pad(fecha.getDate())}_${pad(
      fecha.getMonth() + 1
    )}_${fecha.getFullYear()}`;
    const fileName = `Obira ${proveedor} - ${sufijo}.xlsx`;
    import("xlsx").then((XLSX) => {
      const worksheet = XLSX.utils.aoa_to_sheet(exportRows);
      worksheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: obiraCols - 1 } },
        {
          s: { r: 0, c: obiraCols },
          e: { r: 0, c: obiraCols + anormCols - 1 },
        },
        {
          s: { r: 0, c: obiraCols + anormCols },
          e: { r: 0, c: obiraCols + anormCols + accionCols - 1 },
        },
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Obiras");
      XLSX.writeFile(workbook, fileName);
    });
    return;
  };

  return (
    <CustomButton
      text="Exportar a Excel"
      variant="green"
      iconPosition="left"
      onClick={handleExport}
    />
  );
};

export default ExportarExcel;
