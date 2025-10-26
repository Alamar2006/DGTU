package app.vx.dgtuhack2025.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
// TravelTimeResponse.java
public class TravelTimeResponse {
    private double distanceKm;
    private String carTime;        // в формате "2 ч 30 мин"
    private long carTimeMinutes;        // в минутах
}