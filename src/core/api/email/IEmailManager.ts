import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IAcciones, IAnormalidades, IForm } from "../../../webparts/obiras/components/Formulario/IFormulario";
import { Proveedor } from "../../entities";

export default interface IEmailManager<Email> {
	sendEmail(codigo: string, obira: IForm, acciones: IAcciones[], anormalidades: IAnormalidades[], obiraId: number, context: WebPartContext, proveedor: Proveedor): Promise<void>;
	sendEmailTo(codigo: string, to: string[], obira: IForm, acciones: IAcciones[], anormalidades: IAnormalidades[], obiraId: number, context: WebPartContext, proveedor: Proveedor): Promise<void>;
}