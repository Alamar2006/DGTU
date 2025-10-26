package app.vx.dgtuhack2025.controller;

import app.vx.dgtuhack2025.dto.DatasResponseDTO;
import app.vx.dgtuhack2025.dto.PointRequestDTO;
import app.vx.dgtuhack2025.dto.PointResponseDTO;
import app.vx.dgtuhack2025.entity.Place;
import app.vx.dgtuhack2025.entity.Point;
import app.vx.dgtuhack2025.repository.PlaceRepository;
import app.vx.dgtuhack2025.service.PointService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/points")
public class PointController {

    @Autowired
    private PointService pointService;

    @Autowired
    private PlaceRepository placeRepository;

    @PostMapping("/addOne")
    public ResponseEntity<?> addToRoute (@RequestBody PointResponseDTO dto, HttpServletRequest request) {
        return ResponseEntity.ok(pointService.addPoint(dto, request));
    }

    /*@GetMapping("/getNow")
    public ResponseEntity<?> getNow () {

    }*/

    @GetMapping("/getAll")
    public List<Point> getPonits () {
        return pointService.getAll();
    }

    @GetMapping("/getAllById")
    public DatasResponseDTO getAllById (HttpServletRequest request) {
        return pointService.getAllById(request);
    }

    @PostMapping("/addMore")
    public ResponseEntity<?> addMore (@RequestBody List<PointResponseDTO> dto, HttpServletRequest request) {
        return ResponseEntity.ok(pointService.addPoints(dto, request));
    }

    @PutMapping("/change")
    public ResponseEntity<?> changeRoute (@RequestBody PointResponseDTO dto, HttpServletRequest request) {
        pointService.addPoint(dto, request);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteToRoute (@RequestParam Long id) {
        pointService.deletePoint(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @GetMapping("/pon")
    public List<Place> getAll () {
        return placeRepository.findAll();
    }
}
