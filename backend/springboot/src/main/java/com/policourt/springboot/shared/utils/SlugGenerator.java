package com.policourt.springboot.shared.utils;

import java.text.Normalizer;
import java.util.Locale;
import java.util.concurrent.ThreadLocalRandom;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

/**
 * Componente utilitario para la generación y normalización de Slugs.
 * Se encarga de convertir textos en formatos URL-friendly y garantizar unicidad simple.
 */
@Component
public class SlugGenerator {

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    /**
     * Genera un slug a partir de un texto, añadiendo un sufijo aleatorio de 4 dígitos.
     * Ejemplo: "Fútbol Sala" -> "futbol-sala-4821"
     */
    public String generate(String input) {
        if (input == null || input.isBlank()) return "";
        
        String slug = sanitize(input);
        int randomSuffix = ThreadLocalRandom.current().nextInt(1000, 10000); // 1000 a 9999
        
        return slug + "-" + randomSuffix;
    }

    /**
     * Solo limpia el texto (sin números aleatorios). Útil cuando el usuario ya manda un slug.
     */
    public String sanitize(String input) {
        if (input == null) return "";
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}