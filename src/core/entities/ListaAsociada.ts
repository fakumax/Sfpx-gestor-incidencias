export default class ListaAsociada {
    public acciones: string;
    public gestiones: string;
    public obiras: string;
    public etiquetas?: string;
    public responsableEtapa?: string;
    public equipos?: string;
    public locaciones?: string;
    public subKPI?: string;
    public gestionAnormalidad?: string;
    public accionDefinitiva?: string;

    constructor(data?: any) {
        this.acciones = data?.acciones || "";
        this.gestiones = data?.gestiones || "";
        this.obiras = data?.obiras || "";
        this.etiquetas = data?.etiquetas || "";
        this.responsableEtapa = data?.responsableEtapa || "";
        this.equipos = data?.equipos || "";
        this.locaciones = data?.locaciones || "";
        this.subKPI = data?.subKPI || "";
        this.gestionAnormalidad = data?.gestionAnormalidad || "";
        this.accionDefinitiva = data?.accionDefinitiva || "";
    }
}