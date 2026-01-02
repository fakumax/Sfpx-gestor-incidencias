import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Roles } from "../../../core/utils/Constants";

export interface IObirasProps {
  userDisplayName: string;
  context: WebPartContext;
  tableroBIData: string
}
