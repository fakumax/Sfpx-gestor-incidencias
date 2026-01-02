import * as React from "react";
import { DefaultButton, IButtonProps } from "@fluentui/react";
import styles from "./BackButton.module.scss";
import volverIcon from "../../icons/VolverIcon.svg";

interface IBackButtonProps extends IButtonProps {
  text?: string;
}

export const BackButton: React.FC<IBackButtonProps> = ({
  text = "Volver",
  className,
  ...props
}) => {
  return (
    <DefaultButton
      className={`${styles.backButton} ${className || ""}`}
      {...props}
    >
      <img src={volverIcon} alt="Volver" className={styles.icon} />
      <span className={styles.text}>{text}</span>
    </DefaultButton>
  );
};
