package app.vx.dgtuhack2025.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DatasResponseDTO {
    private List<PointRequestDTO> clients;
    private List<CoordinatesResponseDTO> coords;
}
