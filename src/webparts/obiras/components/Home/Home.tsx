import * as React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import styles from "./Home.module.scss";
import type { IObirasProps } from "../IObirasProps";
import { Footer, Utils } from "../../../../core";
import { TitleButton } from "../../../../core/ui/components/buttons/TitleButton";
import homeImage from "../../../../core/ui/img/homeImage.png";
import obirasIcon from "../../../../core/ui/icons/obirasIcon.svg";
import instructivoIcon from "../../../../core/ui/icons/instructivoIcon.svg";
import bandejaTrabajoIcon from "../../../../core/ui/icons/bandejaTrabajoIcon.svg";
import administradoresIcon from "../../../../core/ui/icons/administradoresIcon.svg";
import proveedoresIcon from "../../../../core/ui/icons/proveedoresIcon.svg";
import tableroIcon from "../../../../core/ui/icons/TableroIcon.svg";
import ProveedorDatasource from "../../../../core/api/Proveedor/ProveedorDatasource";
import {
  Text,
  MessageBar,
  MessageBarType,
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton,
} from "@fluentui/react";
import { useItemAccionDatasource, useItemProveedorDatasource } from "../../../../core";
import { Lista, DOCUMENTOS_BIBLIOTECA, Roles } from "../../../../core/utils/Constants";
import { useUserContext } from "../../../../core/context/UserContext";

const Home: React.FunctionComponent<IObirasProps> = ({ context, tableroBIData }) => {
  const { role: userRole, group: userGroup } = useUserContext();
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState("");

  const navigate = useNavigate();

  const [{ items: acciones }, getAcciones] = useItemAccionDatasource(Lista.Acciones);
  const [{ items: proveedores }, , , , , , , getFilteredProveedores] =
    useItemProveedorDatasource(Lista.Proveedores);

  React.useEffect(() => {
    if (userRole === Roles.Proveedor && userGroup) {
      getFilteredProveedores(`Activo eq 1 and Title eq '${userGroup}'`);
    } else if (userRole === Roles.Administradores || userRole === Roles.Consultores) {
      // Carga los datos de la lista "Acciones" para administradores y consultores.
      // Si no se usan estos datos en la UI, esta llamada solo valida acceso a la Lista.
      getAcciones();
    }
  }, [userRole, userGroup]);

  const handleInstructivoClick = () => {
    try {
      const libraryUrl = `${context.pageContext.web.absoluteUrl}/${DOCUMENTOS_BIBLIOTECA}/Forms/AllItems.aspx`;
      Utils.openInNewTab(libraryUrl);
    } catch (error) {
      setDialogMessage(
        "Hubo un error al abrir la biblioteca de documentos. Por favor, inténtelo de nuevo más tarde."
      );
      setIsDialogVisible(true);
    }
  };

  const handleOpenTableroBI = () => {
    Utils.openInNewTab(tableroBIData);
  };

  const handleBandejaTrabajoClick = async () => {
    try {
      if (userGroup) {
        const proveedorDatasource = new ProveedorDatasource(Lista.Proveedores);
        const proveedoresActivos = await proveedorDatasource.getFilteredItems(
          `Activo eq 1 and Title eq '${userGroup}'`
        );
        if (proveedoresActivos.length > 0) {
          const proveedor = proveedoresActivos[0];
          if (proveedor.ListaAsociada) {
            const identificador = proveedor.Title?.trim()
              ? proveedor.Title.replace(/\s+/g, "-").toLowerCase()
              : `proveedor-${proveedor.Id}`;
            navigate(`/proveedores/${identificador}`, {
              state: {
                listaAsociada: proveedor.ListaAsociada,
                userRole: Roles.Proveedor,
              },
            });
          } else {
            setDialogMessage("El proveedor no tiene una lista de obiras asociada");
            setIsDialogVisible(true);
          }
        } else {
          setDialogMessage("No se encontraron proveedores activos para su grupo");
          setIsDialogVisible(true);
        }
      }
    } catch (error) {
      setDialogMessage("Error al buscar los proveedores. Por favor, intente nuevamente.");
      setIsDialogVisible(true);
    }
  };

  const handleProveedoresClick = () => {
    navigate("/proveedores");
  };

  const renderProprietaryButtons = () => (
    <>
      <TitleButton
        text="Proveedores"
        variant="bluePrimary"
        style={{ width: "100%" }}
        iconSrc={proveedoresIcon}
        iconAlt="Proveedores"
        onClick={handleProveedoresClick}
      />
      {userRole === Roles.Administradores && (
        <TitleButton
          text="Administradores"
          variant="blueSecondary"
          style={{ width: "100%" }}
          iconSrc={administradoresIcon}
          iconAlt="Administradores"
          onClick={() => {
            const adminUrl = `${context.pageContext.web.absoluteUrl.replace(
              /\/$/,
              ""
            )}/SitePages/Administradores.aspx`;
            Utils.openInNewTab(adminUrl);
          }}
        />
      )}
      <TitleButton
        text="Tablero BI"
        variant="purple"
        style={{ width: "100%" }}
        iconSrc={tableroIcon}
        iconAlt="Tablero BI"
        onClick={handleOpenTableroBI}
      />
      <TitleButton
        text="Instructivos"
        variant="green"
        style={{ width: "100%" }}
        iconSrc={instructivoIcon}
        iconAlt="Instructivos"
        onClick={handleInstructivoClick}
      />
    </>
  );

  const renderProviderButtons = () => (
    <>
      <TitleButton
        text="Bandeja de trabajo"
        variant="orange"
        style={{ width: "100%" }}
        iconSrc={bandejaTrabajoIcon}
        iconAlt="Bandeja de trabajo"
        onClick={handleBandejaTrabajoClick}
      />
      <TitleButton
        text="Tablero BI"
        variant="purple"
        style={{ width: "100%" }}
        iconSrc={tableroIcon}
        iconAlt="Tablero BI"
        onClick={handleOpenTableroBI}
      />
      <TitleButton
        text="Instructivos"
        variant="green"
        style={{ width: "100%" }}
        iconSrc={instructivoIcon}
        iconAlt="Instructivos"
        onClick={handleInstructivoClick}
      />
    </>
  );

  return (
    <>
      <section className={styles.adminContainer}>
        <div className={styles.leftPanel}>
          <div className={styles.leftContentWrapper}>
            <div>
              <div className={styles.leftPanelHeader}>
                <img src={obirasIcon} alt="Obiras Icon" className={styles.obirasIcon} />
                <span className={styles.obirasTitle}>Obiras</span>
              </div>
              <div className={styles.leftPanelText}>
                <Text variant="large" className={styles.welcomeText}>
                  Te damos la bienvenida al sistema de
                </Text>
                <Text variant="large" className={styles.welcomeText}>
                  registro para lecciones aprendidas.
                </Text>
              </div>
            </div>
            <img src={homeImage} alt="Home" className={styles.homeImage} />
          </div>
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.buttonsWrapper}>
            <div className={styles.buttonsContainer}>
              {(userRole === Roles.Administradores || userRole === Roles.Consultores) &&
                renderProprietaryButtons()}
              {userRole === Roles.Proveedor && renderProviderButtons()}
              {userRole === Roles.Ninguno && (
                <MessageBar messageBarType={MessageBarType.warning}>
                  No tienes acceso a ninguna sección del sistema.
                </MessageBar>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer version={Utils.getVersion()} />
      <Dialog
        hidden={!isDialogVisible}
        onDismiss={() => setIsDialogVisible(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Información",
        }}
      >
        <div>{dialogMessage}</div>
        <DialogFooter>
          <PrimaryButton onClick={() => setIsDialogVisible(false)} text="Aceptar" />
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default Home;
