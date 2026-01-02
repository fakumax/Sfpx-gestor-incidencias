import React, { createContext, useState, useMemo, ReactNode, useContext } from "react";
import { Roles } from "../utils/Constants";
import { ISendEmailConfig } from "../entities/ISendEmail";

type ListasAsociadas = {
  acciones: string;
  gestiones: string;
  obiras: string;
};

type UserData = {
  isAdmin: boolean;
  isConsultor: boolean;
  role: Roles;
  group: string;
  listasAsociadas: ListasAsociadas;
  sendEmailObj: ISendEmailConfig;
  setIsAdmin: (isAdmin: boolean) => void;
  setIsConsultor: (isConsultor: boolean) => void;
  setRole: (role: Roles) => void;
  setGroup: (group: string) => void;
  setListasAsociadas: (listas: ListasAsociadas) => void;
  //setSendEmailObj: (sendEmailObj:ISendEmailConfig ) => void;
};

type UserProviderProps = {
  children: ReactNode;
  initialRole?: Roles;
  initialIsAdmin?: boolean;
  initialIsConsultor?: boolean;
  initialGroup?: string;
  initialListasAsociadas?: ListasAsociadas;
  sendEmailObj?: ISendEmailConfig;
};

const UserContext = createContext<UserData | undefined>(undefined);

export const UserProvider = ({
  children,
  initialRole = Roles.Ninguno,
  initialIsAdmin = false,
  initialIsConsultor = false,
  initialGroup = "",
  initialListasAsociadas = { acciones: "", gestiones: "", obiras: "" },
  // sendEmailObj={url:"",key:""},
  sendEmailObj,
}: UserProviderProps) => {
  const [role, setRole] = useState<Roles>(initialRole);
  const [isAdmin, setIsAdmin] = useState<boolean>(initialIsAdmin);
  const [isConsultor, setIsConsultor] = useState<boolean>(initialIsConsultor);
  const [group, setGroup] = useState<string>(initialGroup);
  const [listasAsociadas, setListasAsociadas] =
    useState<ListasAsociadas>(initialListasAsociadas);
 // const[sendEmailObj, setSendEmailObj] = useState<ISendEmailConfig>(sendEmailObj);

  const value = useMemo<UserData>(
    () => ({
      role,
      isAdmin,
      isConsultor,
      group,
      listasAsociadas,
      sendEmailObj,
      setRole,
      setIsAdmin,
      setIsConsultor,
      setGroup,
      setListasAsociadas,
      // setSendEmailObj,
    }),
    [role, isAdmin, isConsultor, group, listasAsociadas,sendEmailObj]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext debe usarse dentro de UserProvider");
  }
  return context;
};
