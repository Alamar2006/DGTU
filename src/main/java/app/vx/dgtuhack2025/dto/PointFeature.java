package app.vx.dgtuhack2025.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PointFeature {
    private int id;
    private String priority;
    private List<TimeWindow> timeWindows = new ArrayList<TimeWindow>();
}
