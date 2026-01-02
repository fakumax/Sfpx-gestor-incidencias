export default class ListaAsociada {
    public acciones: string;
    public gestiones: string;
    public obiras: string;

    constructor(data?: any) {
        this.acciones = data?.acciones || "";
        this.gestiones = data?.gestiones || "";
        this.obiras = data?.obiras || "";
    }
}