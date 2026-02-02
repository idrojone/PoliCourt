package com.policourt.springboot.court.domain.enums;

/**
 * Enumerado que representa los posibles estados de publicación de una pista deportiva.
 */
public enum CourtStatus {
    /**
     * La pista es visible para los usuarios y permite realizar reservas.
     */
    PUBLISHED,
    /**
     * La pista está en proceso de creación o edición y no es visible para el público.
     */
    DRAFT,
    /**
     * La pista ha sido retirada temporalmente pero se conserva su historial.
     */
    ARCHIVED,
    /**
     * La pista ha sido marcada para eliminación.
     */
    DELETED,
}
