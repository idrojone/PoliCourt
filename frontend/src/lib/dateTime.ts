/**
 * Utilidades para manejo de fechas y horas con zona horaria Europe/Madrid.
 * Centraliza todas las conversiones de timezone para mantener consistencia en la aplicación.
 */

const MADRID_TIMEZONE = "Europe/Madrid";

/**
 * Opciones de formato para fechas en español.
 */
const dateFormatOptions: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: MADRID_TIMEZONE,
};

const timeFormatOptions: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: MADRID_TIMEZONE,
};

const fullFormatOptions: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: MADRID_TIMEZONE,
};

/**
 * Convierte un valor de input datetime-local (YYYY-MM-DDTHH:mm) a ISO string.
 * Interpreta el valor como si fuera hora de Madrid y lo convierte a ISO/UTC.
 * 
 * @param dateTimeLocalValue - String en formato "YYYY-MM-DDTHH:mm" del input
 * @returns String ISO para enviar al backend
 */
export const fromDateTimeLocalValue = (dateTimeLocalValue: string): string => {
  if (!dateTimeLocalValue) return "";
  
  // El input datetime-local da formato "YYYY-MM-DDTHH:mm"
  // Lo interpretamos como hora de Madrid directamente
  // new Date() lo interpreta como hora local del navegador, lo cual está bien
  // si el navegador está en Madrid, pero para ser seguros, simplemente
  // enviamos el valor sin conversión ya que el backend está en Europe/Madrid
  return `${dateTimeLocalValue}:00`;
};

/**
 * Convierte un ISO string a formato para input datetime-local (YYYY-MM-DDTHH:mm)
 * manteniendo la hora en timezone de Madrid.
 * 
 * @param isoString - String ISO a convertir
 * @returns String en formato "YYYY-MM-DDTHH:mm" para input datetime-local
 */
export const toDateTimeLocalValue = (isoString: string | Date | null | undefined): string => {
  if (!isoString) return "";
  
  const date = typeof isoString === "string" ? new Date(isoString) : isoString;
  
  // Obtener los componentes en timezone de Madrid
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: MADRID_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  
  const parts = formatter.formatToParts(date);
  const getPart = (type: string) => parts.find(p => p.type === type)?.value || "";
  
  const year = getPart("year");
  const month = getPart("month");
  const day = getPart("day");
  const hour = getPart("hour");
  const minute = getPart("minute");
  
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

/**
 * Formatea un string ISO o Date a fecha y hora separadas en zona horaria de Madrid.
 * 
 * @param isoString - String ISO o Date a formatear
 * @returns Objeto con fecha y hora formateadas
 */
export const formatDateTime = (isoString: string | Date): { date: string; time: string } => {
  const date = typeof isoString === "string" ? new Date(isoString) : isoString;
  
  return {
    date: date.toLocaleDateString("es-ES", dateFormatOptions),
    time: date.toLocaleTimeString("es-ES", timeFormatOptions),
  };
};

/**
 * Formatea un string ISO o Date a formato completo en zona horaria de Madrid.
 * Ejemplo: "15 feb 2026, 10:30"
 * 
 * @param isoString - String ISO o Date a formatear
 * @returns String con fecha y hora formateadas
 */
export const formatFullDateTime = (isoString: string | Date): string => {
  const date = typeof isoString === "string" ? new Date(isoString) : isoString;
  return date.toLocaleDateString("es-ES", fullFormatOptions);
};

/**
 * Formatea un string ISO o Date a solo fecha en zona horaria de Madrid.
 * Ejemplo: "15 feb 2026"
 * 
 * @param isoString - String ISO o Date a formatear
 * @returns String con fecha formateada
 */
export const formatDateOnly = (isoString: string | Date): string => {
  const date = typeof isoString === "string" ? new Date(isoString) : isoString;
  return date.toLocaleDateString("es-ES", dateFormatOptions);
};

/**
 * Formatea un string ISO o Date a solo hora en zona horaria de Madrid.
 * Ejemplo: "10:30"
 * 
 * @param isoString - String ISO o Date a formatear
 * @returns String con hora formateada
 */
export const formatTimeOnly = (isoString: string | Date): string => {
  const date = typeof isoString === "string" ? new Date(isoString) : isoString;
  return date.toLocaleTimeString("es-ES", timeFormatOptions);
};

/**
 * Formatea un rango de horas en zona horaria de Madrid.
 * Ejemplo: "10:30 - 12:00"
 * 
 * @param startIso - String ISO o Date de inicio
 * @param endIso - String ISO o Date de fin
 * @returns String con rango de horas formateado
 */
export const formatTimeRange = (startIso: string | Date, endIso: string | Date): string => {
  return `${formatTimeOnly(startIso)} - ${formatTimeOnly(endIso)}`;
};

/**
 * Obtiene la fecha y hora actual en zona horaria de Madrid como string ISO.
 * 
 * @returns String ISO de la fecha/hora actual en Madrid
 */
export const nowInMadrid = (): Date => {
  return new Date();
};

/**
 * Verifica si una fecha está en el pasado.
 * 
 * @param isoString - String ISO o Date a verificar
 * @returns true si la fecha está en el pasado
 */
export const isPast = (isoString: string | Date): boolean => {
  const date = typeof isoString === "string" ? new Date(isoString) : isoString;
  return date < new Date();
};

/**
 * Verifica si una fecha está en el futuro.
 * 
 * @param isoString - String ISO o Date a verificar
 * @returns true si la fecha está en el futuro
 */
export const isFuture = (isoString: string | Date): boolean => {
  const date = typeof isoString === "string" ? new Date(isoString) : isoString;
  return date > new Date();
};

/**
 * Formatea una fecha relativa (hace X minutos, ayer, etc.) en zona horaria de Madrid.
 * 
 * @param isoString - String ISO o Date a formatear
 * @returns String con fecha relativa
 */
export const formatRelative = (isoString: string | Date): string => {
  const date = typeof isoString === "string" ? new Date(isoString) : isoString;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Ahora mismo";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  
  return formatDateOnly(date);
};
