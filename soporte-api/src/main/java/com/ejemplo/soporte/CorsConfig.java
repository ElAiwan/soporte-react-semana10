package com.ejemplo.soporte;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// CORS global: a diferencia de @CrossOrigin, también cubre las respuestas
// de error (/error), así el frontend puede leer un 404 o un 500 en lugar de
// verlos como un fallo de red.
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Value("${app.cors.origen:http://localhost:5173}")
    private String origen;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(origen)
            .allowedMethods("GET", "POST");
    }
}
