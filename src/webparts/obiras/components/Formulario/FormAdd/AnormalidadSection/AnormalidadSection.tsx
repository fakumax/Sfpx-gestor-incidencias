import * as React from "react";
import moment from "moment";
import { Stack, TextField, DatePicker, DayOfWeek, Dropdown } from "@fluentui/react";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { IAnormalidadSectionProps, IDropdownOptionAnormalidad } from "./types";
import { CustomButton } from "../../../../../../core/ui/components";
import FilesComponent from "../../../Files/FilesComponent";
import agregarIcon from "../../../../../../core/ui/icons/AgregarIcon.svg";
import { IFileAdd } from "../../Formulario";
import styles from "../FormAdd.module.scss";
import { datePickerStrings, formatDate } from "../../../../../../core/utils/dateUtils";
import { useUserContext } from "../../../../../../core/context/UserContext";
import { GestionAnormalidadDataSource } from "../../../../../../core/api/GestionAnormalidad/GestionAnormalidadDataSource";
import { IAnormalidades } from "../../IFormulario";
import {
  renderDropdownOptionWithTooltip,
  renderDropdownTitleWithTooltip,
} from "../../helpers/helperForm";

export const AnormalidadSection: React.FC<IAnormalidadSectionProps> = ({
  anormalidadesData,
  handleAnormalidadesChange,
  peoplePickerContext,
  errorsAnormalidades,
  fechaOcurrencia,
  isProveedorInterno= false,
}) => {
  const { isAdmin, group, listasAsociadas } = useUserContext();
  const [anormalidades, setAnormalidades] =
    React.useState<IAnormalidades[]>(anormalidadesData);

  React.useEffect(() => {
    setAnormalidades(anormalidadesData);
  }, [anormalidadesData]);

  React.useEffect(() => {
    if (fechaOcurrencia) {
      setAnormalidades((prev) => {
        const updated = prev.map((anormalidad) => {
          if (
            anormalidad.FechaRealizacion &&
            moment(anormalidad.FechaRealizacion).isBefore(fechaOcurrencia, "day")
          ) {
            return {
              ...anormalidad,
              FechaRealizacion: undefined,
            };
          }
          return anormalidad;
        });
        handleAnormalidadesChange(updated);
        return updated;
      });
    }
  }, [fechaOcurrencia]);

  const handleAdd = () => {
    const newAnormalidad: IAnormalidades = {
      InternalId: anormalidades.length + 1,
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
      isNewResponsableSeguimiento: true,
    };

    setAnormalidades((prev) => [...prev, newAnormalidad]);
    handleAnormalidadesChange([...anormalidades, newAnormalidad]);
  };

  const handleDelete = (internalId: number) => {
    setAnormalidades((prev) => {
      const updated = prev.map((anormalidad) =>
        anormalidad.InternalId === internalId
          ? { ...anormalidad, deleted: true }
          : anormalidad
      );
      handleAnormalidadesChange(updated);
      return updated;
    });
  };

  const handleAnormalidadChange = (index: number, field: string, value: any) => {
    setAnormalidades((prev) => {
      const updated = [...prev];
      const anormalidadToChange = updated.find(
        (anormalidad) => anormalidad.InternalId === index
      );
      if (anormalidadToChange) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            anormalidadToChange[field] = {
              EMail: value[0].secondaryText || "",
              Id: value[0].id || 0,
            };
          } else {
            anormalidadToChange[field] = { EMail: "", Id: 0 };
          }
        } else {
          anormalidadToChange[field] = value;
        }
      }
      handleAnormalidadesChange(updated);
      return updated;
    });
  };

  const handleFiles = (index: number, files: IFileAdd[]) => {
    setAnormalidades((prev) => {
      const updated = [...prev];
      const anormalidadToChange = updated.find(
        (anormalidad) => anormalidad.InternalId === index
      );
      if (anormalidadToChange) {
        anormalidadToChange.Files = files;
        anormalidadToChange.modified = true;
      }
      handleAnormalidadesChange(updated);
      return updated;
    });
  };

  const [dropdownOptions, setDropdownOptions] =
    React.useState<IDropdownOptionAnormalidad>({
      statusOptions: [],
    });

  React.useEffect(() => {
    const loadChoiceFields = async () => {
      try {
        if (!listasAsociadas || !listasAsociadas.gestiones) {
          return;
        }

        const gestionAnormalidadDataSource = new GestionAnormalidadDataSource(
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
      } catch (error) {
        console.error("Error al cargar los campos choice de anormalidades:", error);
      }
    };

    loadChoiceFields();
  }, [listasAsociadas]);

  const renderDatePicker = (anormalidad: IAnormalidades, idx: number) => {
    const dateValue = anormalidad.FechaRealizacion?.toDate();
    const minDateValue = fechaOcurrencia?.toDate();

    return (
      <>
        <label className={styles.labelField}>
          <span className={styles.requiredAsterisk}>* </span>
          Fecha de finalización
        </label>
        <DatePicker
          value={dateValue}
          onSelectDate={(date) => {
            if (!date) {
              handleAnormalidadChange(
                anormalidad.InternalId,
                "FechaRealizacion",
                undefined
              );
              return;
            }

            const selectedMoment = moment(date);
            if (fechaOcurrencia && !selectedMoment.isBefore(fechaOcurrencia, "day")) {
              handleAnormalidadChange(
                anormalidad.InternalId,
                "FechaRealizacion",
                selectedMoment
              );
            }
          }}
          firstDayOfWeek={DayOfWeek.Sunday}
          strings={datePickerStrings}
          formatDate={formatDate}
          placeholder="Seleccionar una fecha"
          minDate={minDateValue}
          disabled={!fechaOcurrencia}
        />
      </>
    );
  };

  return (
    <Stack.Item>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <CustomButton
          text="Agregar"
          variant="purple"
          iconSrc={agregarIcon}
          iconAlt="Agregar"
          iconPosition="left"
          onClick={handleAdd}
          outline
        />
      </div>

      {anormalidades
        .filter((a) => !a.deleted)
        .map((anormalidad, idx) => {
          return (
            <React.Fragment key={anormalidad.InternalId}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "16px",
                }}
              >
                <CustomButton
                  text="Eliminar"
                  variant="blueDark"
                  onClick={() => handleDelete(anormalidad.InternalId)}
                />
              </div>

              <div className={styles.gridContainer}>
                <Dropdown
                  required
                  label="Status"
                  placeholder="Seleccionar una opción"
                  options={dropdownOptions.statusOptions}
                  selectedKey={anormalidad.Status}
                  onChange={(_, option) =>
                    handleAnormalidadChange(anormalidad.InternalId, "Status", option?.key)
                  }
                  onRenderOption={renderDropdownOptionWithTooltip}
                  onRenderTitle={renderDropdownTitleWithTooltip}
                  errorMessage={errorsAnormalidades && errorsAnormalidades[idx]?.Status}
                />

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
                    onChange={(items) =>
                      handleAnormalidadChange(
                        anormalidad.InternalId,
                        "Responsable",
                        items
                      )
                    }
                    defaultSelectedUsers={[anormalidad.Responsable.EMail]}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={1000}
                  />
                  {errorsAnormalidades && errorsAnormalidades[idx]?.Responsable && (
                    <span
                      style={{
                        color: "#a4262c",
                        fontSize: 12,
                        marginTop: "2px",
                      }}
                    >
                      {errorsAnormalidades[idx]?.Responsable}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <div className={styles.labelFieldContainer}>
                    {renderDatePicker(anormalidad, idx)}
                    {errorsAnormalidades &&
                      errorsAnormalidades[idx]?.FechaRealizacion && (
                        <span
                          style={{
                            color: "#a4262c",
                            fontSize: 12,
                            marginTop: "2px",
                          }}
                        >
                          {errorsAnormalidades[idx].FechaRealizacion}
                        </span>
                      )}
                  </div>
                </div>
                
                {!isProveedorInterno && (
                <div className={styles.labelFieldContainer}>
                  <label className={styles.labelField}>
                    <span className={styles.requiredAsterisk}>* </span>
                    Responsable Seguimiento
                  </label>
                  <PeoplePicker
                    context={peoplePickerContext}
                    ensureUser
                    placeholder="Seleccionar un responsable"
                    personSelectionLimit={1}
                    onChange={(items) =>
                      handleAnormalidadChange(
                        anormalidad.InternalId,
                        "ResponsableSeguimiento",
                        items
                      )
                    }
                    defaultSelectedUsers={[anormalidad.ResponsableSeguimiento.EMail]}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={1000}
                  />
                  {errorsAnormalidades &&
                    errorsAnormalidades[idx]?.ResponsableSeguimiento && (
                      <span
                        style={{
                          color: "#a4262c",
                          fontSize: 12,
                          marginTop: "2px",
                        }}
                      >
                        {errorsAnormalidades[idx]?.ResponsableSeguimiento}
                      </span>
                    )}
                </div>
                )}
              </div>
                
              <div className={styles.gridContainer}>
                <div className={styles.doubleColumn}>
                  <div className={styles.labelFieldContainer}>
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
                          anormalidad.InternalId,
                          "AccionesATomar",
                          value || ""
                        )
                      }
                      onBlur={(e) => {
                        const cleanValue = anormalidad.AccionesATomar?.trim() || "";
                        if (cleanValue === ".") {
                          handleAnormalidadChange(
                            anormalidad.InternalId,
                            "AccionesATomar",
                            ""
                          );
                        } else {
                          handleAnormalidadChange(
                            anormalidad.InternalId,
                            "AccionesATomar",
                            cleanValue
                          );
                        }
                      }}
                      errorMessage={
                        errorsAnormalidades && errorsAnormalidades[idx]?.AccionesATomar
                      }
                    />
                  </div>
                </div>
                <div className={styles.doubleColumn}>
                  <TextField
                    label="Comentarios"
                    placeholder="Ingresar comentarios"
                    multiline
                    rows={6}
                    value={anormalidad.Comentarios}
                    onChange={(_, value) =>
                      handleAnormalidadChange(
                        anormalidad.InternalId,
                        "Comentarios",
                        value
                      )
                    }
                    onBlur={() => {
                      const cleanValue = anormalidad.Comentarios?.trim() || "";
                      handleAnormalidadChange(
                        anormalidad.InternalId,
                        "Comentarios",
                        cleanValue
                      );
                    }}
                  />
                </div>
              </div>
              <div className={styles.gridContainer}>
                <div className={styles.fullWidth}>
                  <FilesComponent
                    files={anormalidad.Files}
                    setFiles={(files) => handleFiles(anormalidad.InternalId, files)}
                  />
                </div>
              </div>
            </React.Fragment>
          );
        })}
    </Stack.Item>
  );
};
