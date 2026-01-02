import React, { useMemo, useEffect } from 'react';
import { Stack } from '@fluentui/react';
import { 
    encodeFileNameInUrl, 
    isSupportedImage 
} from '../../../../core/utils/Constants';
import { IFileAdd } from '../Formulario/Formulario';
import styles from "./VistaPrevia.module.scss";

interface VistaPreviaProps {
    files: IFileAdd[];
}

const VistaPrevia: React.FC<VistaPreviaProps> = ({ files }) => {
    // Crear URLs para las imágenes
    const imagenes = useMemo(() => {
        return files
            .filter(f => isSupportedImage(f.file.name))
            .map(f => {
                const nombre = f.file.name;
                const url =
                    f.file && f.file.size > 0
                        ? URL.createObjectURL(f.file)                 // local
                        : new URL(encodeFileNameInUrl(f.ServerRelativeUrl), window.location.origin).toString();  // sharepoint

                return { id: f.id, nombre, url };
            });
    }, [files]);

    // Limpiar blobs generados
    useEffect(() => {
        const urls = imagenes.map((img) => img.url);
        return () => {
            urls.forEach((url) => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [imagenes]);

    const renderImageCard = (file: {
        id: string;
        nombre: string;
        url: string;
    }) => (
        <div className={styles.imgCard} key={file.id}>
            <div className={styles.imgCardInner}>
                <div className={styles.imgViewport}>
                    <a
                        href={file.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        data-interception="off"
                        className={styles.imgLink}
                        aria-label={`Abrir ${file.nombre} en una nueva pestaña`}
                        title={`Click para visualizar la imagen en una nueva pestaña.`}
                    >
                        <img
                            className={styles.cardImg}
                            src={file.url}
                            alt={file.nombre}
                        />
                    </a>
                </div>
            </div>
            <div className={styles.caption} title={file.nombre}>
                {file.nombre}
            </div>
        </div>
    );

    return (
        <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 16 } }}>
            <div className={styles.gallery}>
                {imagenes.map((file) => renderImageCard(file))}
            </div>
        </Stack>
    );
};

export default VistaPrevia;
