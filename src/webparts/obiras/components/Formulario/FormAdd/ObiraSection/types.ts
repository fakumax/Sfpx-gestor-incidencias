import { IDropdownOption } from "@fluentui/react";
import { IForm, IFormErrors } from "../../IFormulario";


export interface IDropdownOptionObira {
    etapaOptions: IDropdownOption[];
    equipoOptions: IDropdownOption[];
    tipoProblemaOptions: IDropdownOption[];
    unidadOptions: IDropdownOption[];
    subKPIOptions: IDropdownOption[];
    estadoGeneralOptions: IDropdownOption[];
}


export interface IObiraSectionProps {
    obiraData: IForm;
    setObiraData: React.Dispatch<React.SetStateAction<IForm>>;
    proveedorNombre?: string;
    errors?: IFormErrors;
    obiraId?: string;
    setIsValidFechaDeRepeticionDelProblema: React.Dispatch<React.SetStateAction<boolean>>;
    peoplePickerContext: {
        absoluteUrl: string;
        msGraphClientFactory: any;
        spHttpClient: any;
    };
}

export const INITIAL_OBIRA_STATE: IForm = {
    Etapa: "",
    Equipo: {
        Title: "",
        Id: 0
    },
    Bloque: {
        Title: "",
        Id: 0
    },
    PAD: {
        Title: "",
        Id: 0
    },
    FechaOcurrencia: null,
    TipoDeProblema: "",
    TituloProblema: "",
    Detalle: "",
    SubKPIAfectado: {
        Title: "",
        Id: 0
    },
    QTY: null,
    Unidad: "",
    FechaRepeticion: null,
    AccionInmediata: "",
    LinkAlPlan: "",
    Proveedor: "",
    EstadoGeneral: "",
    Files: [],
    ResponsableItem: null
};
