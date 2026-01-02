import React from "react";
import { TextField, ITextFieldProps } from "@fluentui/react";

export const TextArea: React.FC<ITextFieldProps> = (props) => {
  return <TextField {...props} multiline />;
};
