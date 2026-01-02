import * as React from "react";

export const renderWithTooltip = (text?: string) => (
  <div
    style={{
      maxWidth: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }}
    title={text}
  >
    {text}
  </div>
);
