import { IDropdownOption } from '@fluentui/react';
import moment from 'moment';
import { IFileAdd } from './Formulario';
import User from '../../../../core/entities/User';
import { DateTimeFieldFormatType, FieldTypes } from "@pnp/sp/fields";



export interface IForm {
    Etapa: string;
    Equipo: { Title: string; Id: number };
    Bloque: { Title: string; Id: number };
    PAD: { Title: string; Id: number };
    FechaOcurrencia: moment.Moment;
    TipoDeProblema: string;
    TituloProblema: string;
    Detalle: string;
    SubKPIAfectado: { Title: string; Id: number };
    QTY: number;
    Unidad: string;
    FechaRepeticion: string;
    AccionInmediata: string;
    LinkAlPlan: string;
    Proveedor: string;
    EstadoGeneral: string;
    Files: IFileAdd[];
    Etiquetas?: { Title: string; Id: number; Etapa?: string }[];
    CausaRaizPreliminar?: string;
    ResponsableItem: User[];
    FechaCierre?: moment.Moment;


}

export interface IAnormalidades {
    InternalId: number;
    Id: number;
    AccionesATomar: string;
    Responsable: User;
    isNewResponsableSeguimiento: boolean;
    FechaRealizacion: moment.Moment;
    ResponsableSeguimiento: User,
    Status: string;
    Comentarios: string;
    Files: IFileAdd[];
    added: boolean;
    modified: boolean;
    deleted: boolean;
}

export interface IAcciones {
    InternalId: number;
    Id: number;
    CausaRaiz: string;
    Contramedida: string;
    TipoCausaRaiz: string;
    Responsable: User;
    ResponsableSeguimiento: User,
    isNewResponsableSeguimiento: boolean;
    FechaImplementacion: moment.Moment;
    StatusAccionDefinitiva: string;
    MetodosEstandarizacion: string;
    FechaCierre: moment.Moment;
    Transversalizacion: boolean;
    EquiposQueIntervienen: string;
    FechaFin: moment.Moment;
    StatusTransversalizacion: string;
    Comentarios: string;
    Files: IFileAdd[];
    added: boolean;
    modified: boolean;
    deleted: boolean;
}

export interface CustomDropdownOption extends IDropdownOption {
    value: number;
}

export interface IFormErrors {
    Etapa: string;
    Equipo: string;
    Bloque: string;
    PAD: string;
    FechaOcurrencia: string;
    TipoDeProblema: string;
    TituloProblema: string;
    SubKPIAfectado: string;
    QTY: string;
    Unidad: string;
    FechaRepeticion: string;
    AccionInmediata: string;
    LinkAlPlan: string;
    EstadoGeneral: string;
    Etiquetas?: string;
}

export interface IErrorsAcciones {
    CausaRaiz: string;
    Contramedida: string;
    TipoCausaRaiz: string;
    Responsable: string;
    ResponsableSeguimiento: string;
    FechaImplementacion: string;
    StatusAccionDefinitiva: string;
    EquiposQueIntervienen: string;
    FechaFin: string;
    StatusTransversalizacion: string;
}

export interface IErrorsAnormalidades {
    AccionesATomar: string;
    Responsable: string;
    FechaRealizacion: string;
    ResponsableSeguimiento: string;
    Status: string;
}

export interface Field {
    internalName: string;
    title: string;
    type: FieldTypes;
    required?: boolean;
    choices?: string[];
    richText?: boolean;
    numberOfLines?: number;
    lookupList?: string;
    lookupField?: string;
    displayFormat?: DateTimeFieldFormatType;
    defaultValue?: string | number;
    decimalPlaces?: number;
    formula?: string;
    resultType?: string;
    fieldRefs?: string[];
    allowGroups?: boolean;
    isMultiple?: boolean;
    selectionScope?: number;
    AllowMultipleValues?: boolean;
}