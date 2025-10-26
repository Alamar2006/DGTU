package app.vx.dgtuhack2025.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
public class MatrixAndPFDTO {
    private Map<String, Map<String, String>> matrix;
    private List<PointFeature> pointsFeatures;
}
