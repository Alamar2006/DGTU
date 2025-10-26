package app.vx.dgtuhack2025.service;

import app.vx.dgtuhack2025.dto.LocationDTO;
import app.vx.dgtuhack2025.dto.TravelTimeResponse;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class TravelTimeService {

    private static final double EARTH_RADIUS_KM = 6371.0;

    public double calculateDistance(LocationDTO point1, LocationDTO point2) {
        double lat1 = Math.toRadians(point1.getLatitude());
        double lon1 = Math.toRadians(point1.getLongitude());
        double lat2 = Math.toRadians(point2.getLatitude());
        double lon2 = Math.toRadians(point2.getLongitude());

        double dLat = lat2 - lat1;
        double dLon = lon2 - lon1;

        double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                        Math.sin(dLon/2) * Math.sin(dLon/2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return EARTH_RADIUS_KM * c;
    }

    public TravelTimeResponse calculateDetailedTravelTime(LocationDTO start, LocationDTO end) {
        double distance = calculateDistance(start, end);

        // Расчет времени в минутах
        long walkingTimeMinutes = Math.round((distance / 5.0) * 60);
        long carTimeMinutes = Math.round((distance / 60.0) * 60);
        long bicycleTimeMinutes = Math.round((distance / 15.0) * 60);

        TravelTimeResponse response = new TravelTimeResponse();
        response.setDistanceKm(Math.round(distance * 100.0) / 100.0);
        response.setCarTimeMinutes(carTimeMinutes);
        response.setCarTime(formatTime(carTimeMinutes));

        return response;
    }

    private String formatTime(long totalMinutes) {
        if (totalMinutes < 60) {
            return totalMinutes + " мин";
        }

        long hours = totalMinutes / 60;
        long minutes = totalMinutes % 60;

        if (minutes == 0) {
            return hours + " ч";
        } else {
            return hours + " ч " + minutes + " мин";
        }
    }


    public Duration calculateTravelTime(LocationDTO start, LocationDTO end, double speedKmH) {
        double distance = calculateDistance(start, end);
        long totalMinutes = Math.round((distance / speedKmH) * 60);
        return Duration.ofMinutes(totalMinutes);
    }
}