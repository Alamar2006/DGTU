package app.vx.dgtuhack2025.dto;

import lombok.Data;

import java.util.List;

@Data
public class OsrmResponse {
    private List<OsrmRoute> routes;
}