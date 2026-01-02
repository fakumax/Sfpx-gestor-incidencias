import { Modal, Spinner, SpinnerSize, Stack, Text } from "@fluentui/react";
import React from "react";
import { CustomButton } from "../../../../../core";
import {
  Accion,
  AccionProgresiva,
  TituloDeAccion,
  TextoDeAccion,
} from "../../../../../core/utils/Constants";

interface IPopupProps {
  accion: Accion;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDismiss: () => void;
  handleConfirmacionAsync?: () => Promise<void> | null;
  handleConfirmacion?: () => void | null;
}

const PopupDeAcciones = ({
  accion,
  isOpen,
  setIsOpen,
  onDismiss,
  handleConfirmacionAsync = null,
  handleConfirmacion = null,
}: IPopupProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirmar = async () => {
    setIsLoading(true);
    try {
      if (handleConfirmacion) {
        handleConfirmacion();
      } else if (handleConfirmacionAsync) {
        await handleConfirmacionAsync();
      }
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      isBlocking={true}
      containerClassName="modalContainer"
    >
      <Stack tokens={{ childrenGap: 20 }} style={{ padding: 32, minWidth: 350 }}>
        <Text variant="large" style={{ fontWeight: 600 }}>
          {TituloDeAccion[accion]}
        </Text>
        <Text>{TextoDeAccion[accion]}</Text>
        {isLoading ? (
          <Spinner label={AccionProgresiva[accion]} size={SpinnerSize.large} />
        ) : (
          <Stack horizontal tokens={{ childrenGap: 16 }}>
            {accion !== Accion.RESTAURAR_INCOMPLETO && (
              <CustomButton
                text="No"
                variant="greyDark"
                onClick={() => setIsOpen(false)}
              />
            )}
            <CustomButton
              text={accion !== Accion.RESTAURAR_INCOMPLETO ? "Sí" : "Aceptar"}
              variant={
                accion === Accion.RESTAURAR ||
                accion === Accion.RESTAURAR_INCOMPLETO ||
                accion === Accion.GUARDAR
                  ? "greenDark"
                  : "redDark"
              }
              onClick={handleConfirmar}
              type="button"
            />
          </Stack>
        )}
      </Stack>
    </Modal>
  );
};

export default PopupDeAcciones;
