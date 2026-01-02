import { IDatePickerStrings, DayOfWeek } from "@fluentui/react";

export const datePickerStrings: IDatePickerStrings = {
  months: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  shortMonths: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  days: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  shortDays: ["D", "L", "M", "M", "J", "V", "S"],
  goToToday: "Ir a hoy",
  prevMonthAriaLabel: "Mes anterior",
  nextMonthAriaLabel: "Mes siguiente",
  prevYearAriaLabel: "Año anterior",
  nextYearAriaLabel: "Año siguiente",
};

export const formatDate = (date?: Date): string => {
  if (!date) return "";
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
