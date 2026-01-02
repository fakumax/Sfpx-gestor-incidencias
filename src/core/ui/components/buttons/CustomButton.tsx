import * as React from "react";
import { DefaultButton, IButtonProps } from "@fluentui/react";
import styles from "./CustomButton.module.scss";

export type ButtonVariant =
  | "bluePrimary"
  | "blueSecondary"
  | "blueDark"
  | "green"
  | "purple"
  | "redDark"
  | "greyDark"
  | "greenDark"

interface ICustomButtonProps extends IButtonProps {
  text: string;
  variant: ButtonVariant;
  outline?: boolean;
  iconPosition?: "left" | "right";
  iconSrc?: string;
  iconAlt?: string;
}

export const CustomButton: React.FC<ICustomButtonProps> = ({
  text,
  variant,
  outline = false,
  iconPosition = "left",
  iconProps,
  iconSrc,
  iconAlt = "",
  className,
  ...props
}) => {
  const buttonClassName = `${styles.button} ${styles[variant]} ${
    outline ? styles.outline : ""
  } ${className || ""}`;

  const iconClassName = `${styles.icon} ${
    styles[
      `icon${iconPosition.charAt(0).toUpperCase()}${iconPosition.slice(1)}`
    ]
  }`;

  return (
    <DefaultButton className={buttonClassName} {...props}>
      {iconSrc ? (
        <>
          {iconPosition === "left" && (
            <img src={iconSrc} alt={iconAlt} className={iconClassName} />
          )}
          {text}
          {iconPosition === "right" && (
            <img src={iconSrc} alt={iconAlt} className={iconClassName} />
          )}
        </>
      ) : iconProps ? (
        <DefaultButton
          text={text}
          className={buttonClassName}
          iconProps={{
            ...iconProps,
            className: iconClassName,
          }}
          {...props}
        />
      ) : (
        text
      )}
    </DefaultButton>
  );
};
