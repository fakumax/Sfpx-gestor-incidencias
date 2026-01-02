import * as React from "react";
import { ThemeProvider, MessageBarType } from "@fluentui/react";

import "../../../../core/ui/scss/fonts.module.scss";
import {
  Footer,
  LoadingSpinner,
  MessageBar,
  List,
  ShowPanel,
  Utils,
  useItemDatasource,
  Input,
  TextArea,
} from "../../../../core";
import { CustomButton } from "../../../../core/ui/components/buttons/CustomButton";
import { TitleButton } from "../../../../core/ui/components/buttons/TitleButton";
import { IMessageBarProps } from "../../../../core/ui/components/MessageBar/MessageBar";
import instructivoIcon from "../../../../core/ui/icons/instructivoIcon.svg";

import styles from "./Template.module.scss";
import * as strings from "TemplateWebPartStrings";

export interface ITemplateProps {
  description: string;
  listTitle: string;
}

const Template: React.FunctionComponent<ITemplateProps> = ({ listTitle }) => {
  const [{ items, isLoading, error }, getItems] = useItemDatasource(listTitle);

  const [message, setMessage] = React.useState<IMessageBarProps>({
    text: "",
    messageType: MessageBarType.info,
  });

  React.useEffect(() => {
    if (error) {
      setMessage({
        text: strings.ErrorText,
        messageType: MessageBarType.error,
      });
    }
  }, [error]);

  React.useEffect(() => {
    if (isLoading) {
      setMessage({
        text: strings.LoadingText,
        messageType: MessageBarType.info,
      });
    }
  }, [isLoading]);

  React.useEffect(() => {
    if (!isLoading && items.length > 0) {
      setMessage({
        text: strings.SuccessText,
        messageType: MessageBarType.success,
      });
    }
  }, [isLoading, items]);

  return (
    <ThemeProvider className={styles.template}>
      <div>
        <MessageBar {...message} />
        <div className={styles.container}>
          {/* Sección de Botones Primarios */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Botones Primarios</h2>
            <div className={styles.buttonGroup}>
              <CustomButton text="Botón Azul Principal" variant="bluePrimary" />
              <CustomButton
                text="Botón Azul Secundario"
                variant="blueSecondary"
                iconProps={{ iconName: "Add" }}
                iconPosition="left"
              />
              <CustomButton
                text="Botón Azul Oscuro"
                variant="blueDark"
                iconProps={{ iconName: "ChevronRight" }}
                iconPosition="right"
              />
              <CustomButton
                text="Botón Verde"
                variant="green"
                iconProps={{ iconName: "CheckMark" }}
              />
              <CustomButton
                text="Botón Violeta"
                variant="purple"
                iconProps={{ iconName: "Star" }}
              />
            </div>
          </div>

          {/* Sección de Botones Outline */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Botones Outline</h2>
            <div className={styles.buttonGroup}>
              <CustomButton
                text="Botón Azul Principal"
                variant="bluePrimary"
                outline
              />
              <CustomButton
                text="Botón Azul Secundario"
                variant="blueSecondary"
                outline
                iconProps={{ iconName: "Add" }}
                iconPosition="left"
              />
              <CustomButton
                text="Botón Verde"
                variant="green"
                outline
                iconProps={{ iconName: "CheckMark" }}
              />
              <CustomButton
                text="Botón Violeta"
                variant="purple"
                outline
                iconProps={{ iconName: "Star" }}
              />
            </div>
          </div>

          {/* Sección de Botones de Título */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Botones de Título</h2>
            <div className={styles.buttonGroup}>
              <TitleButton
                text="Instructivo"
                variant="green"
                iconSrc={instructivoIcon}
                iconAlt="Instructivo Icon"
              />
              <TitleButton
                text="Documentación"
                variant="bluePrimary"
                iconSrc={instructivoIcon}
                iconAlt="Documentación Icon"
              />
              <TitleButton
                text="Recursos"
                variant="purple"
                iconSrc={instructivoIcon}
                iconAlt="Recursos Icon"
              />
            </div>
          </div>

          {/* Sección de Inputs */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Campos de Entrada</h2>
            <div className={styles.inputGroup}>
              <Input placeholder="Input estándar" />
              <TextArea placeholder="TextArea multilinea" />
            </div>
          </div>
        </div>
        <Footer version={Utils.getVersion()} />
      </div>
    </ThemeProvider>
  );
};

export default Template;
