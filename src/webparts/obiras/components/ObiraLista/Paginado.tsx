import * as React from "react";
import { Stack, DefaultButton, Dropdown, IDropdownOption } from "@fluentui/react";

interface PaginadoProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Paginado: React.FC<PaginadoProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
      <DefaultButton text="Anterior" onClick={handlePrev} disabled={currentPage === 1} />
      <span>
        Página {currentPage} de {totalPages}
      </span>
      <DefaultButton
        text="Siguiente"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      />
    </Stack>
  );
};

export default Paginado;
