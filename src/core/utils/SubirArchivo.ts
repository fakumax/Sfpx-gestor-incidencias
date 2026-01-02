export interface ISubirArchivoOptions {
  maxFiles?: number;
  maxFileSize?: number;
  allowedFormats?: string[];
}

const defaultOptions: ISubirArchivoOptions = {
  // Sin restricciones por defecto
};

export const subirArchivos = async (
  libraryName: string,
  options: ISubirArchivoOptions = defaultOptions
): Promise<File[]> => {
  return new Promise((resolve, reject) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.style.display = "none";
    fileInput.accept = options.allowedFormats?.join(",") || "";

    document.body.appendChild(fileInput);

    fileInput.onchange = async (event) => {
      const files = Array.from((event.target as HTMLInputElement).files || []);

      try {

        if (options.maxFiles && files.length > options.maxFiles) {
          reject(
            new Error(
              `Se permite un máximo de ${options.maxFiles} archivo(s). Seleccionaste ${files.length}.`
            )
          );
          return;
        }

        if (options.maxFileSize) {
          const invalidFiles = files.filter(
            (file) => file.size > options.maxFileSize
          );
          if (invalidFiles.length > 0) {
            reject(
              new Error(
                `Algunos archivos exceden el tamaño máximo permitido de ${options.maxFileSize / (1024 * 1024)
                } MB.`
              )
            );
            return;
          }
        }

        if (options.allowedFormats) {
          const invalidFiles = files.filter(
            (file) => !options.allowedFormats.includes(file.type)
          );
          if (invalidFiles.length > 0) {
            reject(
              new Error(
                `Algunos archivos tienen un formato no permitido. Formatos permitidos: ${options.allowedFormats.join(
                  ", "
                )}.`
              )
            );
            return;
          }
        }

        resolve(files);
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(fileInput);
      }
    };

    fileInput.click();
  });
};
