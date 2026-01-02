import * as React from "react";
import {
  Stack,
  TextField,
  DatePicker,
  DayOfWeek,
  Dropdown,
  Checkbox,
} from "@fluentui/react";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { IAccionSectionProps, IDropdownOptionAccion } from "./types";
import agregarIcon from "../../../../../../core/ui/icons/AgregarIcon.svg";
import User from "../../../../../../core/entities/User";
import { IFileAdd } from "../../Formulario";
import { CustomButton } from "../../../../../../core";
import styles from "../FormAdd.module.scss";
import FilesComponent from "../../../Files/FilesComponent";
import { datePickerStrings, formatDate } from "../../../../../../core/utils/dateUtils";
import { useUserContext } from "../../../../../../core/context/UserContext";
import { AccionDefinitivaDataSource } from "../../../../../../core/api/AccionDefinitiva/AccionDefinitivaDataSource";
import { IAcciones } from "../../IFormulario";
import {
  renderDropdownOptionWithTooltip,
  renderDropdownTitleWithTooltip,
} from "../../helpers/helperForm";
import moment from "moment";

export const AccionSection: React.FC<IAccionSectionProps> = ({
  accionesData,
  handleAccionesChange,
  peoplePickerContext,
  errorsAcciones,
  fechaOcurrencia,
  isProveedorInterno = false,

}) => {
  const { isAdmin, group, listasAsociadas } = useUserContext();
  const [acciones, setAcciones] = React.useState<IAcciones[]>(accionesData);

  React.useEffect(() => {
    setAcciones(accionesData);
  }, [accionesData]);

  React.useEffect(() => {
    if (fechaOcurrencia) {
      setAcciones((prev) => {
        const updated = prev.map((accion) => {
          if (
            accion.FechaImplementacion &&
            moment(accion.FechaImplementacion).isBefore(fechaOcurrencia, "day")
          ) {
            return {
              ...accion,
              FechaImplementacion: undefined,
              FechaCierre: undefined,
              FechaFin: undefined,
            };
          }
          return accion;
        });
        handleAccionesChange(updated);
        return updated;
      });
    }
  }, [fechaOcurrencia]);

  const handleAdd = () => {
    const newAccion: IAcciones = {
      InternalId: acciones.length + 1,
      Id: 0,
      CausaRaiz: "",
      Contramedida: "",
      TipoCausaRaiz: "",
      Responsable: { EMail: "", Id: 0 },
      ResponsableSeguimiento: { EMail: "", Id: 0 },
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
      isNewResponsableSeguimiento: true,
    };
    setAcciones((prev) => [...prev, newAccion]);
    handleAccionesChange([...acciones, newAccion]);
  };

  const handleDelete = (internalId: number) => {
    setAcciones((prev) => {
      const updated = prev.map((accion) =>
        accion.InternalId === internalId ? { ...accion, deleted: true } : accion
      );
      handleAccionesChange(updated);
      return updated;
    });
  };

  const handleAccionDefinitivaChange = (
    internalId: number,
    field: string,
    value: any
  ) => {
    setAcciones((prev) => {
      const updated = [...prev];
      const accionToChange = updated.find((accion) => accion.InternalId === internalId);
      if (!accionToChange) return updated;

      if (Array.isArray(value)) {
        if (value.length > 0) {
          accionToChange[field] = {
            EMail: value[0].secondaryText || "",
            Id: value[0].id || 0,
          };
        } else {
          accionToChange[field] = { EMail: "", Id: 0 };
        }
      } else if (field === "Transversalizacion") {
        accionToChange.Transversalizacion = value as boolean;
        accionToChange.EquiposQueIntervienen = "";
        accionToChange.FechaFin = null;
        accionToChange.StatusTransversalizacion = "";
      } else {
        accionToChange[field] = value;
      }
      accionToChange["modified"] = true;
      handleAccionesChange(updated);
      return updated;
    });
  };

  const handleFiles = (internalId: number, files: IFileAdd[]) => {
    setAcciones((prev) => {
      const updated = [...prev];
      const accionToChange = updated.find((accion) => accion.InternalId === internalId);
      if (accionToChange) {
        accionToChange.Files = files;
        accionToChange.modified = true;
      }
      handleAccionesChange(updated);
      return updated;
    });
  };

  const [dropdownOptions, setDropdownOptions] = React.useState<IDropdownOptionAccion>({
    statusAccionDefinitivaOptions: [],
    tipoCausaRaizOptions: [],
    statusYokotenOptions: [],
  });

  React.useEffect(() => {
    const loadChoiceFields = async () => {
      try {
        if (!listasAsociadas || !listasAsociadas.acciones) {
          return;
        }

        const accionDefinitivaDataSource = new AccionDefinitivaDataSource(
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
      } catch (error) {
        console.error(
          "Error al cargar los campos choice de acciones definitivas:",
          error
        );
      }
    };

    loadChoiceFields();
  }, [listasAsociadas]);

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

      {acciones
        .filter((a) => !a.deleted)
        .map((accion, idx) => {
          return (
            <React.Fragment key={accion.InternalId}>
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
                  onClick={() => handleDelete(accion.InternalId)}
                />
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
                          accion.InternalId,
                          "CausaRaiz",
                          value || ""
                        )
                      }
                      onBlur={(e) => {
                        const cleanValue = accion.CausaRaiz?.trim() || "";
                        if (cleanValue === ".") {
                          handleAccionDefinitivaChange(
                            accion.InternalId,
                            "CausaRaiz",
                            ""
                          );
                        } else {
                          handleAccionDefinitivaChange(
                            accion.InternalId,
                            "CausaRaiz",
                            cleanValue
                          );
                        }
                      }}
                      errorMessage={errorsAcciones && errorsAcciones[idx]?.CausaRaiz}
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
                          accion.InternalId,
                          "Contramedida",
                          value || ""
                        )
                      }
                      onBlur={(e) => {
                        const cleanValue = accion.Contramedida?.trim() || "";
                        if (cleanValue === ".") {
                          handleAccionDefinitivaChange(
                            accion.InternalId,
                            "Contramedida",
                            ""
                          );
                        } else {
                          handleAccionDefinitivaChange(
                            accion.InternalId,
                            "Contramedida",
                            cleanValue
                          );
                        }
                      }}
                      errorMessage={errorsAcciones && errorsAcciones[idx]?.Contramedida}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.gridContainer}>
                <Dropdown
                  label="Tipo de causa Raíz"
                  required
                  options={dropdownOptions.tipoCausaRaizOptions}
                  placeholder="Ingresar una opción"
                  selectedKey={accion.TipoCausaRaiz}
                  onChange={(_, option) =>
                    handleAccionDefinitivaChange(
                      accion.InternalId,
                      "TipoCausaRaiz",
                      option?.key
                    )
                  }
                  onRenderOption={renderDropdownOptionWithTooltip}
                  onRenderTitle={renderDropdownTitleWithTooltip}
                  errorMessage={errorsAcciones && errorsAcciones[idx]?.TipoCausaRaiz}
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
                      handleAccionDefinitivaChange(
                        accion.InternalId,
                        "Responsable",
                        items
                      )
                    }
                    defaultSelectedUsers={[accion.Responsable?.EMail || ""]}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={1000}
                    
                  />
                  {errorsAcciones && errorsAcciones[idx]?.Responsable && (
                    <span
                      style={{
                        color: "#a4262c",
                        fontSize: 12,
                        marginTop: "2px",
                      }}
                    >
                      {errorsAcciones[idx]?.Responsable}
                    </span>
                  )}
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
                      handleAccionDefinitivaChange(
                        accion.InternalId,
                        "ResponsableSeguimiento",
                        items
                      )
                    }
                    defaultSelectedUsers={[accion.ResponsableSeguimiento?.EMail || ""]}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={1000}
                  />
                  {errorsAcciones && errorsAcciones[idx]?.ResponsableSeguimiento && (
                    <span
                      style={{
                        color: "#a4262c",
                        fontSize: 12,
                        marginTop: "2px",
                      }}
                    >
                      {errorsAcciones[idx]?.ResponsableSeguimiento}
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
                    value={accion.FechaImplementacion?.toDate()}
                    formatDate={formatDate}
                    onSelectDate={(date) => {
                      if (!date) {
                        handleAccionDefinitivaChange(
                          accion.InternalId,
                          "FechaImplementacion",
                          undefined
                        );
                        handleAccionDefinitivaChange(
                          accion.InternalId,
                          "FechaCierre",
                          undefined
                        );
                        handleAccionDefinitivaChange(
                          accion.InternalId,
                          "FechaFin",
                          undefined
                        );
                        return;
                      }
                      const selectedMoment = moment(date);
                      if (
                        fechaOcurrencia &&
                        !selectedMoment.isBefore(fechaOcurrencia, "day")
                      ) {
                        handleAccionDefinitivaChange(
                          accion.InternalId,
                          "FechaImplementacion",
                          selectedMoment
                        );

                        if (
                          accion.FechaCierre &&
                          moment(accion.FechaCierre).isBefore(selectedMoment, "day")
                        ) {
                          handleAccionDefinitivaChange(
                            accion.InternalId,
                            "FechaCierre",
                            undefined
                          );
                        }
                        if (
                          accion.FechaFin &&
                          moment(accion.FechaFin).isBefore(selectedMoment, "day")
                        ) {
                          handleAccionDefinitivaChange(
                            accion.InternalId,
                            "FechaFin",
                            undefined
                          );
                        }
                      }
                    }}
                    minDate={fechaOcurrencia?.toDate()}
                    disabled={!fechaOcurrencia}
                    firstDayOfWeek={DayOfWeek.Monday}
                  />
                  {errorsAcciones && errorsAcciones[idx]?.FechaImplementacion && (
                    <span
                      style={{
                        color: "#a4262c",
                        fontSize: 12,
                        marginTop: "-4px",
                      }}
                    >
                      {errorsAcciones[idx]?.FechaImplementacion}
                    </span>
                  )}
                </div>
                <Dropdown
                  label="Status acción definitiva"
                  required
                  placeholder="Seleccionar una opción"
                  options={dropdownOptions.statusAccionDefinitivaOptions}
                  selectedKey={accion.StatusAccionDefinitiva}
                  onChange={(_, option) =>
                    handleAccionDefinitivaChange(
                      accion.InternalId,
                      "StatusAccionDefinitiva",
                      option?.key
                    )
                  }
                  onRenderOption={renderDropdownOptionWithTooltip}
                  onRenderTitle={renderDropdownTitleWithTooltip}
                  errorMessage={
                    errorsAcciones && errorsAcciones[idx]?.StatusAccionDefinitiva
                  }
                />
                <TextField
                  label="Método de estandarización"
                  placeholder="Ingresar un método"
                  className={styles.doubleColumn}
                  value={accion.MetodosEstandarizacion}
                  onChange={(_, value) =>
                    handleAccionDefinitivaChange(
                      accion.InternalId,
                      "MetodosEstandarizacion",
                      value
                    )
                  }
                />
                <div className={styles.labelFieldContainer}>
                  <label className={styles.labelField}>
                    Fecha de cierre (luego de seguimiento)
                  </label>
                  <DatePicker
                    strings={datePickerStrings}
                    placeholder="Seleccionar fecha"
                    value={accion.FechaCierre?.toDate()}
                    formatDate={formatDate}
                    onSelectDate={(date) => {
                      if (!date) {
                        handleAccionDefinitivaChange(
                          accion.InternalId,
                          "FechaCierre",
                          undefined
                        );
                        return;
                      }
                      const selectedMoment = moment(date);
                      if (
                        accion.FechaImplementacion &&
                        !selectedMoment.isBefore(accion.FechaImplementacion, "day")
                      ) {
                        handleAccionDefinitivaChange(
                          accion.InternalId,
                          "FechaCierre",
                          selectedMoment
                        );
                      }
                    }}
                    minDate={accion.FechaImplementacion?.toDate()}
                    disabled={!accion.FechaImplementacion}
                    firstDayOfWeek={DayOfWeek.Monday}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <label>Aplica transversalización</label>
                  <Checkbox
                    checked={accion.Transversalizacion}
                    onChange={(_, checked) =>
                      handleAccionDefinitivaChange(
                        accion.InternalId,
                        "Transversalizacion",
                        checked
                      )
                    }
                  />
                </div>
                {accion.Transversalizacion && (
                  <>
                    <div className={styles.labelFieldContainer}>
                      <label className={styles.labelField}>
                        <span className={styles.requiredAsterisk}>* </span>
                        ¿A qué equipos?
                      </label>
                      <TextField
                        value={accion.EquiposQueIntervienen}
                        multiline
                        rows={3}
                        placeholder="Ingresar equipos"
                        onChange={(_, value) =>
                          handleAccionDefinitivaChange(
                            accion.InternalId,
                            "EquiposQueIntervienen",
                            value || ""
                          )
                        }
                        onBlur={(e) => {
                          const cleanValue = accion.EquiposQueIntervienen?.trim() || "";
                          if (cleanValue === ".") {
                            handleAccionDefinitivaChange(
                              accion.InternalId,
                              "EquiposQueIntervienen",
                              ""
                            );
                          } else {
                            handleAccionDefinitivaChange(
                              accion.InternalId,
                              "EquiposQueIntervienen",
                              cleanValue
                            );
                          }
                        }}
                        errorMessage={
                          errorsAcciones && errorsAcciones[idx]?.EquiposQueIntervienen
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
                        value={accion.FechaFin?.toDate()}
                        formatDate={formatDate}
                        onSelectDate={(date) => {
                          if (!date) {
                            handleAccionDefinitivaChange(
                              accion.InternalId,
                              "FechaFin",
                              undefined
                            );
                            return;
                          }
                          const selectedMoment = moment(date);
                          if (
                            accion.FechaImplementacion &&
                            !selectedMoment.isBefore(accion.FechaImplementacion, "day")
                          ) {
                            handleAccionDefinitivaChange(
                              accion.InternalId,
                              "FechaFin",
                              selectedMoment
                            );
                          }
                        }}
                        minDate={accion.FechaImplementacion?.toDate()}
                        disabled={!accion.FechaImplementacion}
                        firstDayOfWeek={DayOfWeek.Monday}
                      />
                      {errorsAcciones && errorsAcciones[idx]?.FechaFin && (
                        <span
                          style={{
                            color: "#a4262c",
                            fontSize: 12,
                            marginTop: "2px",
                          }}
                        >
                          {errorsAcciones[idx]?.FechaFin}
                        </span>
                      )}
                    </div>
                    <Dropdown
                      label="Status transversalización"
                      required
                      placeholder="Seleccionar una opción"
                      options={dropdownOptions.statusYokotenOptions}
                      selectedKey={accion.StatusTransversalizacion}
                      onChange={(_, option) =>
                        handleAccionDefinitivaChange(
                          accion.InternalId,
                          "StatusTransversalizacion",
                          option?.key
                        )
                      }
                      onRenderOption={renderDropdownOptionWithTooltip}
                      onRenderTitle={renderDropdownTitleWithTooltip}
                      errorMessage={
                        errorsAcciones && errorsAcciones[idx]?.StatusTransversalizacion
                      }
                    />
                  </>
                )}
                <TextField
                  label="Comentarios"
                  multiline
                  placeholder="Ingresar comentarios"
                  rows={3}
                  className={styles.doubleColumn}
                  value={accion.Comentarios}
                  onChange={(_, value) =>
                    handleAccionDefinitivaChange(accion.InternalId, "Comentarios", value)
                  }
                />
                <div className={styles.fullWidth}>
                  <FilesComponent
                    files={accion.Files}
                    setFiles={(files) => handleFiles(accion.InternalId, files)}
                  />
                </div>
              </div>
            </React.Fragment>
          );
        })}
    </Stack.Item>
  );
};
