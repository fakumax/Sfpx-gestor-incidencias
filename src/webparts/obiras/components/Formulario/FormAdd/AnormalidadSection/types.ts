import { IDropdownOption } from "@fluentui/react";
import { IFileAdd } from "../../Formulario";
import { IAnormalidades, IErrorsAnormalidades } from "../../IFormulario";
import moment from 'moment';

export interface IAnormalidadSectionProps {
    anormalidadesData: IAnormalidades[];
    handleAnormalidadesChange: (anormalidades: IAnormalidades[]) => void;
    peoplePickerContext: {
        absoluteUrl: string;
        msGraphClientFactory: any;
        spHttpClient: any;
    };
    errorsAnormalidades: IErrorsAnormalidades[];
    fechaOcurrencia?: moment.Moment;
    isProveedorInterno?: boolean;
}

export interface IDropdownOptionAnormalidad {
    statusOptions: IDropdownOption[];
}

