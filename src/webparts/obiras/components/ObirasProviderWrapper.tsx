import React from "react";
import Obiras from "./Obiras";
import { UserProvider } from "../../../core/context/UserContext";
import {
  ADMIN_GROUP_NAME,
  CONSULTOR_GROUP_NAME,
  Roles,
} from "../../../core/utils/Constants";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MessageProvider } from "../../../core/context/MessageContext";
import { ISendEmailConfig } from "../../../core/entities/ISendEmail";

export interface IObirasProviderProps {
  userDisplayName: string;
  context: WebPartContext;
  userGroup: string;
  userRole: Roles;
  tableroBIData: string;
  sendEmailObj?: ISendEmailConfig;
}

const ObirasProviderWrapper: React.FC<IObirasProviderProps> = ({
  userRole,
  userDisplayName,
  userGroup,
  context,
  tableroBIData,
  sendEmailObj,
}) => {
  const isAdmin = userGroup === ADMIN_GROUP_NAME;
  const isConsultor = userGroup === CONSULTOR_GROUP_NAME;

  return (
    <UserProvider
      initialRole={userRole}
      initialIsAdmin={isAdmin}
      initialIsConsultor={isConsultor}
      initialGroup={userGroup}
      sendEmailObj={sendEmailObj}
    >
      <MessageProvider>
        <Obiras
          context={context}
          userDisplayName={userDisplayName}
          tableroBIData={tableroBIData}
        />
      </MessageProvider>
    </UserProvider>
  );
};

export default ObirasProviderWrapper;
