import * as React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import type { IObirasProps } from "./IObirasProps";
import Proveedores from "./Proveedores/Proveedores";
import ObiraLista from "./ObiraLista/ObiraLista";
import Formulario from "./Formulario/Formulario";
import Home from "./Home/Home";
import styles from "./Obiras.module.scss";
import { useUserContext } from "../../../core/context/UserContext";
import { Lista, Roles } from "../../../core/utils/Constants";
import { useItemProveedorDatasource } from "../../../core";
import FormAdd from "./Formulario/FormAdd/FormAdd";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import NewProveedor from "../pages/NewProveedor/NewProveedor";

const Obiras: React.FC<IObirasProps> = (props) => {
  const { role, isAdmin, group, listasAsociadas, setListasAsociadas } = useUserContext();
  const isAdminOrConsultor = role === Roles.Administradores || role === Roles.Consultores;
  const [{ items: proveedores }, , , , , , , getFilteredProveedores] =
    useItemProveedorDatasource(Lista.Proveedores);

  React.useEffect(() => {
    const contextData = {
      role,
      isAdmin,
      group,
      listasAsociadas,
    };
  }, [role, isAdmin, group, listasAsociadas]);

  React.useEffect(() => {
    if (group) {
      getFilteredProveedores(`Activo eq 1 and Title eq '${group}'`);
    }
  }, [group]);

  React.useEffect(() => {
    if (proveedores?.length > 0 && proveedores[0]?.ListaAsociada) {
      const newListasAsociadas = {
        acciones: proveedores[0].ListaAsociada.acciones || "",
        gestiones: proveedores[0].ListaAsociada.gestiones || "",
        obiras: proveedores[0].ListaAsociada.obiras || "",
      };

      if (JSON.stringify(newListasAsociadas) !== JSON.stringify(listasAsociadas)) {
        setListasAsociadas(newListasAsociadas);
      }
    }
  }, [proveedores]);

  return (
    <div className={styles.Container}>
      <Router>
        <Routes>
          {isAdminOrConsultor && (
            <Route
              path="/proveedores"
              element={
                <ProtectedRoute requiredRole={role}>
                  <Proveedores {...props} />
                </ProtectedRoute>
              }
            />
          )}
          <Route
            path="/proveedores/new"
            element={
              <ProtectedRoute requiredRole={Roles.Administradores}>
                <NewProveedor {...props} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proveedores/:proveedorNombre/new"
            element={<FormAdd {...props} />}
          />
          <Route
            path="/proveedores/:proveedorNombre/:obiraId"
            element={<Formulario {...props} />}
          />
          <Route
            path="/proveedores/:proveedorNombre"
            element={
              <ProtectedRoute requiredRole={Roles.Proveedor}>
                <ObiraLista {...props} />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Home {...props} />} />
        </Routes>
      </Router>
    </div>
  );
};

export default Obiras;
