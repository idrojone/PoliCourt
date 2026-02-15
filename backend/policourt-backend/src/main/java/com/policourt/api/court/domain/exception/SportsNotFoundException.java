package com.policourt.api.court.domain.exception;

import java.util.List;

public class SportsNotFoundException extends RuntimeException {
    public SportsNotFoundException(List<String> slugs) {
        super("No se encontraron los siguientes deportes: " + String.join(", ", slugs));
    }
}
