import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../../../../core/context/UserContext";
import { useParams } from "react-router-dom";
import { Roles } from "../../../../core/utils/Constants";

interface ProtectedRouteProps {
  requiredRole: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, children }) => {
  const { proveedorNombre } = useParams<{ proveedorNombre: string }>();
  const { role, group } = useUserContext();
  const isAdminOrConsultor = role === Roles.Administradores || role === Roles.Consultores;
  if (
    (requiredRole === Roles.Proveedor &&
      (group?.toLocaleUpperCase() === proveedorNombre?.toLocaleUpperCase() ||
        isAdminOrConsultor)) ||
    (requiredRole === role && isAdminOrConsultor)
  ) {
    return <>{children}</>;
  }

  return <Navigate to="/" />;
};

export default ProtectedRoute;
