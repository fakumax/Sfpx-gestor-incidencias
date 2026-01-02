import { IDropdownOption } from "@fluentui/react";
import { IAcciones, IErrorsAcciones } from "../../IFormulario";
import moment from 'moment';

export interface IAccionSectionProps {
    accionesData: IAcciones[];
    handleAccionesChange: (acciones: IAcciones[]) => void;
    peoplePickerContext: {
        absoluteUrl: string;
        msGraphClientFactory: any;
        spHttpClient: any;
    };
    errorsAcciones: IErrorsAcciones[];
    fechaOcurrencia?: moment.Moment;
    isProveedorInterno?: boolean;
}

export interface IDropdownOptionAccion {
    statusAccionDefinitivaOptions: IDropdownOption[];
    tipoCausaRaizOptions: IDropdownOption[];
    statusYokotenOptions: IDropdownOption[];
}


