import { ETAPAS_CON_EQUIPO } from "../../../../../core/utils/Constants";
import { IAcciones, IAnormalidades, IErrorsAcciones, IErrorsAnormalidades, IForm, IFormErrors } from "../IFormulario";

enum FormMessages {
    RequiredField = "Este es un campo obligatorio.",
}

export const validateForm = (formData: IForm): [errorObject: IFormErrors, isValid: boolean] => {
    let isValid = true;
    let errors: IFormErrors = {
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
    };

    const errorKeys = Object.keys(errors) as (keyof IFormErrors)[];

    const optionalFields = ["Detalle", "FechaRepeticion", "LinkAlPlan", "AccionInmediata", "ResponsableItem"];
    errorKeys.forEach((key) => {
        if (key === "Equipo") {
            if (formData.Etapa && !ETAPAS_CON_EQUIPO.includes(formData.Etapa)) {
                if (!formData.Equipo || formData.Equipo.Id === 0) {
                    errors.Equipo = FormMessages.RequiredField;
                    isValid = false;
                }
            } else {
                errors.Equipo = "";
            }
            return;
        }
        if (optionalFields.includes(key)) {
            errors[key] = "";
            return;
        }
        if (
            formData[key] === undefined ||
            formData[key] === null ||
            formData[key] === ""
        ) {
            errors[key] = FormMessages.RequiredField;
            isValid = false;
        }
        if (key === "SubKPIAfectado" || key === "PAD" || key === "Bloque") {
            if (formData[key]?.Id === 0) {
                errors[key] = FormMessages.RequiredField;
                isValid = false;
            }
        }
    });

    return [errors, isValid];
};

export const validateAcciones = (accion: IAcciones): [errorObject: IErrorsAcciones, isValid: boolean] => {

    const requiredFields = [
        "CausaRaiz",
        "Contramedida",
        "TipoCausaRaiz",
        "Responsable",
        "ResponsableSeguimiento",
        "FechaImplementacion",
        "StatusAccionDefinitiva",
    ];
    let isValid = true;

    let errors: IErrorsAcciones = { ...emptyErrorAccion };
    const copyAccion = { ...accion };

    requiredFields.forEach((field) => {

        if (
            copyAccion[field as keyof IAcciones] === undefined ||
            copyAccion[field as keyof IAcciones] === null ||
            copyAccion[field as keyof IAcciones] === "" ||
            copyAccion[field as keyof IAcciones] === false
        ) {
            errors[field as keyof IErrorsAcciones] = FormMessages.RequiredField;
            isValid = false;
        }
        if ((field === "Responsable" || field === "ResponsableSeguimiento") && copyAccion[field]?.Id === 0) {
            errors[field] = FormMessages.RequiredField;
            isValid = false;
        }
    });

    if (accion.Transversalizacion === true) {

        if (copyAccion.EquiposQueIntervienen === undefined || copyAccion.EquiposQueIntervienen === null || copyAccion.EquiposQueIntervienen === "") {
            errors.EquiposQueIntervienen = FormMessages.RequiredField;
            isValid = false;
        }

        if (copyAccion.FechaFin === undefined || copyAccion.FechaFin === null) {
            errors.FechaFin = FormMessages.RequiredField;
            isValid = false;
        }

        if (copyAccion.StatusTransversalizacion === undefined || copyAccion.StatusTransversalizacion === null || copyAccion.StatusTransversalizacion === "") {
            errors.StatusTransversalizacion = FormMessages.RequiredField;
            isValid = false;
        }
    }

    return [errors, isValid];

}

export const validateAnormalidades = (anormalidad: IAnormalidades): [errorObject: IErrorsAnormalidades, isValid: boolean] => {

    let isValid = true;
    let errors: IErrorsAnormalidades = { ...emptyErrorAnormalidad };

    const requiredFields = ["AccionesATomar", "Responsable", "FechaRealizacion", "ResponsableSeguimiento", "Status"];

    requiredFields.forEach((field) => {
        if (field === "Responsable" || field === "ResponsableSeguimiento") {
            if (anormalidad[field]?.Id === 0) {
                errors[field as keyof IErrorsAnormalidades] = FormMessages.RequiredField;
                isValid = false;
            }
        } else if (
            anormalidad[field as keyof IAnormalidades] === undefined ||
            anormalidad[field as keyof IAnormalidades] === null ||
            anormalidad[field as keyof IAnormalidades] === ""
        ) {
            errors[field as keyof IErrorsAnormalidades] = FormMessages.RequiredField;
            isValid = false;
        }
    });

    return [errors, isValid];

}

export let emptyErrorAccion: IErrorsAcciones = {
    CausaRaiz: "",
    Contramedida: "",
    TipoCausaRaiz: "",
    Responsable: "",
    ResponsableSeguimiento: "",
    FechaImplementacion: "",
    StatusAccionDefinitiva: "",
    EquiposQueIntervienen: "",
    FechaFin: "",
    StatusTransversalizacion: "",

}

export let emptyErrorAnormalidad: IErrorsAnormalidades = {
    AccionesATomar: "",
    Responsable: "",
    FechaRealizacion: "",
    ResponsableSeguimiento: "",
    Status: "",

}