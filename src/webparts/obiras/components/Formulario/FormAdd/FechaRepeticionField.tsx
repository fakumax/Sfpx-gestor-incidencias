import * as React from "react";
import {
  TextField,
  IconButton,
  Stack,
  DatePicker,
  Text,
  DetailsList,
  IColumn,
  SelectionMode,
  MessageBar,
  MessageBarType,
  TagPicker,
} from "@fluentui/react";
import styles from "./FormAdd.module.scss";
import { datePickerStrings } from "../../../../../core/utils/dateUtils";
import { CustomButton } from "../../../../../core/ui/components";
import agregarIcon from "../../../../../core/ui/icons/AgregarIcon.svg";
import { useUserContext } from "../../../../../core/context/UserContext";
import { Lista } from "../../../../../core/utils/Constants";
import LocacionDatasource from "../../../../../core/api/Locacion/LocacionDataSource";

interface FechaRepeticionItem {
  fecha: string;
  qty: string;
  pad?: { key: string | number; name: string } | null;
  comentarios: string;
}

interface FechaRepeticionFieldProps {
  value: string | FechaRepeticionItem[];
  onChange: (newValue: string) => void;
  setIsValidFechaDeRepeticionDelProblema: React.Dispatch<React.SetStateAction<boolean>>;
}

const getArray = (value: string | FechaRepeticionItem[]): FechaRepeticionItem[] => {
  if (!value) return [];
  try {
    if (Array.isArray(value)) return value as FechaRepeticionItem[];
    const arr = JSON.parse(value as string);
    if (Array.isArray(arr) && typeof arr[0] === "object") {
      return arr.map((item: any) => ({
        ...item,
        qty: item.qty !== undefined ? String(item.qty) : "",
      }));
    }
    if (Array.isArray(arr) && typeof arr[0] === "string") {
      return arr.map((fecha: string) => ({ fecha, qty: "", comentarios: "" }));
    }
    return [];
  } catch {
    if (typeof value === "string") {
      return (value as string)
        .split("\n")
        .filter(Boolean)
        .map((fecha) => ({ fecha, qty: "", comentarios: "" }));
    }
    return [];
  }
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const FechaRepeticionList: React.FC<FechaRepeticionFieldProps> = ({
  value,
  onChange,
  setIsValidFechaDeRepeticionDelProblema,
}) => {
  const arr = getArray(value);
  const [editingIdx, setEditingIdx] = React.useState<number | null>(null);
  const [editingItem, setEditingItem] = React.useState<FechaRepeticionItem | null>(null);
  const [adding, setAdding] = React.useState(false);
  const [mostrarGuardar, setMostrarGuardar] = React.useState(false);

  const { isConsultor } = useUserContext();

  const handleEdit = (idx: number) => {
    setMostrarGuardar(Boolean(arr[idx].fecha && arr[idx].qty && arr[idx].comentarios));
    setEditingIdx(idx);
    setEditingItem({ ...arr[idx] });
    setPadTagsEdit(arr[idx].pad ? [arr[idx].pad] : []);
  };
  const handleEditChange = (field: keyof FechaRepeticionItem, value: any) => {
    if (!editingItem) return;
    const nuevoItem = { ...editingItem, [field]: value };
    setEditingItem(nuevoItem);
    if (field === "pad") {
      setPadTagsEdit(value ? [value] : []);
    }
    setMostrarGuardar(Boolean(nuevoItem.fecha && nuevoItem.qty && nuevoItem.comentarios));
  };
  const handleEditSave = () => {
    if (editingIdx === null || !editingItem) return;
    const newArr = arr.map((item, i) => (i === editingIdx ? editingItem : item));
    onChange(JSON.stringify(newArr));
    setEditingIdx(null);
    setEditingItem(null);
    setMostrarGuardar(false);
  };
  const handleEditCancel = () => {
    setEditingIdx(null);
    setEditingItem(null);
    setMostrarGuardar(false);
  };

  const [newItem, setNewItem] = React.useState<FechaRepeticionItem>({
    fecha: "",
    qty: "0",
    pad: null,
    comentarios: "",
  });
  const [padTagsAdd, setPadTagsAdd] = React.useState<any[]>([]);
  const [padTagsEdit, setPadTagsEdit] = React.useState<any[]>([]);
  const handleAddRow = () => {
    setAdding(true);
    setNewItem({ fecha: "", qty: "0", comentarios: "" });
    setMostrarGuardar(false);
  };
  const handleAddChange = (field: keyof FechaRepeticionItem, value: any) => {
    setNewItem({ ...newItem, [field]: value });
    if (field === "pad") {
      setPadTagsAdd(value ? [value] : []);
    }
  };
  const handleAddSave = () => {
    if (!mostrarGuardar) return;
    const newArr = [...arr, newItem];
    onChange(JSON.stringify(newArr));
    setAdding(false);
    setNewItem({ fecha: "", qty: "0", pad: null, comentarios: "" });
    setPadTagsAdd([]);
    setMostrarGuardar(false);
  };
  const handleAddCancel = () => {
    setAdding(false);
    setNewItem({ fecha: "", qty: "0", pad: null, comentarios: "" });
    setPadTagsAdd([]);
    setMostrarGuardar(false);
  };

  React.useEffect(() => {
    setMostrarGuardar(Boolean(newItem.fecha && newItem.qty && newItem.comentarios));
  }, [newItem]);

  React.useEffect(() => {
    setIsValidFechaDeRepeticionDelProblema(!mostrarGuardar);
  }, [mostrarGuardar]);

  const columns: IColumn[] = [
    {
      key: "col_fecha",
      name: "Fecha",
      fieldName: "fecha",
      minWidth: 160,
      maxWidth: 180,
      isResizable: true,
      onRender: (item: FechaRepeticionItem, idx?: number) => {
        if (adding && idx === arr.length) {
          return (
            <DatePicker
              strings={datePickerStrings}
              placeholder="Seleccionar fecha"
              isRequired={true}
              value={newItem.fecha ? new Date(newItem.fecha) : null}
              onSelectDate={(date) =>
                handleAddChange("fecha", date ? date.toISOString() : "")
              }
              firstDayOfWeek={1}
              style={{ width: "100%" }}
              formatDate={(date) => {
                if (!date) return "";
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
              }}
              maxDate={new Date()}
            />
          );
        }
        if (editingIdx === idx && editingItem) {
          return (
            <DatePicker
              strings={datePickerStrings}
              placeholder="Seleccionar fecha"
              isRequired={true}
              value={editingItem.fecha ? new Date(editingItem.fecha) : null}
              onSelectDate={(date) =>
                handleEditChange("fecha", date ? date.toISOString() : "")
              }
              firstDayOfWeek={1}
              style={{ width: "100%" }}
              formatDate={(date) => {
                if (!date) return "";
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
              }}
              maxDate={new Date()}
            />
          );
        }
        return formatDate(item.fecha);
      },
    },
    {
      key: "col_qty",
      name: "QTY de la Repetición",
      fieldName: "qty",
      minWidth: 150,
      maxWidth: 180,
      isResizable: true,
      onRender: (item: FechaRepeticionItem, idx?: number) => {
        const isEditing =
          (adding && idx === arr.length) || (editingIdx === idx && editingItem);
        const value = isEditing
          ? adding && idx === arr.length
            ? newItem.qty === undefined || newItem.qty === null
              ? ""
              : newItem.qty.toString()
            : editingItem &&
              (editingItem.qty === undefined || editingItem.qty === null
                ? ""
                : editingItem.qty.toString())
          : item.qty?.toString() ?? "";
        const onChange = (_: any, v?: string) => {
          if (v === undefined) return;
          if (/^\d*(\.|,)?\d{0,2}$/.test(v) && !v.startsWith("-")) {
            if (isEditing) {
              if (adding && idx === arr.length) {
                handleAddChange("qty", v);
              } else if (editingIdx === idx && editingItem) {
                handleEditChange("qty", v);
              }
            }
          }
        };
        const onBlur = () => {
          let v = value;
          if (v) {
            let num = parseFloat(v.replace(/,/g, "."));
            if (!isNaN(num) && num >= 0) {
              if (isEditing) {
                if (adding && idx === arr.length) {
                  handleAddChange("qty", num.toFixed(2));
                } else if (editingIdx === idx && editingItem) {
                  handleEditChange("qty", num.toFixed(2));
                }
              }
            } else if (num < 0) {
              if (isEditing) {
                if (adding && idx === arr.length) {
                  handleAddChange("qty", "0");
                } else if (editingIdx === idx && editingItem) {
                  handleEditChange("qty", "0");
                }
              }
            }
          }
        };
        if (isEditing) {
          return (
            <TextField
              required
              type="number"
              step="0.01"
              min={0}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Ingresar QTY"
              styles={{ field: { width: "100%" } }}
              inputMode="decimal"
              maxLength={10}
            />
          );
        }
        let num = parseFloat(item.qty?.toString().replace(/,/g, "."));
        return !isNaN(num)
          ? num.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })
          : item.qty?.toString() ?? "";
      },
    },
    {
      key: "col_pad",
      name: "PAD",
      fieldName: "pad",
      minWidth: 180,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: FechaRepeticionItem, idx?: number) => {
        const isEditing =
          (adding && idx === arr.length) || (editingIdx === idx && editingItem);
        if (isEditing) {
          const resolveSuggestions = async (filter: string, tagList: any[]) => {
            if (!filter || filter.length < 3) return [];
            const ds = new LocacionDatasource(Lista.Locaciones);
            const locaciones = await ds.getFilteredItems(
              `substringof('${filter}', Title)`
            );
            const selectedKeys = (tagList || []).map((t) => t.key);
            return (locaciones || [])
              .filter((loc: any) => !selectedKeys.includes(loc.Id))
              .map((loc: any) => ({ key: loc.Id, name: loc.Title }));
          };
          return (
            <TagPicker
              onResolveSuggestions={resolveSuggestions}
              selectedItems={adding && idx === arr.length ? padTagsAdd : padTagsEdit}
              onChange={(tags: any[]) => {
                if (adding && idx === arr.length) {
                  handleAddChange("pad", tags && tags.length > 0 ? tags[0] : null);
                  setPadTagsAdd(tags || []);
                } else if (editingIdx === idx && editingItem) {
                  setPadTagsEdit(tags || []);
                  handleEditChange("pad", tags && tags.length > 0 ? tags[0] : null);
                }
              }}
              inputProps={{
                placeholder: "Buscar PAD (mínimo 3 letras)",
                className: styles.padInputWhite,
              }}
              pickerSuggestionsProps={{
                suggestionsHeaderText: "",
                noResultsFoundText: "Sin resultados",
              }}
              itemLimit={1}
            />
          );
        }
        return item.pad?.name || "";
      },
    },
    {
      key: "col_comentarios",
      name: "Comentarios",
      fieldName: "comentarios",
      minWidth: 400,
      maxWidth: 460,
      isResizable: true,
      onRender: (item: FechaRepeticionItem, idx?: number) => {
        if (adding && idx === arr.length) {
          return (
            <TextField
              required
              value={newItem.comentarios}
              onChange={(_, v) => handleAddChange("comentarios", v || "")}
              placeholder="Pozo-Explicación"
              multiline
              autoAdjustHeight
              styles={{ field: { width: "100%", minHeight: 40 } }}
            />
          );
        }
        if (editingIdx === idx && editingItem) {
          return (
            <TextField
              required
              value={editingItem.comentarios}
              onChange={(_, v) => handleEditChange("comentarios", v || "")}
              placeholder="Comentarios"
              multiline
              autoAdjustHeight
              styles={{ field: { width: "100%", minHeight: 40 } }}
            />
          );
        }
        return (
          <div
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflow: "visible",
            }}
          >
            {item.comentarios}
          </div>
        );
      },
    },
    {
      key: "col_accion",
      name: "Acción",
      minWidth: 160,
      maxWidth: 180,
      onRender: (item: FechaRepeticionItem, idx?: number) => {
        if (isConsultor) return null;
        if (adding && idx === arr.length) {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {mostrarGuardar && (
                  <IconButton
                    iconProps={{ iconName: "Save" }}
                    title="Guardar"
                    ariaLabel="Guardar"
                    onClick={handleAddSave}
                    disabled={!newItem.fecha}
                  />
                )}
                <IconButton
                  iconProps={{ iconName: "Cancel" }}
                  title="Cancelar"
                  ariaLabel="Cancelar"
                  onClick={handleAddCancel}
                />
              </div>
              {mostrarGuardar && (
                <span style={{ color: "#af4045", marginTop: 4, textAlign: "left" }}>
                  No ha guardado los cambios.
                </span>
              )}
            </div>
          );
        }
        if (editingIdx === idx && editingItem) {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {mostrarGuardar && (
                  <IconButton
                    iconProps={{ iconName: "Save" }}
                    title="Guardar"
                    ariaLabel="Guardar"
                    onClick={handleEditSave}
                    disabled={!editingItem.fecha}
                  />
                )}
                <IconButton
                  iconProps={{ iconName: "Cancel" }}
                  title="Cancelar"
                  ariaLabel="Cancelar"
                  onClick={handleEditCancel}
                />
              </div>
              {mostrarGuardar && (
                <span style={{ color: "#af4045", marginTop: 4, textAlign: "left" }}>
                  No ha guardado los cambios.
                </span>
              )}
            </div>
          );
        }
        return (
          <span>
            <IconButton
              iconProps={{ iconName: "Edit" }}
              title="Editar"
              ariaLabel="Editar"
              onClick={() => handleEdit(idx!)}
            />
            <IconButton
              iconProps={{ iconName: "Delete" }}
              title="Eliminar"
              ariaLabel="Eliminar"
              onClick={() => onChange(JSON.stringify(arr.filter((_, i) => i !== idx)))}
            />
          </span>
        );
      },
    },
  ];

  const items = adding ? [...arr, newItem] : arr;

  return (
    <Stack style={{ position: "relative" }}>
      <label className={styles.labelField}>Fechas de repetición del problema</label>
      <DetailsList
        items={items}
        columns={columns}
        selectionMode={SelectionMode.none}
        styles={{
          root: {
            marginBottom: 16,
            maxHeight: "none",
            overflowY: "visible",
            overflowX: "visible",
          },
        }}
        compact
      />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
        {!isConsultor && (
          <CustomButton
            text="Agregar repetición problema"
            variant="purple"
            iconSrc={agregarIcon}
            iconAlt="Agregar"
            iconPosition="left"
            onClick={handleAddRow}
            disabled={adding || editingIdx !== null}
          />
        )}
        <span style={{ fontWeight: 500, fontSize: 16 }}>
          <strong>Total:</strong> {arr.length}
        </span>
      </div>
      <MessageBar
        messageBarType={MessageBarType.info}
        styles={{
          root: {
            marginTop: "1rem",
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
        Al ingresar una fecha, considerar su correspondencia con la Fecha de Ocurrencia.
      </MessageBar>
    </Stack>
  );
};
