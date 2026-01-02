import * as React from "react";
import { DefaultButton, IButtonProps } from "@fluentui/react";
import styles from "./ProveedorButton.module.scss";

export type ProveedorButtonVariant =
  | "bluePrimary"
  | "blueSecondary"
  | "blueDark"
  | "green"
  | "purple"
  | "grey"
  | "orange";

interface IProveedorButtonProps extends IButtonProps {
  text: string;
  variant: ProveedorButtonVariant;
  iconSrc?: string;
  iconAlt?: string;
  iconName?: string;
  subText?: string;
  children?: React.ReactNode;
}

export const ProveedorButton: React.FC<IProveedorButtonProps> = ({
  text,
  variant,
  iconSrc,
  iconAlt = "",
  iconName,
  className,
  subText,
  children,
  ...props
}) => {
  const buttonClassName = `${styles.proveedorButton} ${styles[variant]} ${
    className || ""
  }`;
  return (
    <DefaultButton className={buttonClassName} {...props}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          {iconSrc ? (
            <img src={iconSrc} alt={iconAlt} />
          ) : (
            <span className={styles.title}>{text}</span>
          )}
        </div>
        <span className={styles.subText}>{subText}</span>
        {children}
      </div>
    </DefaultButton>
  );
};
