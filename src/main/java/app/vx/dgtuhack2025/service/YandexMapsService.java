package app.vx.dgtuhack2025.service;

import app.vx.dgtuhack2025.config.YandexMapsConfig;
import app.vx.dgtuhack2025.dto.CoordinatesDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class YandexMapsService {

    private final YandexMapsConfig config;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public YandexMapsService(YandexMapsConfig config, ObjectMapper objectMapper) {
        this.config = config;
        this.objectMapper = objectMapper;
        this.webClient = WebClient.builder()
                .baseUrl(config.getGeocoderUrl())
                .build();
    }

    // Основной метод для получения координат
    public CoordinatesDTO getCoordinates(String address) {
        try {
            String response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("apikey", config.getApiKey())
                            .queryParam("geocode", address)
                            .queryParam("format", "json")
                            .build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return parseCoordinatesFromResponse(response, address);

        } catch (Exception e) {
            log.error("Error getting coordinates for address '{}': {}", address, e.getMessage());
            throw new RuntimeException("Failed to get coordinates for address: " + address);
        }
    }

    // Парсинг координат из ответа Яндекс API
    private CoordinatesDTO parseCoordinatesFromResponse(String jsonResponse, String originalAddress) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode featureMember = root.path("response")
                    .path("GeoObjectCollection")
                    .path("featureMember");

            if (featureMember.isArray() && featureMember.size() > 0) {
                JsonNode firstResult = featureMember.get(0)
                        .path("GeoObject")
                        .path("Point")
                        .path("pos");

                if (!firstResult.isMissingNode()) {
                    String[] coordinates = firstResult.asText().split(" ");
                    double longitude = Double.parseDouble(coordinates[0]);
                    double latitude = Double.parseDouble(coordinates[1]);

                    return new CoordinatesDTO(latitude, longitude, originalAddress);
                }
            }

            throw new RuntimeException("No coordinates found for address: " + originalAddress);

        } catch (Exception e) {
            throw new RuntimeException("Error parsing response: " + e.getMessage());
        }
    }

    // Массовое геокодирование нескольких адресов
    public List<CoordinatesDTO> getCoordinatesBatch(List<String> addresses) {
        return addresses.stream()
                .map(this::getCoordinates)
                .collect(Collectors.toList());
    }
}