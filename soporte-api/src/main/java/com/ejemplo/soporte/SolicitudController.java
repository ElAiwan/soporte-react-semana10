package com.ejemplo.soporte;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = "http://localhost:5173")
public class SolicitudController {
    private static final Set<String> PRIORIDADES = Set.of("Alta", "Media", "Baja");

    // Almacenamiento en memoria: se reinicia al detener la aplicación.
    private final List<Solicitud> solicitudes = new CopyOnWriteArrayList<>(List.of(
        new Solicitud(1L, "Equipo no enciende", "Alta", "Pendiente"),
        new Solicitud(2L, "Instalar software", "Media", "En proceso")
    ));
    private final AtomicLong secuencia = new AtomicLong(2);

    @GetMapping
    public List<Solicitud> listar() {
        return solicitudes;
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Solicitud datos) {
        String titulo = datos.titulo() == null ? "" : datos.titulo().trim();
        if (titulo.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "La descripción es obligatoria."));
        }
        if (!PRIORIDADES.contains(datos.prioridad())) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "La prioridad debe ser Alta, Media o Baja."));
        }
        Solicitud nueva = new Solicitud(
            secuencia.incrementAndGet(), titulo, datos.prioridad(), "Pendiente");
        solicitudes.add(nueva);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }
}
