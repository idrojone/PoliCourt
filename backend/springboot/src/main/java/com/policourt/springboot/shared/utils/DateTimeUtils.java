package com.policourt.springboot.shared.utils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Utilidades para manejo de fechas y horas con zona horaria Europe/Madrid.
 * Centraliza todas las conversiones de timezone para mantener consistencia en la aplicación.
 */
public final class DateTimeUtils {

    /**
     * Zona horaria de Madrid (CET/CEST).
     */
    public static final ZoneId MADRID_ZONE = ZoneId.of("Europe/Madrid");

    /**
     * Zona horaria UTC.
     */
    public static final ZoneId UTC_ZONE = ZoneId.of("UTC");

    /**
     * Formato ISO para fechas con zona horaria.
     */
    public static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    /**
     * Formato legible para fechas: "dd/MM/yyyy HH:mm".
     */
    public static final DateTimeFormatter READABLE_FORMATTER = 
        DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    /**
     * Formato solo fecha: "dd/MM/yyyy".
     */
    public static final DateTimeFormatter DATE_ONLY_FORMATTER = 
        DateTimeFormatter.ofPattern("dd/MM/yyyy");

    /**
     * Formato solo hora: "HH:mm".
     */
    public static final DateTimeFormatter TIME_ONLY_FORMATTER = 
        DateTimeFormatter.ofPattern("HH:mm");

    private DateTimeUtils() {
        // Utility class - no instanciar
    }

    /**
     * Obtiene la fecha/hora actual en zona horaria de Madrid.
     *
     * @return LocalDateTime actual en Madrid
     */
    public static LocalDateTime nowInMadrid() {
        return LocalDateTime.now(MADRID_ZONE);
    }

    /**
     * Convierte un LocalDateTime (asumido como UTC) a zona horaria de Madrid.
     *
     * @param utcDateTime fecha/hora en UTC
     * @return fecha/hora en zona horaria de Madrid
     */
    public static LocalDateTime utcToMadrid(LocalDateTime utcDateTime) {
        if (utcDateTime == null) {
            return null;
        }
        return utcDateTime
            .atZone(UTC_ZONE)
            .withZoneSameInstant(MADRID_ZONE)
            .toLocalDateTime();
    }

    /**
     * Convierte un LocalDateTime (asumido como Madrid) a UTC.
     *
     * @param madridDateTime fecha/hora en zona horaria de Madrid
     * @return fecha/hora en UTC
     */
    public static LocalDateTime madridToUtc(LocalDateTime madridDateTime) {
        if (madridDateTime == null) {
            return null;
        }
        return madridDateTime
            .atZone(MADRID_ZONE)
            .withZoneSameInstant(UTC_ZONE)
            .toLocalDateTime();
    }

    /**
     * Crea un ZonedDateTime en zona horaria de Madrid a partir de un LocalDateTime.
     *
     * @param localDateTime fecha/hora local
     * @return ZonedDateTime en zona horaria de Madrid
     */
    public static ZonedDateTime toMadridZoned(LocalDateTime localDateTime) {
        if (localDateTime == null) {
            return null;
        }
        return localDateTime.atZone(MADRID_ZONE);
    }

    /**
     * Formatea un LocalDateTime a string legible en formato "dd/MM/yyyy HH:mm".
     *
     * @param dateTime fecha/hora a formatear
     * @return string formateado o null si el input es null
     */
    public static String formatReadable(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(READABLE_FORMATTER);
    }

    /**
     * Formatea un LocalDateTime a string de solo fecha "dd/MM/yyyy".
     *
     * @param dateTime fecha/hora a formatear
     * @return string formateado o null si el input es null
     */
    public static String formatDateOnly(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DATE_ONLY_FORMATTER);
    }

    /**
     * Formatea un LocalDateTime a string de solo hora "HH:mm".
     *
     * @param dateTime fecha/hora a formatear
     * @return string formateado o null si el input es null
     */
    public static String formatTimeOnly(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(TIME_ONLY_FORMATTER);
    }

    /**
     * Parsea un string ISO a LocalDateTime.
     *
     * @param isoString string en formato ISO
     * @return LocalDateTime parseado
     */
    public static LocalDateTime parseIso(String isoString) {
        if (isoString == null || isoString.isBlank()) {
            return null;
        }
        return LocalDateTime.parse(isoString, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    /**
     * Verifica si una fecha/hora está en el pasado (respecto a Madrid).
     *
     * @param dateTime fecha/hora a verificar
     * @return true si está en el pasado
     */
    public static boolean isPast(LocalDateTime dateTime) {
        if (dateTime == null) {
            return false;
        }
        return dateTime.isBefore(nowInMadrid());
    }

    /**
     * Verifica si una fecha/hora está en el futuro (respecto a Madrid).
     *
     * @param dateTime fecha/hora a verificar
     * @return true si está en el futuro
     */
    public static boolean isFuture(LocalDateTime dateTime) {
        if (dateTime == null) {
            return false;
        }
        return dateTime.isAfter(nowInMadrid());
    }
}
