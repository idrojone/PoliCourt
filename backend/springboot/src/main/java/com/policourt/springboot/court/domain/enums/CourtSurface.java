package com.policourt.springboot.court.domain.enums;

/**
 * Enumerado que representa los diferentes tipos de superficie de una pista.
 */
public enum CourtSurface {
    /**
     * Superficie dura (cemento, asfalto, etc.).
     */
    HARD,
    /**
     * Superficie de tierra batida o arcilla.
     */
    CLAY,
    /**
     * Superficie de césped natural.
     */
    GRASS,
    /**
     * Superficie sintética (césped artificial, resina, etc.).
     */
    SYNTHETIC,
    /**
     * Superficie de madera o parqué.
     */
    WOOD,
    /**
     * Otros tipos de superficie.
     */
    OTHER
}