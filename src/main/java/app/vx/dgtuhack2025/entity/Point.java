package app.vx.dgtuhack2025.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Point {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "point_generator")
    @SequenceGenerator(
            name = "point_generator",
            sequenceName = "point_sequence",
            allocationSize = 1
    )
    private Long id;
    private String sessionId;
    private String address;
    private LocalTime dayStart;
    private LocalTime dayEnd;
    private LocalTime lunchStart;
    private LocalTime lunchEnd;
    private LocalDateTime createdAt;
    private String priority;
}
