package app.vx.dgtuhack2025.service;

import app.vx.dgtuhack2025.dto.*;
import app.vx.dgtuhack2025.entity.Place;
import app.vx.dgtuhack2025.entity.Point;
import app.vx.dgtuhack2025.repository.PlaceRepository;
import app.vx.dgtuhack2025.repository.PointRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Slf4j
@Service
public class PointService {

    @Autowired
    private PointRepository pointRepository;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private YandexMapsService yandexMapsService;

    @Autowired
    private TravelTimeService travelTimeService;

    //@Async
    @Transactional
    public CompletableFuture<MatrixAndPFDTO> addPoint (PointResponseDTO dto, HttpServletRequest request) {
        String sessionId = request.getSession().getId();
        Point point = convertToEntity(dto, sessionId);
        saveCoords(dto);
        pointRepository.save(point);
        return CompletableFuture.supplyAsync(() -> {
            List<PointResponseDTO> newDto = pointRepository.findsBySessionId(sessionId).stream()
                    .map(this::convertToDto)
                    .toList();
            return genMatrix(newDto);
        });
    }

    @Transactional
    public CompletableFuture<MatrixAndPFDTO> addPoints (List<PointResponseDTO> dtos, HttpServletRequest request) {
        try {
            String sessionId = request.getSession().getId();
            List<Point> points = dtos.stream()
                    .map(dto -> convertToEntity(dto, sessionId))
                    .collect(Collectors.toList());
            dtos.forEach(this::saveCoords);
            pointRepository.saveAll(points);

            List<PointResponseDTO> newDto = pointRepository.findAll().stream()
                    .map(this::convertToDto)
                    .toList();

            MatrixAndPFDTO matrixAndPFDTO = genMatrix(newDto);

            return CompletableFuture.completedFuture(matrixAndPFDTO);
        } catch (Exception e) {
            throw new RuntimeException();
        }
    }
    

    public void deletePoint (Long id) {
        pointRepository.findAll();
    }

    public DatasResponseDTO getAllById (HttpServletRequest request) {
        DatasResponseDTO dto = new DatasResponseDTO();
        String sessionId = request.getSession().getId();

        List<PointRequestDTO> newDto = pointRepository.findsBySessionId(sessionId).stream()
                .map(this::convertToDtoRequest)
                .toList();
        List<CoordinatesResponseDTO> dtoList = new ArrayList<>();
        for (PointRequestDTO pointRequestDTO : newDto) {
            Optional<Place> place = placeRepository.findById(pointRequestDTO.getAddress());
            dtoList.add(convertToDto(place));
        }
        dto.setClients(newDto);
        dto.setCoords(dtoList);
        return dto;
    }

    public List<Point> getAll () {
        return pointRepository.findAll();
    }

    private MatrixAndPFDTO genMatrix (List<PointResponseDTO> dtos) {
        List<LocationDTO> points = dtos.stream()
                .map(this::convertToCoords)
                .toList();

        MatrixAndPFDTO result = new MatrixAndPFDTO();
        result.setMatrix(generateMatrix(points));
        result.setPointsFeatures(generatePointsFeatures(dtos));

        return result;
    }

    private CoordinatesResponseDTO convertToDto (Optional<Place> place) {
        CoordinatesResponseDTO newDto = new CoordinatesResponseDTO();
        newDto.setLatitude(place.get().getLatitude());
        newDto.setLongitude(place.get().getLongitude());
        return newDto;
    }

    private Point convertToEntity(PointResponseDTO dto, String sessionId) {
        Point point = new Point();
        point.setAddress(dto.getAddress());
        point.setDayStart(dto.getDayStart());
        point.setDayEnd(dto.getDayEnd());
        point.setLunchStart(dto.getLunchStart());
        point.setLunchEnd(dto.getLunchEnd());
        point.setPriority(dto.getPriority());
        point.setSessionId(sessionId);
        point.setCreatedAt(LocalDateTime.now());
        saveCoords(dto);
        return point;
    }

    private PointResponseDTO convertToDto (Point point) {
        PointResponseDTO dto = new PointResponseDTO();
        dto.setAddress(point.getAddress());
        dto.setDayStart(point.getDayStart());
        dto.setDayEnd(point.getDayEnd());
        dto.setLunchStart(point.getLunchStart());
        dto.setLunchEnd(point.getLunchEnd());
        dto.setPriority(point.getPriority());
        return dto;
    }

    private PointRequestDTO convertToDtoRequest (Point point) {
        PointRequestDTO dto = new PointRequestDTO();
        dto.setId(point.getId());
        dto.setAddress(point.getAddress());
        dto.setDayStart(point.getDayStart());
        dto.setDayEnd(point.getDayEnd());
        dto.setLunchStart(point.getLunchStart());
        dto.setLunchEnd(point.getLunchEnd());
        dto.setPriority(point.getPriority());
        return dto;
    }



    public LocationDTO convertToCoords (PointResponseDTO dto) {
        LocationDTO dto1 = new LocationDTO();
        String addressId = dto.getAddress();

        Place place = placeRepository.findById(addressId).get();
        dto1.setLongitude(Double.parseDouble(place.getLongitude()));
        dto1.setLatitude(Double.parseDouble(place.getLatitude()));
        return dto1;
    }

    public void saveCoords (PointResponseDTO dto) {
        if (placeRepository.existsById(dto.getAddress())) {
            CoordinatesDTO dto1 = new CoordinatesDTO();
            String addressId = dto.getAddress();

            Optional<Place> placeOptional = placeRepository.findById(addressId);

            if (placeOptional.isPresent()) {
                Place place = placeOptional.get();
                dto1.setLongitude(Double.parseDouble(place.getLongitude()));
                dto1.setLatitude(Double.parseDouble(place.getLatitude()));
                dto1.setAddress(dto.getAddress());
                log.info("COORDS NON SAVE");
                return;
            }
        }
        CoordinatesDTO dto1 = yandexMapsService.getCoordinates(dto.getAddress());
        placeRepository.save(new Place(dto1.getAddress(), dto1.getLatitude(), dto1.getLongitude()));
        log.info("COORDS SAVE");
    }

    public LocationDTO convertToCoords (CoordinatesDTO dto) {
        LocationDTO locationDTO = new LocationDTO();
        locationDTO.setLatitude(dto.getLatitude());
        locationDTO.setLongitude(dto.getLongitude());
        return locationDTO;
    }

    public Map<String, Map<String, String>> generateMatrix (List<LocationDTO> points) {
        Map<String, Map<String, String>> matrix = new HashMap<>();
        int size = points.size();

        for (int i = 0; i < size; i++) {
            Map<String, String> row = new HashMap<>();
            for (int j = 0; j < size; j++) {
                if (i == j) {
                    row.put(String.valueOf(j + 1), "00:00:00");
                } else {
                    Duration travelTime = travelTimeService.calculateTravelTime(points.get(i), points.get(j), 60);
                    String timeStr = formatDuration(travelTime);
                    row.put(String.valueOf(j + 1), timeStr);
                }
            }
            matrix.put(String.valueOf(i + 1), row);
        }
        return matrix;
    }

    private String formatDuration(Duration duration) {
        long hours = duration.toHours();
        long minutes = duration.toMinutesPart();
        long seconds = duration.toSecondsPart();
        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
    }

    private List<PointFeature> generatePointsFeatures(List<PointResponseDTO> points) {
        List<PointFeature> features = new ArrayList<>();

        for (int i = 0; i < points.size(); i++) {
            PointFeature feature = new PointFeature();
            feature.setId(i + 1);
            feature.setPriority(points.get(i).getPriority());

            double lunchStart = getTime(points.get(i).getLunchStart());
            double lunchEnd = getTime(points.get(i).getLunchEnd());

            if (lunchStart == 0 || lunchEnd == 0) {
                TimeWindow timeWindow = new TimeWindow();
                timeWindow.setStart(getTimeStr(points.get(i).getDayStart()));
                timeWindow.setEnd(getTimeStr(points.get(i).getDayEnd()));
                feature.getTimeWindows().add(timeWindow);
                features.add(feature);
                continue;
            }

            feature.getTimeWindows().add(new TimeWindow(
                    getTimeStr(points.get(i).getDayStart()),
                    getTimeStr(points.get(i).getLunchStart())
            ));

            feature.getTimeWindows().add(new TimeWindow(
                    getTimeStr(points.get(i).getLunchEnd()),
                    getTimeStr(points.get(i).getDayEnd())
            ));

            features.add(feature);
        }
        return features;
    }

    private double getTime (LocalTime time) {
        if (time == null) {
            return 0;
        }
        return time.getHour() + time.getMinute() / 100.0;
    }

    private String getTimeStr (LocalTime time) {
        if (time == null) {
            return "00:00:00";
        }
        return time.toString();
    }
}
