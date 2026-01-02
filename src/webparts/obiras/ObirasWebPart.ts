import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";

import * as strings from "ObirasWebPartStrings";
import ObirasProviderWrapper from "./components/ObirasProviderWrapper";
import type { IObirasProps } from "./components/IObirasProps";
import { getSP } from "../../core/pnp/sp/pnpjs-presets";
import { Roles, ADMIN_GROUP_NAME, CONSULTOR_GROUP_NAME } from "../../core/utils/Constants";
import "../../core/ui/scss/global.module.scss";
import { ISendEmailConfig } from "../../core/entities/ISendEmail";

export interface IObirasWebPartProps {
  description: string;
  tableroBIData?: string;
  sendEmailObj?:ISendEmailConfig
}

export default class ObirasWebPart extends BaseClientSideWebPart<IObirasWebPartProps> {
  private _userRole: Roles = Roles.Ninguno;
  private _userGroup: string = "";

  public async render(): Promise<void> {
    const sp = getSP();
    try {
      const userGroups = await sp.web.currentUser.groups();
      const groupNames = userGroups.map((g) => g.Title);
      this._userGroup = groupNames[0] || "";
      if (this._userGroup === ADMIN_GROUP_NAME) {
        this._userRole = Roles.Administradores;
      } else if (this._userGroup === CONSULTOR_GROUP_NAME) {
        this._userRole = Roles.Consultores;
      } else if (this._userGroup) {
        this._userRole = Roles.Proveedor;
      } else {
        this._userRole = Roles.Ninguno;
      }

      console.log("Inicialización completada:", {
        grupo: this._userGroup,
        rol: this._userRole,
      });

      const element: React.ReactElement<IObirasProps> = React.createElement(
        ObirasProviderWrapper,
        {
          userRole: this._userRole,
          userDisplayName: this.context.pageContext.user.displayName,
          userGroup: this._userGroup,
          context: this.context,
          tableroBIData: this.properties.tableroBIData,
          sendEmailObj:this.properties.sendEmailObj,
        }
      );
      ReactDom.render(element, this.domElement);
    } catch (error) {
      console.error("Error al obtener grupos:", error);
      this._userRole = Roles.Ninguno;
      this._userGroup = "";
    }
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
    getSP(this.context);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty(
        "--bodyText",
        semanticColors.bodyText || null
      );
      this.domElement.style.setProperty("--link", semanticColors.link || null);
      this.domElement.style.setProperty(
        "--linkHovered",
        semanticColors.linkHovered || null
      );
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("tableroBIData", {
                  label: "Inserte URL de Tablero BI",
                  multiline: true,
                  rows: 5,
                }),
                PropertyPaneTextField('sendEmailObj.url', {
                  label: strings.SendEmailURL
                }),
                PropertyPaneTextField('sendEmailObj.key', {
                  label: strings.SendEmailKey
                })
              ],
            },
          ],
        },
      ],
    };
  }
}
