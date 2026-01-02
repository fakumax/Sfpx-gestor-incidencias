import React, { useState } from "react";
import { CustomButton } from "../../../../core";
import adjuntarIcon from "../../../../core/ui/icons/AdjuntarIcon.svg";
import { ISubirArchivoOptions, subirArchivos } from "../../../../core/utils/SubirArchivo";
import {
  MessageBar,
  MessageBarType,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IconButton,
  IColumn,
  Stack,
} from "@fluentui/react";
import { IFileAdd } from "../Formulario/Formulario";
import styles from "./FilesComponent.module.scss";
import ObiraDataSource from "../../../../core/api/Obira/ObiraDataSource";
import VistaPrevia from "../vistaPrevia/VistaPrevia";
import { useUserContext } from "../../../../core/context/UserContext";

interface IFilesComponentsProps {
  files: IFileAdd[];
  setFiles: (files: IFileAdd[]) => void;
  disabled?: boolean;
  options?: ISubirArchivoOptions;
  className?: string;
  message?: string;
  siteUrl?: string;
  errorFiles?: string;
}

const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const FilesComponent: React.FC<IFilesComponentsProps> = ({
  files,
  setFiles,
  disabled = false,
  options = {},
  className = "",
  message = "",
  errorFiles = "",
  siteUrl,
}) => {
  const getOrigin = () => {
    if (siteUrl) {
      try {
        const urlObj = new URL(siteUrl);
        return urlObj.origin;
      } catch {
        return window.location.origin;
      }
    }
    return window.location.origin;
  };
  const { isConsultor } = useUserContext();

  const [fileSizes, setFileSizes] = React.useState<{
    [id: string]: number | null;
  }>({});

  const [isAddButtonDisabled, setIsAddButtonDisabled] = React.useState(false);

  React.useEffect(() => {
    const fetchSizes = async () => {
      const sizes: { [id: string]: number | null } = {};
      const origin = getOrigin();
      for (const item of files.filter((f) => !f.deleted)) {
        if (item.file && item.file.size > 0) {
          sizes[item.id] = item.file.size;
        } else if (item.ServerRelativeUrl) {
          try {
            const ds = new ObiraDataSource("");
            const fullUrl = origin + item.ServerRelativeUrl;
            const realSize = await ds.getAttachmentSizeByUrl(fullUrl);
            sizes[item.id] = realSize > 0 ? realSize : null;
          } catch {
            sizes[item.id] = null;
          }
        } else {
          sizes[item.id] = null;
        }
      }
      setFileSizes(sizes);
    };
    fetchSizes();
  }, [files, siteUrl]);

  React.useEffect(() => {
    if (
      options.maxFiles &&
      files.filter((file) => !file.deleted).length >= options.maxFiles
    ) {
      setIsAddButtonDisabled(true);
    } else {
      setIsAddButtonDisabled(false);
    }
  }, [files, options.maxFiles]);

  const handleFileUpload = async () => {
    try {
      const selectedFiles = await subirArchivos("Documentos", options);
      const now = new Date();
      const shortTimestamp = `${now.getFullYear()}${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}${now
        .getHours()
        .toString()
        .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;
      const mappedFiles = selectedFiles.map((file: File) => {
        const ext = file.name.includes(".")
          ? file.name.substring(file.name.lastIndexOf("."))
          : "";
        const base = file.name.includes(".")
          ? file.name.substring(0, file.name.lastIndexOf("."))
          : file.name;
        const newName = `${base}_${shortTimestamp}${ext}`;
        const renamedFile = new File([file], newName, { type: file.type });
        return {
          id: generateUniqueId(),
          file: renamedFile,
          added: true,
          deleted: false,
        };
      });
      const updatedItems = [...files, ...mappedFiles];
      setFiles(updatedItems);
    } catch (error) {
      if (error === "User cancelled") {
        console.log("Selección de archivos cancelada por el usuario");
        return;
      }
      console.error("Error al seleccionar archivos:", error);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    const updatedItems = files.map((fileItem) =>
      fileItem.id === fileId ? { ...fileItem, deleted: true } : fileItem
    );
    setFiles(updatedItems);
  };

  const visibleFiles = files.filter((fileItem) => !fileItem.deleted);

  const columns: IColumn[] = [
    {
      key: "name",
      name: "Nombre del archivo",
      fieldName: "name",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: IFileAdd) => item.file.name,
    },
    {
      key: "size",
      name: "Tamaño",
      fieldName: "size",
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      onRender: (item: IFileAdd) => {
        const size = fileSizes[item.id];
        if (typeof size === "number") return `${(size / 1024).toFixed(2)} KB`;
        return "Cargando...";
      },
    },
    {
      key: "download",
      name: "Descargar",
      fieldName: "download",
      minWidth: 70,
      maxWidth: 70,
      onRender: (item: IFileAdd) => (
        <IconButton
          iconProps={{ iconName: "Download" }}
          onClick={async () => {
            if (item.file && item.file.size > 0) {
              const url = URL.createObjectURL(item.file);
              const a = document.createElement("a");
              a.href = url;
              a.download = item.file.name;
              document.body.appendChild(a);
              a.click();
              requestAnimationFrame(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              });
              return;
            }
            if (item.ServerRelativeUrl) {
              const fullUrl = getOrigin() + item.ServerRelativeUrl;
              try {
                const response = await fetch(fullUrl, {
                  credentials: "same-origin",
                });
                if (!response.ok) throw new Error("No se pudo descargar el archivo");
                const blob = await response.blob();
                const downloadUrl = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = downloadUrl;
                a.download = item.file.name;
                document.body.appendChild(a);
                a.click();
                requestAnimationFrame(() => {
                  document.body.removeChild(a);
                  URL.revokeObjectURL(downloadUrl);
                });
              } catch (err) {
                alert("Error al descargar el archivo");
              }
            }
          }}
          styles={{
            root: { color: "#666" },
            rootHovered: { color: "#0078d4" },
          }}
        />
      ),
    },
    {
      key: "delete",
      name: "Eliminar",
      fieldName: "delete",
      minWidth: 70,
      maxWidth: 70,
      onRender: (item: IFileAdd) =>
        !isConsultor ? (
          <IconButton
            iconProps={{ iconName: "Delete" }}
            onClick={() => handleRemoveFile(item.id)}
            styles={{
              root: { color: "#666" },
              rootHovered: { color: "#d00" },
            }}
          />
        ) : null,
    },
  ];

  return (
    <div className={className ? className : styles.fileComponentContainer}>
      <div className={styles.uploadSection}>
        <Stack tokens={{ childrenGap: 16 }}>
          {!isConsultor && (
            <Stack.Item>
              <CustomButton
                text="Adjuntar archivos"
                variant="purple"
                iconSrc={adjuntarIcon}
                iconAlt="Adjuntar archivos"
                iconPosition="left"
                outline
                onClick={handleFileUpload}
                disabled={disabled || isAddButtonDisabled}
              />
            </Stack.Item>
          )}
          {message && (
            <Stack.Item>
              <MessageBar
                messageBarType={MessageBarType.info}
                styles={{
                  root: {
                    background: "transparent",
                    selectors: {
                      ".ms-MessageBar-text": { fontStyle: "italic" },
                    },
                  },
                }}
              >
                {message}
              </MessageBar>
            </Stack.Item>
          )}
        </Stack>
      </div>
      {errorFiles && <span style={{ color: "#af4045", fontSize: 12 }}>{errorFiles}</span>}
      <div className={styles.filesList}>
        {visibleFiles.length > 0 && (
          <>
            <DetailsList
              items={visibleFiles}
              columns={columns}
              layoutMode={DetailsListLayoutMode.fixedColumns}
              selectionMode={SelectionMode.none}
              isHeaderVisible={true}
              compact={true}
            />
            <VistaPrevia files={visibleFiles} />
          </>
        )}
      </div>
    </div>
  );
};

export default FilesComponent;
