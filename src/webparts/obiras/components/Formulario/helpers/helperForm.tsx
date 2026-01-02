import * as React from "react";
import { IDropdownOption } from "@fluentui/react";

export const renderDropdownOptionWithTooltip = (option?: IDropdownOption) => (
  <div
    style={{
      maxWidth: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }}
    title={option?.text}
  >
    {option?.text}
  </div>
);

export const renderDropdownTitleWithTooltip = (options?: IDropdownOption[]) => {
  const selected = options && options[0];
  return (
    <div
      style={{
        maxWidth: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
      title={selected?.text}
    >
      {selected?.text}
    </div>
  );
};
