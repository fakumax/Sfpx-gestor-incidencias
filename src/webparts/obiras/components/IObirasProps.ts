import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IObirasProps {
  userDisplayName: string;
  context: WebPartContext;
  tableroBIData: string;
}
