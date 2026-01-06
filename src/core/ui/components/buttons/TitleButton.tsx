import * as React from "react";
import { DefaultButton, IButtonProps } from "@fluentui/react";
import styles from "./TitleButton.module.scss";

export type TitleButtonVariant =
  | "bluePrimary"
  | "blueSecondary"
  | "blueDark"
  | "green"
  | "purple"
  | "orange";

interface ITitleButtonProps extends IButtonProps {
  text: string;
  variant: TitleButtonVariant;
  iconSrc?: string;
  iconAlt?: string;
}

export const TitleButton: React.FC<ITitleButtonProps> = ({
  text,
  variant,
  iconSrc,
  iconAlt = "",
  className,
  onClick,
  ...props
}) => {
  const buttonClassName = `${styles.titleButton} ${styles[variant]} ${
    className || ""
  }`;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("🔘 TitleButton clicked:", text);
    if (onClick) {
      onClick(e as any);
    }
  };

  return (
    <DefaultButton className={buttonClassName} onClick={handleClick} {...props}>
      <span className={styles.text}>{text}</span>
      {iconSrc && <img src={iconSrc} alt={iconAlt} className={styles.icon} />}
    </DefaultButton>
  );
};
