package app.vx.dgtuhack2025.service;

import app.vx.dgtuhack2025.dto.OsrmPoint;
import app.vx.dgtuhack2025.dto.OsrmResponse;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Service
public class OsrmService {

    private final RestTemplate restTemplate;
    private final String OSRM_BASE_URL = "http://router.project-osrm.org/route/v1/driving/";

    public OsrmService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    public Duration getTravelTime(OsrmPoint from, OsrmPoint to) {
        String url = String.format("%s%s,%s;%s,%s?overview=false",
                OSRM_BASE_URL,
                from.getLongitude(), from.getLatitude(),
                to.getLongitude(), to.getLatitude());

        OsrmResponse response = restTemplate.getForObject(url, OsrmResponse.class);

        if (response != null && response.getRoutes() != null && !response.getRoutes().isEmpty()) {
            double durationInSeconds = response.getRoutes().get(0).getDuration();
            return Duration.ofSeconds((long) durationInSeconds);
        }

        throw new RuntimeException("Failed to get route from OSRM");
    }
}