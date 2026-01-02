import * as React from "react";
import {
  DefaultButton,
  PrimaryButton,
  Panel,
  IRenderFunction,
  IPanelProps,
  PanelType,
} from "@fluentui/react";

import styles from "./FormPanel.module.scss";

export interface IFormPanelProps {
  title?: string;
  isOpen?: boolean;
  className?: string;
  saveLabel?: string;
  cancelLabel?: string;
  onSave?: ((event?: React.FormEvent<HTMLFormElement>) => void) | (() => void);
  onCancel?: () => void;
  formName?: string;
  headerContent?: React.ReactNode;
  panelType?: PanelType;
}

const FormPanel: React.FunctionComponent<IFormPanelProps> = ({
  title,
  isOpen,
  className,
  saveLabel,
  cancelLabel,
  onCancel,
  onSave,
  formName,
  children,
  headerContent,
  panelType,
}) => {
  const handleDismiss = (event?: React.SyntheticEvent<HTMLElement>) => {
    if (event) event.preventDefault();
    if (onCancel) onCancel();
  };

  const handleFooterRender = () => {
    const saveProps = formName
      ? { form: formName, type: "submit" }
      : { onClick: () => onSave() };
    return (
      <React.Fragment>
        {saveLabel && <PrimaryButton {...saveProps}>{saveLabel}</PrimaryButton>}
        {cancelLabel && (
          <DefaultButton
            onClick={() => handleDismiss()}
            className={styles.rightButton}
          >
            {cancelLabel}
          </DefaultButton>
        )}
      </React.Fragment>
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSave) onSave(event);
  };

  const onRenderHeader: IRenderFunction<IPanelProps> = () => {
    if (headerContent) return <>{headerContent}</>;
    return (
      <span
        style={{
          fontSize: 18,
          fontWeight: 500,
          textTransform: "lowercase",
          color: "#333",
          background: "none",
        }}
      >
        {title}
      </span>
    );
  };

  const showButtons: boolean = !!(saveLabel || cancelLabel);

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={handleDismiss}
      closeButtonAriaLabel={cancelLabel}
      className={`${styles.formPanel} ${className}`}
      onRenderFooterContent={showButtons ? handleFooterRender : undefined}
      headerText={undefined}
      onRenderHeader={onRenderHeader}
      type={panelType || PanelType.smallFixedNear}
      isFooterAtBottom={showButtons}
      styles={{ navigation: { background: "none" } }}
    >
      <form className={styles.row} id={formName} onSubmit={handleSubmit}>
        {React.Children.map(children, (child) => (
          <div className={styles.column}>{child}</div>
        ))}
      </form>
    </Panel>
  );
};

export default FormPanel;
