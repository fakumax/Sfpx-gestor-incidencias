import React from "react";
import { TextField, ITextFieldProps } from "@fluentui/react";

export const Input: React.FC<ITextFieldProps> = (props) => {
  return <TextField {...props} />;
};
