package app.vx.dgtuhack2025.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CoordinatesDTO {
    private double latitude;
    private double longitude;
    private String address;

    public CoordinatesDTO (double d1, double d2) {
        this.longitude = d1;
        this.latitude = d2;
    }
}