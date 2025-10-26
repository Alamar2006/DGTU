package app.vx.dgtuhack2025.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PointResponseDTO {
    private String address;
    private LocalTime dayStart;
    private LocalTime dayEnd;
    private LocalTime lunchStart;
    private LocalTime lunchEnd;
    private String priority;
}
