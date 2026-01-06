import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lista, Roles } from "../../../../core/utils/Constants";
import { useUserContext } from "../../../../core/context/UserContext";
import styles from "./Proveedores.module.scss";
import { Proveedor } from "../../../../core/entities";
import ProveedorDatasource from "../../../../core/api/Proveedor/ProveedorDatasource";
import { CustomButton, BackButton } from "../../../../core/ui/components";
import { Stack, IStackStyles, IStackTokens } from "@fluentui/react";
import { ProveedorButton } from "../../../../core/ui/components/buttons/ProveedorButton";
import ObiraDataSource from "../../../../core/api/Obira/ObiraDataSource";
import volverIcon from "../../../../core/ui/icons/VolverIcon.svg";
import agregarIcon from "../../../../core/ui/icons/AgregarIcon.svg";
import { getDatasource, ProveedorMock, ObiraMock } from "../../../../core/mock";

interface ProveedorWithCount extends Proveedor {
  obirasCount: number;
}

const Proveedores: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useUserContext();
  const [proveedores, setProveedores] = useState<ProveedorWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stackStyles: IStackStyles = {
    root: {
      width: "100%",
      padding: "20px",
      ".ms-Button": {
        minWidth: "unset",
      },
    },
  };

  const containerStackStyles: IStackStyles = {
    root: {
      width: "80%",
      margin: "0 auto",
      maxWidth: "1200px",
    },
  };

  const headerStyles: IStackStyles = {
    root: {
      position: "sticky",
      top: 0,
      zIndex: 1,
      backgroundColor: "white",
      padding: "10px 0",
      display: "flex",
      justifyContent: "space-between",
    },
  };

  const stackTokens: IStackTokens = { childrenGap: 20 };

  const cargarProveedores = async () => {
    try {
      const proveedorDatasource = getDatasource(
        new ProveedorDatasource(Lista.Proveedores),
        new ProveedorMock()
      );
      const proveedoresActivos = await proveedorDatasource.getFilteredItems(
        "Activo eq 1",
        "Title"
      );
      console.log("🏢 [Proveedores] Proveedores activos:", proveedoresActivos.map(p => ({ Id: p.Id, Title: p.Title })));
      
      const proveedoresConConteos = await Promise.all(
        proveedoresActivos.map(async (proveedor) => {
          let obirasCount = 0;
          console.log(`🏢 [Proveedores] Procesando proveedor: ${proveedor.Title}, ListaAsociada:`, proveedor.ListaAsociada);
          
          if (proveedor.ListaAsociada) {
            const obiraDatasource = getDatasource(
              new ObiraDataSource(proveedor.ListaAsociada.obiras),
              new ObiraMock(proveedor.Title)
            );
            console.log(`🏢 [Proveedores] Creado ObiraMock con listTitle: ${proveedor.Title}`);
            const obirasActivas = await obiraDatasource.getFilteredItems("Activo eq 1");
            obirasCount = obirasActivas.length;
            console.log(`🏢 [Proveedores] ${proveedor.Title} tiene ${obirasCount} obiras`);
          }
          return {
            ...proveedor,
            ListaAsociada: proveedor.ListaAsociada || {},
            obirasCount,
          } as ProveedorWithCount;
        })
      );
      setProveedores(proveedoresConConteos);
    } catch (err) {
      console.error("Error cargando proveedores:", err);
      setError("Error al cargar los proveedores. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  const handleBack = () => {
    navigate("/");
  };

  const handleAddProveedor = () => {
    navigate("/proveedores/new");
  };
  const handleProveedorClick = (providerId: number, proveedorTitulo: string) => {
    const identificador = proveedorTitulo?.trim()
      ? proveedorTitulo.replace(/\s+/g, "-").toLowerCase()
      : `proveedor-${providerId}`;

    navigate(`/proveedores/${identificador}`);
  };

  return (
    <Stack styles={stackStyles}>
      <Stack.Item styles={headerStyles}>
        <BackButton onClick={handleBack} />
        {role !== Roles.Consultores && (
          <CustomButton
            text="Agregar Proveedor"
            variant="purple"
            onClick={handleAddProveedor}
            iconSrc={agregarIcon}
            iconAlt="Agregar Proveedor"
            iconPosition="left"
          />
        )}
      </Stack.Item>

      <Stack styles={containerStackStyles} tokens={stackTokens}>
        <Stack.Item>
          <h1>Proveedores</h1>
        </Stack.Item>

        {loading && (
          <Stack.Item>
            <div className={styles.loading}>
              <p>Cargando proveedores...</p>
            </div>
          </Stack.Item>
        )}

        {error && (
          <Stack.Item>
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          </Stack.Item>
        )}

        {!loading && !error && (
          <Stack.Item>
            <div className={styles.list}>
              {proveedores.length === 0 ? (
                <p className={styles.noData}>No se encontraron proveedores activos.</p>
              ) : (
                proveedores.map((provider) => {
                  const imageUrl =
                    provider.AttachmentFiles?.length > 0
                      ? provider.AttachmentFiles[0].ServerRelativeUrl
                      : null;

                  const obirasText = `${provider.obirasCount} ${
                    provider.obirasCount === 1 ? "Elemento" : "Elementos"
                  }`;
                  const displayText = provider.Title?.trim()
                    ? provider.Title
                    : `Proveedor ${provider.Id}`;

                  return (
                    <ProveedorButton
                      key={provider.Id}
                      text={displayText}
                      variant="grey"
                      onClick={() => handleProveedorClick(provider.Id, displayText)}
                      iconSrc={imageUrl}
                      iconAlt={displayText}
                      subText={obirasText}
                    />
                  );
                })
              )}
            </div>
          </Stack.Item>
        )}
      </Stack>
    </Stack>
  );
};

export default Proveedores;
