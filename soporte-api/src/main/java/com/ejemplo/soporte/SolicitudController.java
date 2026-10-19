package com.ejemplo.soporte;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = "http://localhost:5173")
public class SolicitudController {
    @GetMapping
    public List<Map<String, Object>> listar() {
        return List.of(
            Map.of("id", 1, "titulo", "Equipo no enciende",
                   "prioridad", "Alta", "estado", "Pendiente"),
            Map.of("id", 2, "titulo", "Instalar software",
                   "prioridad", "Media", "estado", "En proceso")
        );
    }
}
