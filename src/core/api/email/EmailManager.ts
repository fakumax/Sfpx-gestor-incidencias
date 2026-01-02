import { SPFI } from "@pnp/sp";
import { getSP } from "../../pnp/sp/pnpjs-presets";
import Email from "../../entities/Email";
import IEmailManager from "./IEmailManager";
import { EmailTokens, Lista } from "../../utils/Constants";
import ItemEmail from "../../entities/ItemEmail";
import { IAcciones, IAnormalidades, IForm } from "../../../webparts/obiras/components/Formulario/IFormulario";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Proveedor } from "../../entities";
import { ISendEmailConfig } from "../../entities/ISendEmail";
import { isHtmlElement } from "react-router-dom/dist/dom";



export default class EmailManager implements IEmailManager<Email> {

  private _sp: SPFI;
  private sendEmailObj: ISendEmailConfig;

  constructor(sendEmailObj: ISendEmailConfig) {
    this._sp = getSP();
    this.sendEmailObj = sendEmailObj;
  }

  public async sendEmailTo(codigo: string, to: string[], obira: IForm, acciones: IAcciones[], anormalidades: IAnormalidades[], obiraId: number, context: WebPartContext, proveedor: Proveedor): Promise<void> {
    try {

      const filter = `Codigo eq '${codigo}'`;
      const correos = await this._sp.web.lists.getByTitle(Lista.Correos).items.select('Codigo', 'Flujo', 'TO', 'FROM', 'CC', 'CCO', 'SUBJECT', 'BODY').filter(filter)();
      let correo = correos.length > 0 ? new ItemEmail(correos[0]) : null;

      const tokens = {
        ID: obiraId !== undefined && obiraId !== null ? String(obiraId) : 'N/A',
        Equipo: obira?.Equipo?.Title && obira.Equipo.Title.trim() !== '' ? obira.Equipo.Title : 'N/A',
        Etapa: obira?.Etapa || 'N/A',
        Bloque: obira?.Bloque.Title  || 'N/A',
        PAD: obira?.PAD?.Title || 'N/A',
        TipoDeProblema: obira?.TipoDeProblema || 'N/A',
        TituloDelProblema: obira?.TituloProblema || 'N/A',
        Detalle: obira?.Detalle || 'N/A',
        Proveedor: proveedor?.Title || 'N/A',
        Link: `${context?.pageContext?.web?.absoluteUrl ?? ''}#/proveedores/${proveedor?.Title ?? ''}/${obiraId ?? ''}`
      };
      let htmlBody = correo.Body ? correo.Body.replace(/\[([^\]]+)\]/g, (_, token) => tokens[token] ?? '-') : '';

      let email = new Email();
      if (correo) {
        let subject = correo.Subject || "";
        subject = subject.replace(/\[ID\]/g, obiraId !== undefined && obiraId !== null ? String(obiraId) : "-");
        email.From = correo.From ? correo.From : "";
        email.Subject = subject;
        email.Body = htmlBody;
        email.To = to.length > 0 ? to : [];
      }
      return this.send(email);
    } catch (error) {
      console.error("Error al enviar el correo", error);
      throw error;
    }
  }

  public async sendEmail(codigo: string, obira: IForm, acciones: IAcciones[], anormalidades: IAnormalidades[], obiraId: number, context: WebPartContext, proveedor: Proveedor): Promise<void> {
    try {

      let subjectTokenReplace: Map<RegExp, any> = new Map<RegExp, any>();
      let bodyTokenReplace: Map<RegExp, any> = new Map<RegExp, any>();

      const filter = `Codigo eq '${codigo}'`;
      const correos = await this._sp.web.lists.getByTitle(Lista.Correos).items.select('Codigo', 'Flujo', 'TO', 'FROM', 'CC', 'CCO', 'SUBJECT', 'BODY').filter(filter)();
      let correo = correos.length > 0 ? new ItemEmail(correos[0]) : null;
      const toSet = this.getTokensAndEmails("To", correo);
      const ccSet = this.getTokensAndEmails("Cc", correo);
      const ccoSet = this.getTokensAndEmails("Cco", correo);
      const subjectSet = this.getTokensAndEmails("Subject", correo);
      const bodySet = this.getTokensAndEmails("Body", correo);

      const toTokens = this.setToArray(toSet.tokens);
      const ccTokens = this.setToArray(ccSet.tokens);
      const ccoTokens = this.setToArray(ccoSet.tokens);
      const subjectTokens = this.setToArray(subjectSet.tokens);
      const bodyTokens = this.setToArray(bodySet.tokens);

      const toArray = Array.from(toTokens);
      const ccArray = Array.from(ccTokens);
      const ccoArray = Array.from(ccoTokens);
      const subjectArray = Array.from(subjectTokens);
      const bodyArray = Array.from(bodyTokens);

      let toList = [];
      let ccList = [];
      let ccoList = [];

      await this.processTokensForList(toList, toArray, acciones, anormalidades, proveedor, obira);
      await this.processTokensForList(ccList, ccArray, acciones, anormalidades, proveedor, obira);
      await this.processTokensForList(ccoList, ccoArray, acciones, anormalidades, proveedor, obira);
      await this.replaceTokens(subjectArray, "Subject", subjectTokenReplace, obira, acciones, anormalidades, obiraId, context, proveedor);
      await this.replaceTokens(bodyArray, "Body", bodyTokenReplace, obira, acciones, anormalidades, obiraId, context, proveedor);

      if (toSet.emails.length > 0) {
        toList.push(...toSet.emails);
      }
      if (ccSet.emails.length > 0) {
        ccList.push(...ccSet.emails);
      }
      if (ccoSet.emails.length > 0) {
        ccoList.push(...ccoSet.emails);
      }

      const buildEmail = this.buildEmailAttributes(correo, subjectTokenReplace, bodyTokenReplace);

      let email = new Email();

      if (correo) {
        email.From = correo.From ? correo.From : "";
        email.Subject = buildEmail.Subject || correo.Subject || "";
        email.Body = buildEmail.Body || correo.Body || "";
        email.To = toList.length > 0 ? toList : [];
        email.CC = ccList.length > 0 ? ccList : [];
        email.CCO = ccoList.length > 0 ? ccoList : [];
      }

      return this.send(email);

    } catch (error) {
      console.error("Error al enviar el correo", error);
      throw error;
    }
  }

  private buildEmailAttributes(correo: ItemEmail, subjectTokenReplace: Map<RegExp, any>, bodyTokenReplace: Map<RegExp, any>): Email {
    const email = new Email();

    if (correo) {

      let subject = correo.Subject || "";
      if (typeof subject === "string") {
        subjectTokenReplace.forEach((value, regex) => {
          subject = subject.replace(regex, value);
        });
        email.Subject = subject;
      }

      let body = correo.Body || "";
      if (typeof body === "string") {
        bodyTokenReplace.forEach((value, regex) => {
          body = body.replace(regex, value);
        });
        email.Body = body;
      }

      email.From = correo.From || "";
    }

    return email;
  }

  private async getItems(listTitle: string, select: string[], expand: string[], filter: string): Promise<any[]> {
    try {
      const items = await this._sp.web.lists.getByTitle(listTitle).items.select(...select).expand(...expand).filter(filter)();
      return items;
    } catch (error) {
      console.error(`Error al obtener los items de la lista ${listTitle}`, error);
      throw error;
    }
  }

  public getTokensAndEmails(field: keyof ItemEmail, correo: ItemEmail): { tokens: Set<string>; emails: string[] } {
    const tokens = new Set<string>();
    const emails: string[] = [];
    const value = correo[field];

    if (typeof value === 'string') {
      let matches = value.match(/\[[^\]]+\]/g);
      if (matches) {
        matches.forEach((match) => {
          tokens.add(match);
        });
      }

      let emailMatches = value.split(';').map((email) => email.trim()).filter((email) => email.includes('@'));
      emails.push(...emailMatches);
    } else if (Array.isArray(value)) {
      value.forEach((item: string) => {

        let matches = item.match(/\[[^\]]+\]/g);
        if (matches) {
          matches.forEach((match) => {
            tokens.add(match);
          });
        }

        let emailMatches = item.split(';').map((email) => email.trim()).filter((email) => email.includes('@'));
        emails.push(...emailMatches);
      });
    }

    return { tokens, emails };
  }

  private setToArray(to: Set<string>): string[] {
    return Array.from(to).map(email => email.trim().replace(/\[|\]/g, ""));
  }

  private async processTokensForList(
    list: string[],
    arrayTokens: string[],
    acciones: IAcciones[],
    anormalidades: IAnormalidades[],
    proveedor: Proveedor,
    obira: IForm
  ) {
    for (let token of arrayTokens) {
      if (token == EmailTokens.ResponsableDinamico) {
        const email = obira.Etapa === "Conexión de Pozos - E40" || obira.Etapa === "Construcción de Locación - E10"
          ? proveedor.Responsable?.EMail || ""
          : (await this.getItems(
            Lista.Equipos,
            ["Title", "Equipo/Title", "Responsable/ID", "Responsable/EMail"],
            ["Responsable"],
            `Id eq ${obira.Equipo.Id}`
          ))?.[0]?.Responsable?.EMail || "";
        if (email) list.push(email);
      } else if (token == EmailTokens.ResponsableSeguimientoAnormalidad) {
        if (anormalidades.length > 0) {
          const emails = anormalidades.map((anormalidad) => anormalidad.ResponsableSeguimiento.EMail);
          list.push(...emails.filter((email) => email));
        }
      } else if (token == EmailTokens.ResponsableAnormalidad) {
        if (anormalidades.length > 0) {
          const emails = anormalidades.map((anormalidad) => anormalidad.Responsable.EMail);
          list.push(...emails.filter((email) => email));
        }
      } else if (token == EmailTokens.ResponsableSeguimientoAccion) {
        if (acciones.length > 0) {
          const emails = acciones.map((accion) => accion.ResponsableSeguimiento.EMail);
          list.push(...emails.filter((email) => email));
        }
      } else if (token == EmailTokens.ResponsableAccion) {
        if (acciones.length > 0) {
          const emails = acciones.map((accion) => accion.Responsable.EMail);
          list.push(...emails.filter((email) => email));
        }
      }
    }
  }

  private async replaceTokens(
    arrayTokens: string[],
    field: keyof ItemEmail,
    tokenReplace: Map<RegExp, any>,
    obira: IForm,
    acciones: IAcciones[] = [],
    anormalidades: IAnormalidades[] = [],
    obiraId: number,
    context: WebPartContext,
    proveedor: Proveedor,
    list: string[] = []
  ) {
    switch (field) {
      case "To":
        await this.processTokensForList(list, arrayTokens, acciones, anormalidades, proveedor, obira);
        break;

      case "Cc":
        await this.processTokensForList(list, arrayTokens, acciones, anormalidades, proveedor, obira);
        break;

      case "Cco":
        await this.processTokensForList(list, arrayTokens, acciones, anormalidades, proveedor, obira);
        break;

      case "Subject":
      case "Body":
        for (let token of arrayTokens) {
          if (token == "ID") {
            tokenReplace.set(new RegExp("\\[ID\\]", "g"), obiraId ? obiraId : "-");
          } else if (token == "Tipo de problema") {
            tokenReplace.set(new RegExp("\\[Tipo de problema\\]", "g"), obira.TipoDeProblema ? obira.TipoDeProblema : "-");
          } else if (token == "Título del problema") {
            tokenReplace.set(new RegExp("\\[Título del problema\\]", "g"), obira.TituloProblema ? obira.TituloProblema : "-");
          } else if (token == "Detalle") {
            tokenReplace.set(new RegExp("\\[Detalle\\]", "g"), obira.Detalle? obira.Detalle : "-");
          } else if (token == "Proveedor") {
            tokenReplace.set(new RegExp("\\[Proveedor\\]", "g"), proveedor?.Title ?? "-");
          } else if (token == "Botón de Acceso a la Obira") {
            tokenReplace.set(
              new RegExp("\\[Botón de Acceso a la Obira\\]", "g"),
              `<a href="${context.pageContext.web.absoluteUrl}#/proveedores/${proveedor.Title}/${obiraId}">Acceder a la Obira</a>`
            );
          } else {
            if (typeof obira[token] === "object" && obira[token] !== null) {
              tokenReplace.set(new RegExp(`\\[${token}\\]`, "g"), obira[token].Title ? obira[token].Title : "-");
            } else if (typeof obira[token] === "string") {
              tokenReplace.set(new RegExp(`\\[${token}\\]`, "g"), obira[token]);
            } else {
              tokenReplace.set(new RegExp(`\\[${token}\\]`, "g"), "-");
            }
          }
        }
        break;

      default:
        throw new Error(`Campo desconocido: ${field}`);
    }
  }

  // public send(email: Email): Promise<void> {
  //   console.log("Enviando correo:", email);
  //   return this._sp.utility.sendEmail({
  //     From: email.From,
  //     To: email.To,
  //     CC: email.CC,
  //     BCC: email.CCO,
  //     Subject: email.Subject,
  //     Body: email.Body,
  //   })
  // }
public async send(email: Email): Promise<void> {
  
    try {
        const response = await fetch(`${this.sendEmailObj.url}/api/graph/sendMail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.sendEmailObj.key
            },
            body: JSON.stringify({
              to: email.To,
              subject: email.Subject,
              body: email.Body,
              isHtml:true,
     })
        });

        if (!response.ok) {
            let errorData;

            try {
                errorData = await response.json();
            } catch {
                errorData = { error: "Unknown error" };
            }

            throw new Error(
                `Azure Function API error: ${response.status} - ${errorData.error || errorData.errorMessage}`
            );
        }

    } catch (err) {
        console.error("Error enviando email:", err);
        throw err;
    }
}
 
  
}
