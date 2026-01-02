import { BaseEntity } from '.';
import { Utils } from '..';
import User from "../entities/User";
import FilePnp from './FilePnp';

export default class Accion extends BaseEntity {

    public AQueEquipos: string;
    public AplicaTransversalizacion: boolean;
    public CausaRaiz: string;
    public Comentarios: string;
    public Contramedida: string;
    public FechaCierre: Date;
    public FechaImplementacion: Date;
    public FechaFinTransversalizacion: Date;
    public ObirasId: number;
    public TipoObiraId: number;
    public ProblemaObirasId: number;
    public MetodoEstandarizacion: string;
    public Responsable: User;
    public ResponsableSeguimiento: User;
    public StatusAccion: string;
    public StatusTransversalizacion: string;
    public TipoCausaRaiz: string;
    public Author: User;
    public Files: FilePnp[];


    constructor(item?: any) {
        super(item);
    }

    protected mapItem(item: any): void {
        this.AQueEquipos = item.EquiposQueIntervienen ? item.EquiposQueIntervienen : item.AQueEquipos ? item.AQueEquipos : item.EquiposQueIntervienen === "" ? null : undefined;
        this.AplicaTransversalizacion = item.AplicaYokoten ? item.AplicaYokoten : item.Transversalizacion ? item.Transversalizacion : false;
        this.CausaRaiz = item.CausaRaiz ? item.CausaRaiz : item.CausaRaiz === "" ? null : undefined;
        this.Comentarios = item.Comentarios === "" ? null : item.Comentarios ?? null;
        this.Contramedida = item.Contramedida ? item.Contramedida : item.Contramedida === "" ? null : undefined;
        this.FechaCierre = item.FechaDeCierreLuegoDeSeguimiento ? item.FechaDeCierreLuegoDeSeguimiento : item.FechaCierre ? item.FechaCierre : item.FechaCierre === null ? null : undefined;
        this.FechaImplementacion = item.FechaDeImplementacionDeContramed ? item.FechaDeImplementacionDeContramed : item.FechaImplementacion ? item.FechaImplementacion : item.FechaImplementacion === "" ? null : undefined;
        this.FechaFinTransversalizacion = item.FechaFinDeLaTransversalizacion ? item.FechaFinDeLaTransversalizacion : item.FechaFin ? item.FechaFin : item.FechaFinTransversalizacion === "" ? null : undefined;
        this.ObirasId = item.IDObiraId ? item.IDObiraId : item.ObirasId ? item.ObirasId : item.IDObiraId === null ? null : undefined;
        this.TipoObiraId = item.IDObira_x003a_Tipo_x0020_ObiraId ? item.IDObira_x003a_Tipo_x0020_ObiraId : item.TipoObiraId ? item.TipoObiraId : item.TipoObiraId === null ? null : undefined;
        this.ProblemaObirasId = item.IDObiras_x003a_var_Problema0 ? item.IDObiras_x003a_var_Problema0 : item.ProblemaObirasId ? item.ProblemaObirasId : item.ProblemaObirasId === null ? null : undefined;
        this.MetodoEstandarizacion = item.MetodoDeEstandarizacion || item.MetodosEstandarizacion || "";
        this.Responsable = item.Responsable ? new User(item.Responsable) : new User(null);
        this.ResponsableSeguimiento = item.ResponsableSeguimiento ? new User(item.ResponsableSeguimiento) : item.ResponsableSeguimiento ? new User(item.ResponsableSeguimiento) : new User(null);
        this.StatusAccion = item.StatusAccionDefinitiva ? item.StatusAccionDefinitiva : item.StatusAccion ? item.StatusAccion : item.StatusAccion === "" ? null : undefined;
        this.StatusTransversalizacion = item.StatusYokoten ? item.StatusYokoten : item.StatusTransversalizacion ? item.StatusTransversalizacion : item.StatusTransversalizacion === null ? null : undefined;
        this.TipoCausaRaiz = item.TipoDeCausaRaiz ? item.TipoDeCausaRaiz : item.TipoCausaRaiz ? item.TipoCausaRaiz : item.TipoCausaRaiz === "" ? null : undefined;
        this.Files = item.AttachmentFiles ? item.AttachmentFiles.map((file: any) => new FilePnp(file)) : [];

        if (item.Author)
            this.Author = new User(item);

    }

    public toListItem(): any {
        return Utils.removeUndefined({
            ...super.toListItem(),
            AQueEquipos: this.AQueEquipos,
            AplicaYokoten: this.AplicaTransversalizacion,
            CausaRaiz: this.CausaRaiz,
            Comentarios: this.Comentarios === "" ? null : this.Comentarios,
            Contramedida: this.Contramedida,
            FechaDeCierreLuegoDeSeguimiento: this.FechaCierre,
            FechaDeImplementacionDeContramed: this.FechaImplementacion,
            FechaFinDeLaTransversalizacion: this.FechaFinTransversalizacion,
            IDObiraId: this.ObirasId,
            IDObira_x003a_Tipo_x0020_ObiraId: this.TipoObiraId,
            //IDObiras_x003a_var_Problema0: this.ProblemaObirasId,
            MetodoDeEstandarizacion: this.MetodoEstandarizacion,
            ResponsableId: this.Responsable.Id,
            ResponsableSeguimientoId: this.ResponsableSeguimiento.Id,
            StatusAccionDefinitiva: this.StatusAccion,
            StatusYokoten: this.StatusTransversalizacion,
            TipoDeCausaRaiz: this.TipoCausaRaiz,
        });
    }
}